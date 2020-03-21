const fs = require("fs")
const yaml = require("js-yaml")
const sprintf = require("sprintf-js").sprintf
const colors = require("colors")

let helper = {
    findConfig: path => {
        let files = module.exports.allFiles(path)
        if (files.length === 0) {
            console.error("ERROR: This directory is empty".red)
            process.exit(1)
        }
        let config = "";
        for (let i = 0; i < files.length; i++) {
            let fileName = files[i]
            if (["yml", "yaml"].includes(fileName.split('.').pop())) {
                if (config !== "") {
                    console.error("ERROR: There is more than one .yaml / .yml file. Please use the '--config' parameter!".red)
                    process.exit(1)
                }
                config = fileName;
            }
        }
        if (config === "") {
            console.error("ERROR: No .yaml / .yml file found (please specify configpath with '--config' parameter).".red)
            process.exit(1)
        }
        return config;
    },
    readConfig: path => {
        if (!module.exports.fileExists(path)) {
            console.error("ERROR: The provided yaml file does not exist".red)
            process.exit(1)
        }
        return yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    },
    checkFiles: config => {
        const path = process.cwd()

        const tasks = Object.keys(config)

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            const requiredFiles = config[task]

            console.log(task + ":")
            for (let y = 0; y < requiredFiles.length; y++) {
                let exists = module.exports.fileExists(path + "/" + requiredFiles[y]) ? "OK".green : "MISSING".red
                console.log(sprintf("   %-64s ", requiredFiles[y]), exists)
            }
        }
    },
    allFiles: path => {
        try {
            return fs.readdirSync(path);
        } catch (err) {
            return []
        }
    },
    fileExists: (path, isFile = true) => {
        try {
            return isFile ? fs.statSync(path).isFile() : fs.statSync(path).isDirectory()
        } catch (err) {
            return false;
        }
    }
}
module.exports = helper;
