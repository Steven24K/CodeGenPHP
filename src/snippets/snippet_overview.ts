import { Application } from "../Spec/Application";
import { Model } from "../Spec/Model";
import { Relation } from "../Spec/Relation";
import { Func } from "../utils/Func";
import { Snippet } from "../utils/types";
import { CreateApiCall_snippet, CreateManyApi_snippet, CreateManyRelations_snippet, CreateRelation_snippet, DeleteApiCall_snippet, DeleteManyApi_snippet, DeleteManyRelations_snippet, DeleteRelation_snippet, GetApiCall_snippet, GetEntityWithRelation_snippet, GetRelation_snippet, UpdateApiCall_snippet, UpdateManyApi_snippet, UpdateManyRelations_snippet, UpdateRelation_snippet } from "./api_snippets";
import { login_snippet } from "./auth_snippet";
import { CreateConfig_snippet } from "./config_snippets";
import { initDatabase_snippet, seedDatabase_snippet } from "./sql_snippets";



const ModelSnippets: Func<Model, Snippet>[] = [
    Func(m => CreateApiCall_snippet(m)),
    Func(m => CreateManyApi_snippet(m)),
    Func(m => GetApiCall_snippet(m)),
    Func(m => UpdateApiCall_snippet(m)),
    Func(m => UpdateManyApi_snippet(m)),
    Func(m => DeleteApiCall_snippet(m)),
    Func(m => DeleteManyApi_snippet(m))
]

const RelationSnippets: Func<Relation, Snippet>[] = [
    Func(r => CreateRelation_snippet(r)),
    Func(r => CreateManyRelations_snippet(r)),
    Func(r => GetRelation_snippet(r)),
    Func(r => UpdateRelation_snippet(r)),
    Func(r => UpdateManyRelations_snippet(r)),
    Func(r => DeleteRelation_snippet(r)),
    Func(r => DeleteManyRelations_snippet(r)),
    Func(r => GetEntityWithRelation_snippet(r))
]

export const AppToSnippets: Func<Application, Snippet[]> = Func(app => {
    let models = app.models.toIndexedSeq().toArray()
    let relations = app.relations.toIndexedSeq().toArray()

    let api_folder = `api/${app.api_version}`

    return [
        CreateConfig_snippet(models),
        initDatabase_snippet(models, relations),
        seedDatabase_snippet(models, relations),
        login_snippet(models, app.api_version!),
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

