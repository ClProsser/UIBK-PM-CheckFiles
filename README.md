# (Unofficial) UIBK - Programming Methodology - CheckFiles

## About
This NPM module is a rewrite of the provided `check-files.py`, which is used to check the completeness of students' submissions in the lecture __Programming Methodology__@ 'University of Innsbruck'.

## Installation
This module requires Node.js to run.

```bash
npm i uibk-pm-checkfiles -g
```

## Features (compared to original `check-files.py`)
* proper font-color on each supported OS
* finds .yaml/.yml config automatically (if in current pwd)
* skips folder and checks provided .zip (if existing)
* warnings for not required files
* `--summary` parameter
* `--path` parameter


## Usage

Just enter this command into your terminal:
```bash
checkFiles [OPTION]...
```


|   parameter     |      alias     |  type     |             description    |      default               |
|:---------------:|:--------------:|:---------:|:---------------------------|:--------------------------:|
|  `--help`       |                |  Boolean  | shows this table           | false                      |
|  `--config`     |    `-c`        |  String   | any .yaml/.yml config file | .yaml/.yml file in pwd     |
|  `--path`       |    `-p`        |  String   |   Path of folder to check  | current directory (pwd)    |
|  `--summary  `  |    `-s`        |  Boolean  | Summarizes output messages  | false                     |

## Output:

```bash
Exercise 1a:
   Topic.java                                                        MISSING
   TopicTest.java                                                    MISSING
   TopicTest.txt                                                     MISSING
Exercise 1b:
   ListOfTopicsTest.java                                             OK
```

or if summarized:

```bash
Summary: 1/4 files found (3 missing)
Status: Files missing
```
---
Keep in mind that this unofficial module is provided "AS IS", without warranty of any kind.
