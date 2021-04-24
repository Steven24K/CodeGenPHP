import { Application } from "../Spec/Application";
import { Model } from "../Spec/Model";
import { Snippet } from "../utils/types";


export const CreateConfig_snippet = (models: Model[]): Snippet => {
    return ({
        name: 'config.Example.php',
        content: `
        <?php 
        
        // ** MySQL settings - You can get this info from your web host ** //
        /** Copied this snippet from Wordpress ;) */
        define( 'DB_NAME', 'database_name_here' );
        
        /** MySQL database username */
        define( 'DB_USER', 'username_here' );
        
        /** MySQL database password */
        define( 'DB_PASSWORD', 'password_here' );
        
        /** MySQL hostname */
        define( 'DB_HOST', 'localhost' );
        
        /**All the entities who can login */
        define( 'LOGGABLE_ENTITIES', [${models.filter(m => m.can_login).map(m => m.name).reduce((xs, x) => xs + `"${x}", ` , '')}]);
        
        ?>
        `
    })
}

export const frontend_constants_snippets = (app: Application): Snippet => {
    return ({
        name: 'src/constants.ts', 
        content: `export const ENV: 'DEV' | 'PROD' = 'DEV'


        export const ORIGIN = ENV == 'DEV' ? 'http://localhost:8080' : '${app.domain}'
        
        export const API_VERSION = 'v1'
        
        export const SITE_NAME = "${app.projectName}"`
    })
}