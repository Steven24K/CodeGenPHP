
import * as fs from "fs-extra"
import * as path from "path"

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
