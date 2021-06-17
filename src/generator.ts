import { Application } from "./Spec/Application"
import { mkAttribute } from "./Spec/Attribute"
import { mkModel } from "./Spec/Model"
import { mkRelation } from "./Spec/Relation"


/*
Feedback: 
- Add date and time attribute types
- Add all setup stepps to readme. 
- config.php file in gitignore
- Clean package.json
- improve performance by checking if the file has changed when generating a second time
- Escape SQL queries
- Blacklist some table names (show)
*/

// Spec for project
Application('Theater Ticket System')
    .addModels(
        mkModel("admin", { can_login: true })
            .addAttributes(
                mkAttribute('Name', 'USERNAME'),
                mkAttribute('Password', 'PASSWORD'),
            )
            .addSeeds({Name: "Steven", Password: "root"}),
        mkModel("actor", { can_login: true })
            .addAttributes(
                mkAttribute('Name', 'USERNAME'),
                mkAttribute('Password', 'PASSWORD'),
                mkAttribute("DateOfBirth", "VARCHAR"),
                mkAttribute("Bio", "TEXT"),
            ),
        mkModel("director", { can_login: true })
            .addAttributes(
                mkAttribute('Name', 'USERNAME'),
                mkAttribute('Password', 'PASSWORD'),
                mkAttribute("DateOfBirth", "VARCHAR"),
                mkAttribute("Bio", "TEXT"),
            ),

        mkModel('theater_show')
            .addAttributes(
                mkAttribute("Title", 'VARCHAR'),
                mkAttribute("Description", "TEXT"),
                mkAttribute("Price", "FLOAT"),
                mkAttribute("image_url", "LONGTEXT"),
            ),
        mkModel("location")
            .addAttributes(
                mkAttribute("Name", "VARCHAR"),
                mkAttribute("Capacity", "INT"),
                mkAttribute("Adress", "VARCHAR"),
                mkAttribute("PostalCode", "VARCHAR", { size: 8 }),
                mkAttribute("City", "VARCHAR"),
                mkAttribute("GMapLink", "TEXT"),
            ),
        mkModel("date_and_time")
            .addAttributes(
                mkAttribute("Date", "VARCHAR"),
                mkAttribute("Time", "VARCHAR"),
            ),
        mkModel("discount_code")
            .addAttributes(
                mkAttribute("Code", "VARCHAR"),
                mkAttribute("Expiration_Date", "VARCHAR"),
                mkAttribute("Discount", "FLOAT")
            ),
        mkModel("reservations")
            .addAttributes(
                mkAttribute("amount", "INT"),
                mkAttribute("CheckedIn", "BOOLEAN"),
                mkAttribute("PayementID", "VARCHAR")
            ),
        mkModel("customer")
            .addAttributes(
                mkAttribute("Email", "VARCHAR"),
                mkAttribute("FirstName", "VARCHAR"),
                mkAttribute("LastName", "VARCHAR"),
                mkAttribute("Insertion", "VARCHAR"),
                mkAttribute("reg_date", "VARCHAR")
            ),
        mkModel("reseller", { can_login: true })
            .addAttributes(
                mkAttribute("Name", "USERNAME"),
                mkAttribute("Password", "PASSWORD")
            ),

        mkModel("link")
            .addAttributes(
                mkAttribute("Text", "VARCHAR"),
                mkAttribute("Url", "VARCHAR")
            ),
    )
    .addRelations(
        mkRelation("location", "theater_show", "1-N"),
        mkRelation("theater_show", "discount_code", "1-N"), 
        mkRelation("theater_show", "date_and_time", "N-N"), 
        mkRelation("theater_show", "actor", "N-N"), 
        mkRelation("director", "theater_show", "1-N"), 
        mkRelation("date_and_time", "reservations", "1-N"), 
        mkRelation("customer", "reservation", "1-N"), 
        mkRelation("reservation", "reseller", "1-N"), 
        mkRelation("actor", "link", "1-N"),
        mkRelation("director", "link", "1-N"),
    )
    .run()



/**
 * TODO:
 * - Make Application lazy, -> See desired syntax
 *
 * - Add relations to entity detail page
 *
 * - Make sure USERNAME is an unique attribute
 * - Make Login snippet, in such a way that any attribute can be used as USERNAME and PASSWORD (constraint: Entity can only have one username and password)
 * - Add contraint for permissions when only a specific user can do an opperation on a relation or entity.
 * - Make more API snippets
 * - Add a check to the CreateRelation_snippet for 1-1 relations if it allready exists
 * - Think about how we want to manage migrations.
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
