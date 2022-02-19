const fs = require("fs")
const path = require("path");
const chalk = require("chalk")

const getFiles = (dir) => {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    let commandFiles = [];

    for (const file of files) {
        if (file.isDirectory()) {
            commandFiles = [
                ...commandFiles,
                ...getFiles(path.join(dir, file.name))
            ];
        } else if (file.name.endsWith(".js")) {
            commandFiles.push(path.join(dir, file.name));
        }
    }

    return commandFiles;
};

const formatString = (string) => {
    let spl = string.split(" ")
    for (let i = 0; i < spl.length; i++) {
        let temp = spl[i].charAt(0).toUpperCase() + spl[i].slice(1).toLowerCase();
        spl[i] = temp;
    }
    return spl.join(" ");
}

const log = (content, type) => {
    let text = ""
    switch (type) {
        case "ready":
            text += chalk.yellow(`[${type.toUpperCase()}]`)
            break
        case "error":
            text += chalk.red(`[${type.toUpperCase()}]`)
            break
        default:
            text += chalk.cyan(`[INFO]`)

    }
    text += ` ${content}`;
    console.log(text)
}

module.exports = { getFiles, formatString, log }