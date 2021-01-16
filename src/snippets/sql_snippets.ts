import { Map } from "immutable";
import { Attribute } from "../Spec/Attribute";
import { Model } from "../Spec/Model";
import { Relation } from "../Spec/Relation";
import { Fun, Snippet } from "../utils/types";
import { isStringLike, shouldBeEncrypted } from "../utils/utils";

const mapAttributeType: Fun<Attribute, string> = (a: Attribute) => a.type == 'USERNAME' || a.type == 'PASSWORD'
    ? `VARCHAR(${a.size})` : a.type == 'VARCHAR' || a.type == 'BINARY' || a.type == 'CHAR' || a.type == 'VARBINARY'
        ? `${a.type}(${a.size})` : a.type
const attributeToQuery = (attr: Attribute[]) => attr.reduce((xs, x) => xs + `${x.name} ${mapAttributeType(x)} ${x.type == 'USERNAME' ? 'UNIQUE' : ''},\n`, '')

const ModelToQuery = (model: Model) => `$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS ${model.name}(
    Id INT AUTO_INCREMENT, 
    ${attributeToQuery(model.attributes.toArray().map(v => v[1]))}
    PRIMARY KEY (Id)
);");

`

const RelationToQuery = (relation: Relation) => `$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS ${relation.source}_${relation.target}(
    ${relation.sort == 'N-N' ? `Id INT AUTO_INCREMENT,` : ''}
    ${relation.source}Id INT, 
    ${relation.target}Id INT, 
    ${relation.sort == 'N-N' ? `PRIMARY KEY (Id),` : `PRIMARY KEY (${relation.target}Id),`}
    FOREIGN KEY (${relation.source}Id) REFERENCES ${relation.source}(Id),
    FOREIGN KEY (${relation.target}Id) REFERENCES ${relation.target}(Id)
);");

`

export const initDatabase_snippet = (models: Model[], relations: Relation[]): Snippet => {
    return ({
        name: 'init.php',
        content: `
        <?php 
        
        require_once('config.php');
        require_once('./utils/DbConnection.php');
        
        
        $connection = new DbConnection();
        
        // Create models
        
        ${models.map(model => ModelToQuery(model)).reduce((xs, x) => xs + x, '')}
        
        
        // Create relations
        
        ${relations.map(relation => RelationToQuery(relation)).reduce((xs, x) => xs + x, '')}
        
        
        ?>
        `
    })
}

const model_seed = (model: Model): string => {
    let columns = model.attributes.toIndexedSeq().toArray().reduce((xs, x, index) => xs + x.name + (index < model.attributes.count() - 1 ? ', ' : ''), '')
    let values = model.seeds.reduce((xs0, x, index) => {
        // sample 'x' -> {UserName: "Steven", LastName: "Koerts", Email: "s.koerts2@gmail.com", Website: "https://stevenkoerts.nl"}
        let seed = Map(Object.entries(x)) // key = attribute name, value = value to seed
        return xs0 + `(${model.attributes.toIndexedSeq().toArray().reduce((xs1, attr, index) => {
            if (seed.has(attr.name)) {
                let seed_value = seed.get(attr.name)!
                return xs1 + (shouldBeEncrypted(attr) ? `" . "'" . md5('${seed_value}') . "'" . "` : isStringLike(attr) ? `'${seed_value}'` : String(seed_value)) + (index == model.attributes.count() -1 ? '' : ', ')
            }
            return xs1 + "NULL" + (index == model.attributes.count() -1 ? '' : ', ')
        } ,'')})${index == model.seeds.length -1 ? ';' : ','}\n`
    }, '')

    return `$connection->ExecuteQuery("INSERT INTO ${model.name}(${columns}) VALUES 
    ${values}");\n\n`
}

export const seedDatabase_snippet = (models: Model[], relations: Relation[]): Snippet => {
    return ({
        name: 'seed.php',
        content: `
        <?php 
        require_once('config.php');
        require_once('./utils/DbConnection.php');
        
        $connection = new DbConnection();
        
        // Seed models 
        
        ${models.filter(m => m.seeds.length > 0).map(model_seed).reduce((xs, x) => xs + x, '')}
        
        
        // Seed relations 
        
        /**
         * TODO: Make relationsship seeding 
         * This one will be a bit more complex then the models since the relation tables contain a lot of foreigner keys. Wich are entity Ids and set to auto AUTO_INCREMENT. 
         * So in order to make relationsship seeding we need te generate ids locally. 
         * We don't want the user of this tool have to worry about ID's, but it is an idea to make an option to explicetely asign any value as primary key. 
        */
        
        ?>
        `
    })
}