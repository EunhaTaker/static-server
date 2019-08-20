fs = require('fs')
exts2page = require('./config').exts2page

let renderContent = function(res, filepath, name, ext){
    let content = fs.readFileSync(filepath)
    let pageType = exts2page[ext]
    console.log(filepath+'   '+pageType)
    if(pageType){   // 浏览器可打开的类型
        res.writeHead(200, { 'Content-Type':  pageType+'; charset=UTF8'});
    }else{  // 不可打开的文件，启用下载
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',//告诉浏览器这是一个二进制文件
            'Content-Disposition': 'attachment; filename=' + encodeURI(name),//告诉浏览器这是一个需要下载的文件
        })
    }
    res.write(content, 'binary')
    res.end()
}

module.exports = renderContent