#!/usr/bin/env node

const fs = require("fs")
const helper = require("./helper")
const yargs = require("yargs")
const colors = require("colors")
const rimraf = require("rimraf")

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
        },
        'summary': {
            alias: "s",
            description: 'Summarize ouput messages',
            type: 'boolean',
            default: false
        }
    }).argv


if (!options.path) {
    options.path = process.cwd()
} else {
    if (!helper.fileExists(options.path, false)) {
        console.error("ERROR: This folder does not exist".red)
        process.exit(1)
    } else {
        process.chdir(options.path)
    }
}

if (!options.config) {
    options.config = helper.findConfig(options.path)
}

const config = helper.readConfig(options.config)

let zipFiles = helper.allFiles(options.path, ["zip", "gz"])
if (zipFiles.length === 1) {
    console.log("Hint: Skipping folder as a zip exists".blue)
    options.path += "/._temp_zip_" + Math.random().toString(36).substring(2)
    helper.extractZip(zipFiles[0], options.path).then(() => {
        helper.checkFiles(config, options.path, options.summary)
        rimraf(options.path, () => {})
    }).catch(err => {
        console.error(err)
        process.exit(1)
    })
} else {
    if (zipFiles.length > 1) {
        console.log("Warning: Skipping .zip (there is more than one in this directory)".yellow)
    }
    helper.checkFiles(config, options.path, options.summary)
}
