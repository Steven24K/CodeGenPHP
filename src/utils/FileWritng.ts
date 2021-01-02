
import * as fs from "fs-extra"
import * as path from "path"
import { Func } from "./Func"
import { Snippet } from "./types"

// https://github.com/fs-utils/fs-readdir-recursive/blob/master/index.js
export const walk_dir = (root: string, files: string[] = [], prefix = ''): string[] => {
    var dir = path.join(root, prefix)
    if (!fs.existsSync(dir)) return files
    if (fs.statSync(dir).isDirectory())
        fs.readdirSync(dir)
            .forEach(function (name) {
                walk_dir(root, files, path.join(prefix, name))
            })
    else
        files.push(prefix.replace(/\\/g, '/'))

    return files
}



export const WriteToFile = (mainDir: string): Func<Snippet, void> => Func(snippet => {
    // Todo: Add a comparison if the file allready exists and is not changed with the snippet to speed up performance
    fs.ensureDirSync(path.dirname(`${mainDir}/${snippet.name}`))
    fs.writeFileSync(`${mainDir}/${snippet.name}`, snippet.content)
    console.log(`Generated ${mainDir}/${snippet.name}`)
})