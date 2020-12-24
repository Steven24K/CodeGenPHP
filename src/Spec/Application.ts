import * as fs from "fs-extra"
import { Map } from "immutable"
import * as path from "path"
import { CreateApiCall_snippet, CreateRelation_snippet, DeleteApiCall_snippet, DeleteRelation_snippet, GetApiCall_snippet, GetRelation_snippet, UpdateApiCall_snippet, UpdateRelation_snippet } from "../snippets/api_snippets"
import { CreateConfig_snippet } from "../snippets/config_snippets"
import { initDatabase_snippet } from "../snippets/sql_snippets"
import { walk_dir } from "../utils/FileWritng"
import { Optional } from "../utils/types"
import { Model } from "./Model"
import { Permission } from "./Permission"
import { Relation } from "./Relation"

export interface Application {
    projectName: string
    models: Map<string, Model>
    relations: Map<string, Relation>
    model_permissions: Map<string, Permission>

    api_version?: string

    addModels: (...models: Model[]) => Application
    addRelations: (...relations: Relation[]) => Application

    run: (dir?: string) => void
}



export const defaultAppOptions: Required<Optional<Application>> = ({
    api_version: 'v1', 
})

export const Application = (name: string, options: Optional<Application> = defaultAppOptions): Application => ({
    projectName: name,
    ...defaultAppOptions,
    ...options,
    models: Map(),
    relations: Map(),
    model_permissions: Map(),

    addModels: function (...models: Model[]): Application {
        models.forEach(m => {
            if (this.models.has(m.name)) {
                console.log(`model ${m.name} does allready exist`)
            } else {
                console.log(`model ${m.name} added`)
                this.models = this.models.set(m.name, m)
            }
        })
        return this
    },

    addRelations: function (...relations: Relation[]): Application {
        relations.forEach(r => {
            if (this.relations.has(`${r.source}_${r.target}`)) {
                console.log(`relation ${r.source}_${r.target} does allready exist`)
            } else if (!this.models.has(r.target)) {
                console.log(`No model for target: ${r.target}`)
            } else if (!this.models.has(r.source)) {
                console.log(`No model for source: ${r.source}`)
            } else {
                console.log(`${r.source}_${r.target} added`)
                this.relations = this.relations.set(`${r.source}_${r.target}`, r)
            }
        })

        return this
    },

    run: function (dir = '../Samples'): void {

        let models = this.models.toArray().map(m => m[1])
        let relations = this.relations.toArray().map(m => m[1])

        let mainDir = `${dir}/${this.projectName.replace(/ /g, '_')}`
        fs.ensureDirSync(mainDir)

        // Copy over template files, this contains utils, databaseconnections etc.
        let template_dir = 'template'
        let template_files = walk_dir(template_dir)
        template_files.forEach(template_file => {
            let content = fs.readFileSync(`${template_dir}/${template_file}`, 'utf-8')
            let new_file

            if (template_file.includes('api')) {
                new_file = `${mainDir}/${template_file.replace('api/', `api/${this.api_version}/`)}`
                fs.ensureDirSync(path.dirname(new_file))
                fs.writeFile(new_file, content)
            } else {
                new_file = `${mainDir}/${template_file}`
                fs.ensureDirSync(path.dirname(new_file))
                fs.writeFileSync(new_file, content)
            }

            console.log(`Generated ${new_file}`)

        })


        // Generate config file 
        let config = CreateConfig_snippet(models)
        fs.writeFileSync(`${mainDir}/config.php`, config)
        console.log('Generated config.php')

        // Generate init file 
        let init_file = initDatabase_snippet(models, relations)
        fs.writeFileSync(`${mainDir}/init.php`, init_file)
        console.log('Generate init.php')


        // Generate api
        models.forEach(model => {
            let get = GetApiCall_snippet(model)
            let create = CreateApiCall_snippet(model)
            let update = UpdateApiCall_snippet(model)
            let del = DeleteApiCall_snippet(model)

            let model_dir = `${mainDir}/api/${this.api_version}/${model.name}`
            fs.ensureDirSync(model_dir)

            fs.writeFileSync(`${model_dir}/Get.php`, get)
            fs.writeFileSync(`${model_dir}/Create.php`, create)
            fs.writeFileSync(`${model_dir}/Update.php`, update)
            fs.writeFileSync(`${model_dir}/Delete.php`, del)

            console.log(`Generated api for ${model.name}`)

        })


        // TODO: Make API for relationships
        relations.forEach(relation => {
            let get = GetRelation_snippet(relation)
            let create = CreateRelation_snippet(relation)
            let update = UpdateRelation_snippet(relation)
            let del = DeleteRelation_snippet(relation)

            let relation_dir = `${mainDir}/api/${this.api_version}/${relation.source}_${relation.target}`
            fs.ensureDirSync(relation_dir)

            fs.writeFileSync(`${relation_dir}/Get.php`, get)
            fs.writeFileSync(`${relation_dir}/Create.php`, create)
            fs.writeFileSync(`${relation_dir}/Update.php`, update)
            fs.writeFileSync(`${relation_dir}/Delete.php`, del)

            console.log(`Generated api for ${relation.source}_${relation.target}`)

        })


    }
})