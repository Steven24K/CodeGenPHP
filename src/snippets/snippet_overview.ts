import { Application } from "../Spec/Application";
import { Model } from "../Spec/Model";
import { Relation } from "../Spec/Relation";
import { Func } from "../utils/Func";
import { Pair, Snippet } from "../utils/types";
import { CreateApiCall_snippet, CreateRelation_snippet, DeleteApiCall_snippet, DeleteRelation_snippet, GetApiCall_snippet, GetRelation_snippet, UpdateApiCall_snippet, UpdateRelation_snippet } from "./api_snippets";
import { CreateConfig_snippet } from "./config_snippets";
import { initDatabase_snippet, seedDatabase_snippet } from "./sql_snippets";



const ModelSnippets: Func<Model, Snippet>[] = [
    Func(m => ({ name: `${m.name}/Create.php`, content: CreateApiCall_snippet(m) })),
    Func(m => ({ name: `${m.name}/Get.php`, content: GetApiCall_snippet(m) })),
    Func(m => ({ name: `${m.name}/Update.php`, content: UpdateApiCall_snippet(m) })),
    Func(m => ({ name: `${m.name}/Delete.php`, content: DeleteApiCall_snippet(m) }))
]

const RelationSnippets: Func<Relation, Snippet>[] = [
    Func(r => ({ name: `${r.source}_${r.target}/Create.php`, content: CreateRelation_snippet(r) })),
    Func(r => ({ name: `${r.source}_${r.target}/Get.php`, content: GetRelation_snippet(r) })),
    Func(r => ({ name: `${r.source}_${r.target}/Update.php`, content: UpdateRelation_snippet(r) })),
    Func(r => ({ name: `${r.source}_${r.target}/Delete.php`, content: DeleteRelation_snippet(r) }))
]

export const AppToSnippets: Func<Application, Snippet[]> = Func(app => {
    let models = app.models.toIndexedSeq().toArray()
    let relations = app.relations.toIndexedSeq().toArray()

    let api_folder = `api/${app.api_version}`

    return [
        CreateConfig_snippet(models),
        initDatabase_snippet(models, relations),
        seedDatabase_snippet(models, relations),
    ]
        .concat(models.flatMap(m => ModelSnippets.flatMap(f => {
            let snippet = f.f(m)
            return ({ ...snippet, name: `${api_folder}/${snippet.name}` })
        })))
        .concat(relations.flatMap(r => RelationSnippets.flatMap(f => {
            let snippet = f.f(r)
            return ({ ...snippet, name: `${api_folder}/${snippet.name}` })
        })))

})

