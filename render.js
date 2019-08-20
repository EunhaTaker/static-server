path = require('path')
fs = require('fs')
url = require('url')
config = require('./config')
format = require('string-format')
renderDir = require('./renderDir')
renderContent = require('./content')

let baseDirs = []

//获取文件信息，info: path, type, name, ext
let getInfo = function(pathname){
    let parts = path.normalize(pathname).split(path.sep)
    if (baseDirs.length==0)
        setBasedir()
    let info = {}
    for (var i in baseDirs){
        if (parts[1] == baseDirs[i]){
            info.path = path.join( path.dirname(config.paths[i]), pathname )
            break
        }
    }
    let stat = fs.statSync(info.path)
    if(stat.isDirectory())
        info.type = 'dir'
    else{
        info.type = 'file'
        info.ext = path.extname(info.path)
    }
    info.name = parts[parts.length-1]
    return info
}

// 将配置的文件夹解析最后一项，存入baseDirs，节约计算
let setBasedir = function(){
    let paths = config.paths
    if (paths.length == 0) {
        paths.push(process.cwd())
    }
    baseDirs = []
    let html = ''
    paths.forEach(e => {
        e = path.normalize(e)
        let pathSep = e.split(path.sep)
        let pathname = pathSep[pathSep.length - 1]
        baseDirs.push(pathname)
    });
}

// 绘制根目录
let renderBase = function(){
    if (baseDirs.length==0) setBasedir()
    let html = ''
    baseDirs.forEach(element => {
        html += format('<li><a href="{0}">{0}</a></li>', element)        
    });
    return html
}

// 总绘制器
let render = function(req, res){
    let pathname = url.parse(req.url).pathname
    pathname = decodeURI(pathname) //URI解码，针对中文
    let html = '<ul>'
    if(pathname=='/'){  //根目录
        html += renderBase()
    }else{
        let info = getInfo(pathname)
        if(info.type=='dir'){   // 文件夹
            html += renderDir(info.path, pathname)
        }else{  // 文件
            return renderContent(res, info.path, info.name, info.ext)
        }
    }
    html += '</ul>'
    res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF8' });
    res.write(html);
    res.end();
}

module.exports = render