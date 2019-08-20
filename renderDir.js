format = require('string-format')
fs = require('fs')
path = require('path')
//pathAPI: http://nodejs.cn/api/path.html

let listdir = function (dirpath) {
    let files = fs.readdirSync(dirpath)
    let dirList = []
    let fileList = []
    files.forEach(element => {
        let file = path.join(dirpath, element)
        let stat = fs.lstatSync(file)
        if (stat.isDirectory()) {
            dirList.push(element)
        } else {
            fileList.push(element)
        }
    });
    return [dirList, fileList]
}

let renderDir = function (dirpath, pathname){
    console.log(dirpath)
    let dirList, fileList 
    [dirList, fileList] = listdir(dirpath)
    let html = '<ul>'
    dirList.forEach(element => {
        html += format('<li><a href="{0}/{1}">{1}/</a></li>', pathname, element)
    });
    fileList.forEach(element => {
        html += format('<li><a href="{0}/{1}">{1}</a></li>', pathname, element)
    });
    return html
}

module.exports = renderDir
