const fs = require("fs")
const yaml = require("js-yaml")
const sprintf = require("sprintf-js").sprintf
const colors = require("colors")
const unzipper = require('unzipper')

let helper = {
    findConfig: path => {
        let files = module.exports.allFiles(path, ["yml", "yaml"])
        if (files.length === 0) {
            console.error("ERROR: No .yaml / .yml file found (please specify configpath with '--config' parameter)".red)
            process.exit(1)
        } else if (files.length > 1) {
            console.error("ERROR: There is more than one .yaml / .yml file. Please use the '--config' parameter!".red)
            process.exit(1)
        }
        return files[0]
    },
    readConfig: path => {
        if (!module.exports.fileExists(path)) {
            console.error("ERROR: The provided yaml file does not exist".red)
            process.exit(1)
        }
        return yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    },
    checkFiles: (config, path, summarize) => {
        const tasks = Object.keys(config)

        if (summarize) {
            let found = 0
            let missing = 0
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i]
                const requiredFiles = config[task]
                for (let y = 0; y < requiredFiles.length; y++) {
                    if (module.exports.fileExists(path + "/" + requiredFiles[y])) {
                        found++
                    } else {
                        missing++
                    }
                }
            }
            let total = found + missing
            console.log("Summary: " + colors.green(found) + "/" + total + " files found (" + (missing === 0 ? colors.green(missing) : colors.red(missing)) + " missing)")
            console.log("Status: " + (found === total ? "Complete".green : "Files missing".red))
        } else {
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i]
                const requiredFiles = config[task]

                console.log(task + ":")
                for (let y = 0; y < requiredFiles.length; y++) {
                    let exists = module.exports.fileExists(path + "/" + requiredFiles[y]) ? "OK".green : "MISSING".red
                    console.log(sprintf("   %-64s ", requiredFiles[y]), exists)
                }
            }
        }
    },
    extractZip: (path, target) => {
        return fs.createReadStream(path).pipe(unzipper.Extract({
            path: target
        })).promise()
    },
    allFiles: (path, extensions = []) => {
        try {
            let files = fs.readdirSync(path)
            return extensions.length > 0 ? files.filter(fileName => extensions.includes(fileName.split('.').pop())) : files
        } catch (err) {
            return []
        }
    },
    fileExists: (path, isFile = true) => {
        try {
            return isFile ? fs.statSync(path).isFile() : fs.statSync(path).isDirectory()
        } catch (err) {
            return false
        }
    }
}
module.exports = helper
