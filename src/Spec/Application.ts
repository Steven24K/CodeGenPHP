import * as fs from "fs-extra"
import { Map } from "immutable"
import * as path from "path"
import { AppToSnippets } from "../snippets/snippet_overview"
import { walk_dir, WriteToFile } from "../utils/FileWritng"
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
    domain?: string

    addModels: (...models: Model[]) => Application
    addRelations: (...relations: Relation[]) => Application

    run: (dir?: string) => void
}



export const defaultAppOptions: Required<Optional<Application>> = ({
    api_version: 'v1',
    domain: 'https://stevenkoerts.nl'
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

            console.log(`Copied content to ${new_file}`)

        })

        // Itterate over all snippets
        AppToSnippets.f(this).forEach(snippet => {
            WriteToFile(mainDir).f(snippet)
        })

        console.log('Done...')
    }

})