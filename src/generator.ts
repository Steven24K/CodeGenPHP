import { Application } from "./Spec/Application"
import { mkAttribute } from "./Spec/Attribute"
import { mkModel } from "./Spec/Model"
import { mkRelation } from "./Spec/Relation"

// Spec for project
Application('A new App')
    .addModels(
        mkModel('homepage')
            .addAttributes(
                mkAttribute('Title', 'VARCHAR'),
                mkAttribute('Content', 'TEXT'),
            ),
        mkModel('admin', { can_login: true })
            .addAttributes(
                mkAttribute('Email', 'USERNAME'),
                mkAttribute('Password', 'PASSWORD')
            ),
        mkModel('user', { can_login: true })
            .addAttributes(
                mkAttribute('FirstName', 'VARCHAR', { size: 100 }),
                mkAttribute('LastName', 'VARCHAR'),
                mkAttribute('Email', 'USERNAME'),
                mkAttribute('Password', 'PASSWORD'),
            )
            .addPermission('delete', 'admin', 'user')
            .addPermission('update', 'user')
        ,
        mkModel('blog')
            .addAttributes(
                mkAttribute('Title', 'VARCHAR'),
                mkAttribute('Body', 'LONGTEXT'),
            )
            .addPermission('create', 'user')
            .addPermission('update', 'user')
            .addPermission('delete', 'user'),
        mkModel('tag')
            .addAttributes(
                mkAttribute('TagName', 'VARCHAR', { size: 15 }),
            )
    )
    .addRelations(
        mkRelation('user', 'blog', '1-N'),
        mkRelation('blog', 'tag', 'N-N').addPermission('create', 'user'), 
    )
    .run()



/**
 * TODO:
 * - Make Application lazy
 * - Add contraint for permissions when only a specific user can do an opperation on a relation or entity. 
 * - Think about how we want to manage migrations.
 * - Build a user inteface for the generated API. (React)
 * - Automate automate the genration of the user interface. 
 * - Convert to graph to be able to draw the ERD on a canvas.
 */


 /**
  * Final syntax goal: 
  * 
  * import { Application } from "./Spec/Application"
  * 
  * Application("My Webshop").addModels(f => f.mkModel('user', a => a.mkAttribute('FirstName', 'VARCHAR')).mkModel('admin'))
  */



// This will be used when we draw the erd as a graph
// let g1 = Graph<NodeType>()
//     .incr(4)
//     .setEdge(mkEdge(2, 3), { relation: some('1-N') })
//     .setEdge(mkEdge(0, 0), { relation: some('N-N') })

// console.log(g1.G.map(v => v.map(x => x.kind == 'none' ? 0 : 1)))


console.log('Done...')