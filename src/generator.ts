import { Application } from "./Spec/Application"
import { mkAttribute } from "./Spec/Attribute"
import { mkModel } from "./Spec/Model"
import { mkRelation } from "./Spec/Relation"

// Spec for project
Application('Little Webshop')
    .addModels(
        mkModel('product')
            .addAttributes(
                mkAttribute('Name', 'VARCHAR', { size: 100 }),
                mkAttribute('Description', 'TEXT'),
                mkAttribute('Price', 'FLOAT'),
            )
            //.addPermission('create', 'admin')
            .addPermission('update', 'admin')
            .addPermission('delete', 'admin')
            .seedRandom(10),
        mkModel('customer', { can_login: true })
            .addAttributes(
                mkAttribute('Email', 'USERNAME'),
                mkAttribute('PassPhrase', 'PASSWORD'),
                mkAttribute('FirstName', 'VARCHAR'),
                mkAttribute('LastName', 'VARCHAR'),
            )
            .addPermission('read', 'admin', 'user')
            .addPermission('update', 'admin', 'customer')
            .addPermission('delete', 'admin', 'customer')
            .addSeeds(
                { Email: "user1", PassPhrase: "test123", },
                { Email: "user2", PassPhrase: "test123", },
                { Email: "user3", PassPhrase: "test123", },
            ),
        mkModel('orderinfo')
            .addAttributes(
                mkAttribute('Amount', 'INT'),
            )
            .addPermission('create', 'admin', 'user')
            .addPermission('read', 'admin', 'user')
            .addPermission('update', 'admin')
            .addPermission('delete', 'admin'),
        mkModel('admin', { can_login: true })
            .addAttributes(
                mkAttribute('UserName', 'USERNAME'),
                mkAttribute('Password', 'PASSWORD'),
            )
            .addPermission('create', 'admin')
            .addPermission('read', 'admin')
            .addPermission('update', 'admin')
            .addPermission('delete', 'admin')
            .addSeeds(
                { UserName: "admin1", Password: "test123" },
                { UserName: "admin2", Password: "test123" },
                { UserName: "admin3", Password: "test123" },
                { UserName: "admin4", Password: "test123" },
                { UserName: "admin5", Password: "test123" },
            ),
        mkModel('blog')
            .addAttributes(
                mkAttribute('Title', 'VARCHAR', { size: 100 }),
                mkAttribute('Body', 'TEXT'),
            )
            .addPermission('create', 'admin')
            .addPermission('update', 'admin')
            .addPermission('delete', 'admin'),
        mkModel('tag')
            .addAttributes(
                mkAttribute('TagName', 'VARCHAR', { size: 30 }),
            )
            .addPermission('create', 'admin')
            .addPermission('update', 'admin')
            .addPermission('delete', 'admin'),
        mkModel('externallink')
            .addAttributes(
                mkAttribute('LinkText', 'VARCHAR', { size: 100 }),
                mkAttribute('Url', 'VARCHAR', { size: 1000 })
            )
            .addPermission('create', 'admin')
            .addPermission('update', 'admin')
            .addPermission('delete', 'admin'),
    )
    .addRelations(
        mkRelation('product', 'orderinfo', 'N-N'),
        mkRelation('customer', 'orderinfo', '1-N'),
        mkRelation('admin', 'blog', '1-N'),
        mkRelation('blog', 'externallink', '1-1'),
        mkRelation('blog', 'tag', 'N-N')
    )
    .run()



/**
 * TODO:
 * - Seeding of the database
 * - Make Application lazy
 * - Make sure USERNAME is an unique attribute
 * - Make Login snippet, in such a way that any attribute can be used as USERNAME and PASSWORD (constraint: Entity can only have one username and password)
 * - Add contraint for permissions when only a specific user can do an opperation on a relation or entity.
 * - Make more API snippets
 * - Add a check to the CreateRelation_snippet for 1-1 relations if it allready exists
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
