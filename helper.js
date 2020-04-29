const fs = require('fs')
const yaml = require('js-yaml')
const sprintf = require('sprintf-js').sprintf
const colors = require('colors')
const unzipper = require('unzipper')

let helper = {
    /*
     * Checks if there exists exactly one .yaml / .yml file
     *
     * @param string path
     * @return string
     */
    findConfig: path => {
        let files = module.exports.allFiles(path, false, ['yml', 'yaml'])
        if (files.length === 0) {
            console.error('ERROR: No .yaml / .yml file found (please specify configpath with "--config" parameter)'.red)
            process.exit(1)
        } else if (files.length > 1) {
            console.error('ERROR: There is more than one .yaml / .yml file. Please use the "--config" parameter!'.red)
            process.exit(1)
        }
        return files[0]
    },
    /*
     * Reads and parses config file
     *
     * @param string path
     * @return object
     */
    readConfig: path => {
        if (!module.exports.fileExists(path)) {
            console.error('ERROR: The provided yaml file does not exist'.red)
            process.exit(1)
        }
        return yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    },
    /*
     * Checks directory for file existence
     *
     * @param object config
     * @param string path
     * @param boolean summary
     */
    checkFiles: (config, path, summary) => {
        const tasks = Object.keys(config)

        let files = module.exports.allFiles(path, true)

        let found = []
        let missing = []

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            const requiredFiles = config[task]

            if (!summary) {
                console.log(task + ':')
            }
            for (let y = 0; y < requiredFiles.length; y++) {
                let file = requiredFiles[y]
                let exists
                if (files.includes(file)) {
                    exists = 'OK'.green
                    found.push(file)
                } else {
                    exists = 'MISSING'.red
                    missing.push(file)
                }
                if (!summary) {
                    console.log(sprintf('   %-64s %s', file, exists))
                }
            }
        }
        if (summary) {
            found = found.filter((item, index) => found.indexOf(item) === index)
            missing = missing.filter((item, index) => missing.indexOf(item) === index)

            let total = found.length + missing.length
            console.log('Summary: ' + colors.green(found.length) + '/' + total + ' files found (' + (missing.length === 0 ? colors.green(missing.length) : colors.red(missing.length)) + ' missing)')
            console.log('Status: ' + (found.length === total ? 'Complete'.green : 'Files missing'.red))
        }

        console.log('')

        let allRequiredFiles = tasks.map(key => config[key])
        allRequiredFiles = [].concat.apply([], allRequiredFiles)

        for (let i = 0; i < files.length; i++) {
            let file = files[i]

            if (!allRequiredFiles.includes(file)) {
                if ((file !== 'group.txt') && !(['yaml', '.yml'].includes(file.slice(-4)))) {
                    console.log(colors.yellow('Warning: ' + file + ' is not required!'))
                }
            }
        }
    },
    /*
     * Extracts zip file
     *
     * @param string path
     * @param string target
     * @return promise
     */
    extractZip: (path, target) => {
        return fs.createReadStream(path).pipe(unzipper.Extract({
            path: target
        })).promise()
    },
    /*
     * Returns all files in a directory
     *
     * @param string path
     * @param boolean recursive
     * @param array extensions
     * @param string sub (DO NOT PASS)
     * @return array
     */
    allFiles: (path, recursive = false, extensions = [], sub = '') => {
        if (path.slice(-1) !== '/') {
            path += '/'
        }
        const filter = extensions.length === 0
        try {
            let allFiles = fs.readdirSync(path + sub)
            let files = []
            if (recursive) {
                allFiles.forEach(file => {
                    const relativePath = sub + file
                    if (module.exports.fileExists(path + relativePath, false)) {
                        files = files.concat(module.exports.allFiles(path, true, extensions, relativePath + '/'))
                    } else {
                        if (filter || extensions.includes(relativePath.split('.').pop())) {
                            files.push(relativePath)
                        }
                    }
                })
            } else {
                files = fs.readdirSync(path)
                files = files.filter(fileName => module.exports.fileExists(path + '/' + fileName) && (filter || extensions.includes(fileName.split('.').pop())))
            }
            return files
        } catch (err) {
            return []
        }
    },
    /*
     * Checks if a file / or directory exists
     *
     * @param string path
     * @param boolean isFile
     * @return boolean
     */
    fileExists: (path, isFile = true) => {
        try {
            return isFile ? fs.statSync(path).isFile() : fs.statSync(path).isDirectory()
        } catch (err) {
            return false
        }
    }
}
module.exports = helper
