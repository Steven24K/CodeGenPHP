import { Application } from "../Spec/Application";
import { Model } from "../Spec/Model";
import { Relation } from "../Spec/Relation";
import { Func } from "../utils/Func";
import { Snippet } from "../utils/types";
import { CreateApiCall_snippet, CreateManyApi_snippet, CreateManyRelations_snippet, CreateRelation_snippet, DeleteApiCall_snippet, DeleteManyApi_snippet, DeleteManyRelations_snippet, DeleteRelation_snippet, GetApiCall_snippet, GetEntityWithRelation_snippet, GetRelation_snippet, UpdateApiCall_snippet, UpdateManyApi_snippet, UpdateManyRelations_snippet, UpdateRelation_snippet } from "./api_snippets";
import { login_snippet } from "./auth_snippet";
import { AdminPages_snippet, adminRoutes_snippet, AppRoles_snippet, loginUtils_snippet, typescriptInterfaces_snippet } from "./component_snippets";
import { CreateConfig_snippet, frontend_constants_snippets } from "./config_snippets";
import { getEntitiesBasedOnRole_snippet } from "./permission_snippets";
import { initDatabase_snippet, seedDatabase_snippet } from "./sql_snippets";



const ModelSnippets: Func<Application, Func<Model, Snippet>[]> = Func(app => [
    Func(m => CreateApiCall_snippet(app)(m)),
    Func(m => CreateManyApi_snippet(app)(m)),
    Func(m => GetApiCall_snippet(app)(m)),
    Func(m => UpdateApiCall_snippet(app)(m)),
    Func(m => UpdateManyApi_snippet(app)(m)),
    Func(m => DeleteApiCall_snippet(app)(m)),
    Func(m => DeleteManyApi_snippet(app)(m)),
    Func(m => AdminPages_snippet(m)),
    Func(m => typescriptInterfaces_snippet(m)),
])

const RelationSnippets: Func<Application, Func<Relation, Snippet>[]> = Func(app => [
    Func(r => CreateRelation_snippet(app)(r)),
    Func(r => CreateManyRelations_snippet(app)(r)),
    Func(r => GetRelation_snippet(app)(r)),
    Func(r => UpdateRelation_snippet(app)(r)),
    Func(r => UpdateManyRelations_snippet(app)(r)),
    Func(r => DeleteRelation_snippet(app)(r)),
    Func(r => DeleteManyRelations_snippet(app)(r)),
    Func(r => GetEntityWithRelation_snippet(app)(r))
])

export const AppToSnippets: Func<Application, Snippet[]> = Func(app => {
    let models = app.models.toIndexedSeq().toArray()
    let relations = app.relations.toIndexedSeq().toArray()


    return [
        CreateConfig_snippet(models),
        frontend_constants_snippets(app),
        initDatabase_snippet(models, relations),
        seedDatabase_snippet(models, relations),
        login_snippet(models, app.api_version!),
        getEntitiesBasedOnRole_snippet(app)(models),
        AppRoles_snippet(app),
        adminRoutes_snippet(app),
        loginUtils_snippet(app),
    ]
        .concat(models.flatMap(m => ModelSnippets.f(app).flatMap(f => {
            let snippet = f.f(m)
            return ({ ...snippet, name: snippet.name })
        })))
        .concat(relations.flatMap(r => RelationSnippets.f(app).flatMap(f => {
            let snippet = f.f(r)
            return ({ ...snippet, name: snippet.name })
        })))

})

