#!/usr/bin/env node
const helper = require("./helper")
const yargs = require("yargs")
const colors = require("colors")

const options = yargs
    .options({
        'config': {
            alias: "c",
            description: 'YAML config file path',
            type: 'string',
            defaultDescription: 'any .yaml in pwd'
        },
        'path': {
            alias: "p",
            description: 'Path of folder to check',
            type: 'string',
            defaultDescription: 'current dir (pwd)'
        }
    }).argv


if (!options.path) {
    options.path = process.cwd()
} else {
    if (!helper.fileExists(options.path, false)) {
        console.error("ERROR: This folder does not exist".red)
        process.exit(1)
    } else {
        process.chdir(options.path);
    }
}


if (!options.config) {
    options.config = helper.findConfig(options.path);
}

const config = helper.readConfig(options.config)
helper.checkFiles(config)
