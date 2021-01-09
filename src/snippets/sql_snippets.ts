import { Attribute } from "../Spec/Attribute";
import { Model } from "../Spec/Model";
import { Relation } from "../Spec/Relation";
import { Fun } from "../utils/types";

const mapAttributeType: Fun<Attribute, string> = (a: Attribute) => a.type == 'USERNAME' || a.type == 'PASSWORD' 
? `VARCHAR(${a.size})` : a.type == 'VARCHAR' || a.type == 'BINARY' || a.type == 'CHAR' || a.type == 'VARBINARY'
? `${a.type}(${a.size})` : a.type
const attributeToQuery = (attr: Attribute[]) => attr.reduce((xs, x) => xs + `${x.name} ${mapAttributeType(x)},\n`, '')

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

export const initDatabase_snippet = (models: Model[], relations: Relation[]) => `
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