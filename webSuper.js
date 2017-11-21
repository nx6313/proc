var styles = {
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'strikethrough': ['\x1B[9m', '\x1B[29m'],
    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],
    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var libHttp = require('http'); //HTTP协议模块
var libHttps = require('https'); //HTTPS协议模块
var libUrl = require('url'); //URL解析模块
var libFs = require("fs"); //文件系统模块
var libPath = require("path"); //路径解析模块
var readline = require('readline'); //用户输入读取模块
var util = require('util'); //工具包模块
/******************************************* 服务器封装开始 ********************************************* */
//依据路径获取返回内容类型字符串,用于http返回头
var funGetContentType = function (filePath) {
    var contentType = "";
    //使用路径解析模块获取文件扩展名
    var ext = libPath.extname(filePath);
    switch (ext) {
        case ".html":
            contentType = "text/html";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".gif":
            contentType = "image/gif";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".ico":
            contentType = "image/icon";
            break;
        default:
            contentType = "application/octet-stream";
    }
    return contentType; //返回内容类型字符串
}
//Web服务器主函数,解析请求,返回Web内容
let projectRoot = '';
let serIndexHtml = '';
var funWebSvr = function (req, res) {
    var reqUrl = req.url; //获取请求的url
    //向控制台输出请求的路径,会将网络请求的所有资源路径就行输出
    //console.log(reqUrl);
    //使用url解析模块获取url中的路径名
    var pathName = libUrl.parse(reqUrl).pathname;
    if (libPath.extname(pathName) == '') {
        //如果路径没有扩展名
        pathName += '/'; //指定访问目录
    }
    if (pathName.charAt(pathName.length - 1) == '/') {
        //如果访问目录
        pathName += serIndexHtml; //指定为默认网页
    }
    //使用路径解析模块,组装实际文件路径
    var filePath = libPath.join('./' + projectRoot, pathName);
    //判断文件是否存在
    libFs.exists(filePath, function (exists) {
        if (exists) {//文件存在
            //在返回头中写入内容类型
            res.writeHead(200, { 'Content-Type': funGetContentType(filePath) });
            //创建只读流用于返回
            var stream = libFs.createReadStream(filePath, { flags: "r", encoding: null });
            //指定如果流读取错误,返回404错误
            stream.on('error', function () {
                res.writeHead(404);
                res.end('<h1>404 Read Error</h1>');
            });
            //连接文件流和http返回流的管道,用于返回实际Web内容
            stream.pipe(res);
        } else { //文件不存在
            //返回404错误
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        }
    });
}

//开始启动独立服务器
var startNodeServer = function () {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '项目根地址，(默认 当前目录)，或输入该目录下的项目根文件夹名称：'), (inputPorjectRoot) => {
        if (inputPorjectRoot) {
            projectRoot = inputPorjectRoot;
        }
        rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '项目入口地址，以当前目录为根目录(默认 空)：'), (serInnerHtml) => {
            if (serInnerHtml) {
                serIndexHtml = serInnerHtml;
            }
            rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '启动服务器端口号(默认 8080)：'), (serPort) => {
                let portNum = 8080;
                if (serPort) {
                    portNum = serPort;
                }
                console.log('');
                console.log(`项目所在目录 -> 当前目录，独立服务器启动 -> 入口地址：${serIndexHtml}，监听端口：${portNum}`);
                //创建一个http服务器
                var webSvr = libHttp.createServer(funWebSvr);
                //指定服务器错误事件响应
                webSvr.on("error", function (error) {
                    //console.log(error); //在控制台中输出错误信息
                });
                //开始侦听端口
                startInPort(webSvr, portNum);
                webSvr.on('error', function (err) {
                    webSvr.close();
                    if (err.code === 'EADDRINUSE') { // 端口已经被使用
                        console.log(`${portNum} 端口号已被使用`);
                        rl.close();
                    }
                });
            });
        });
    });
};
// 在某个端口开启服务监听
function startInPort(webSvr, portNum) {
    //开始服务启动计时器
    console.time(util.format(styles.blueBG[0] + '%s' + styles.blueBG[1], '[WebSvr][Start]'));
    webSvr.listen(portNum, function () {
        //向控制台输出服务启动的信息
        console.log(util.format(styles.blueBG[0] + '%s' + styles.blueBG[1] + ': running at http://localhost:' + portNum + '/', '[WebSvr][Start]'));
        //结束服务启动计时器并输出
        console.timeEnd(util.format(styles.blueBG[0] + '%s' + styles.blueBG[1], '[WebSvr][Start]'));
    });
}
/******************************************* 服务器封装结束 ********************************************* */

var menuIndexArr = [];
var showMenu = function () {
    let menuArr = [
        '构建WEB项目框架(包含数据展示及后台管理的框架)', '构建WEB数据展示框架', '构建WEB后台管理框架', '构建微信公众号框架',
        '构建微信小程序框架', '构建手机端WebApp框架'
    ];
    let menuSuperArr = [
        // '启动独立服务器'
    ];
    console.log('');
    console.log('================ 操作菜单 ================');
    console.log('');
    if (menuArr) {
        for (menuIndex = 1; menuIndex <= menuArr.length; menuIndex++) {
            menuIndexArr.push(String(menuIndex));
            let menuVal = menuArr[menuIndex - 1];
            console.log(util.format(styles.cyanBG[0] + '%s' + styles.cyanBG[1] + ' ' + menuVal, ' ' + menuIndex + '. '));
        }
    }
    if (menuArr && menuArr.length > 0 && menuSuperArr && menuSuperArr.length > 0) {
        console.log('==========================================');
        console.log('');
    }
    if (menuSuperArr) {
        for (menuSuperIndex = 1; menuSuperIndex <= menuSuperArr.length; menuSuperIndex++) {
            menuIndexArr.push('S' + String(menuSuperIndex));
            let menuVal = menuSuperArr[menuSuperIndex - 1];
            console.log(util.format(styles.cyanBG[0] + '%s' + styles.cyanBG[1] + ' ' + menuVal, ' S' + menuSuperIndex + '. '));
        }
    }
    console.log('==========================================');
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

/**
 * 遍历文件夹，获取所有文件夹里面的文件信息
 * @param {* 文件夹路径 } path 
 */
function geFileList(path) {
    var filesList = [];
    if (libFs.existsSync(path)) {
        readFile(path, filesList);
    }
    return filesList;
}

function readFile(path, filesList) {
    files = libFs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file) {
        var url = libPath.join(path, file);
        states = libFs.statSync(url);
        if (states.isDirectory()) {
            var obj = new Object();
            obj.type = 'dir';
            obj.name = file;//文件夹名
            obj.path = url; //文件夹绝对路径
            filesList.push(obj);
            readFile(url, filesList);
        } else {
            //创建一个对象保存信息
            var obj = new Object();
            obj.type = 'file';
            obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = url; //文件绝对路径
            filesList.push(obj);
        }
    }
}

/**
 * 获得字符串实际长度，中文2，英文1
 * 控制台中中文占用2个英文字符的宽度
 */
var getDisplayLength = function (str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

/**
 * 计算一个字符串在当前控制台中占用的行数和列数信息
 */
var getStrOccRowColumns = function (str) {
    var consoleMaxRows = rl.output.rows;
    var consoleMaxColumns = rl.output.columns;
    var strDisplayLength = getDisplayLength(str);
    var rows = parseInt(strDisplayLength / consoleMaxColumns, 10);
    var columns = parseInt(strDisplayLength - rows * consoleMaxColumns, 10);

    return {
        rows: rows,
        columns: columns
    }
};

var updateProjectDirContainer = {}; // 需要修改的文件夹相关内容
var updateProjectFileContainer = {}; // 需要修改的文件相关内容
var filePath = libPath.resolve(); // 获取当前目录绝对路径
var fileTotalLength = 0, currentFileIndex = 0, cursorDx = 0, cursorDy = 0, dxInfo;
var copy = function (src, dst, resolve, projectName) {
    //判断文件需要时间，则必须同步
    if (libFs.existsSync(src)) {
        libFs.readdir(src, function (err, files) {
            if (err) { console.log(err); return; }
            let thisFolderFileSize = files.length;
            files.forEach(function (filename, thisFolderFileIndex) {
                currentFileIndex += 1;

                var url = libPath.join(src, filename), dest = libPath.join(dst, filename);
                var progressVal = currentFileIndex / fileTotalLength;
                var progressStr = getProgressTxt(progressVal);
                var outputContent = util.format(styles.blackBG[0] + '%s' + styles.blackBG[1] + '[' + progressStr + '] [ %d% ] ', '解析文件 -> ', (currentFileIndex * 100 / fileTotalLength).toFixed(2));

                //将光标移动到已经写入的字符前面
                readline.moveCursor(rl.output, cursorDx * -1, cursorDy * -1);
                //清除当前光标后的所有文字信息，以便接下来输出信息能写入到控制台
                readline.clearScreenDown(rl.output);
                rl.output.write(outputContent);
                dxInfo = getStrOccRowColumns(outputContent);
                cursorDx = dxInfo.columns;
                cursorDy = dxInfo.rows;

                if (fileTotalLength == currentFileIndex) {
                    rl.setPrompt(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + '[' + progressStr + '] [ %d% ] ' + '解析完成', '解析文件 -> ', 100));
                    rl.prompt();
                    console.log('');
                }

                setTimeout(function () {
                    let stats = libFs.statSync(libPath.join(src, filename));
                    if (stats) {
                        if (stats.isFile()) {
                            //创建读取流
                            readable = libFs.createReadStream(url);
                            if (updateProjectFileContainer[filename]) {
                                let fileUpdateObj = updateProjectFileContainer[filename];
                                readable.on('data', (dataBuffer) => {
                                    //创建写入流
                                    writable = libFs.createWriteStream(dest, { encoding: 'utf8' });
                                    let doUpdate = doFileUpdate(dataBuffer, fileUpdateObj, writable, projectName);
                                    if (doUpdate === false) {
                                        readable.pause();
                                    }
                                });
                                readable.on('end', function () {
                                    writable.end();
                                    if (fileTotalLength == currentFileIndex && thisFolderFileIndex == thisFolderFileSize - 1) {
                                        resolve({
                                            total: fileTotalLength,
                                            currentProgress: currentFileIndex
                                        });
                                    }
                                });
                                readable.on('drain', function () {
                                    writable.resume();
                                });
                            } else {
                                //创建写入流
                                writable = libFs.createWriteStream(dest, { encoding: 'utf8' });
                                writable.on('finish', () => {
                                    if (fileTotalLength == currentFileIndex && thisFolderFileIndex == thisFolderFileSize - 1) {
                                        resolve({
                                            total: fileTotalLength,
                                            currentProgress: currentFileIndex
                                        });
                                    }
                                });
                                // 通过管道来传输流
                                readable.pipe(writable);
                            }
                        } else if (stats.isDirectory()) {
                            if (updateProjectDirContainer[filename]) {
                                dest = libPath.join(dst, updateProjectDirContainer[filename]);
                            }
                            exists(url, dest, copy, resolve, projectName);
                        }
                    }
                }, 10);
            });
        });
    } else {
        rl.setPrompt('项目文件源不存在');
        rl.prompt();
        rl.close();
        return;
    }
};
function exists(url, dest, callback, resolve, projectName) {
    libFs.exists(dest, function (exists) {
        if (exists) {
            callback && callback(url, dest, resolve, projectName);
        } else {
            //第二个参数目录权限 ，默认0777(读写权限)
            libFs.mkdir(dest, 0777, function (err) {
                if (err) throw err;
                callback && callback(url, dest, resolve, projectName);
            });
        }
    });
}
function doFileUpdate(dataBuffer, fileUpdateObj, writable, projectName) {
    let dataCtx = dataBuffer.toString('utf8');
    for (let fileUpdateKey in fileUpdateObj) {
        // let fileUpdateBuffer = Buffer.from(fileUpdateKey);
        // while (dataBuffer.indexOf(fileUpdateBuffer) >= 0) {
        //     let updateByteStart = dataBuffer.indexOf(fileUpdateBuffer);
        //     let updateByteEnd = updateByteStart + fileUpdateBuffer.length;
        //     let updateTo = Buffer.from(fileUpdateObj[fileUpdateKey], 'utf8');
        //     dataBuffer = Buffer.from(dataBuffer).fill(updateTo, updateByteStart, updateByteEnd);
        // }
        let updateToVal = fileUpdateObj[fileUpdateKey];
        if (updateToVal == '_PROJECT_NAME_') {
            updateToVal = projectName;
        }
        dataCtx = dataCtx.replace(eval('/' + fileUpdateKey + '/g'), updateToVal);
    }
    return writable.write(dataCtx, 'utf8');
}
// 获取进度条文本
function getProgressTxt(currentProgress) {
    let progressTxt = '';
    let hasCompliteProgress = Math.floor(currentProgress * 20);
    let waitProgress = 20 - hasCompliteProgress;
    for (let h = 0; h < hasCompliteProgress; h++) {
        progressTxt += '■';
    }
    for (let e = 0; e < waitProgress; e++) {
        progressTxt += '□';
    }
    return progressTxt;
}

/**
 * 构建项目框架
 */
var buildProject = function (projectFilePath, updateCtx) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目名称：'), (projectName) => {
        if (projectName) {
            rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目保存路径（默认当前路径）：'), (projectSavePath) => {
                if (projectSavePath) {
                    filePath = projectSavePath;
                }
                updateProjectDirContainer = {}; // 清空修改部分容器对象
                updateProjectFileContainer = {}; // 清空修改部分容器对象
                updateProjectDirContainer._PROJECT_NAME_ = projectName;
                if (updateCtx) {
                    if (updateCtx.dir) {
                        for (let updateDirKey in updateCtx.dir) {
                            updateProjectDirContainer[updateDirKey] = updateCtx.dir[updateDirKey];
                        }
                    }
                    if (updateCtx.file) {
                        for (let updateFileKey in updateCtx.file) {
                            updateProjectFileContainer[updateFileKey] = updateCtx.file[updateFileKey];
                        }
                    }
                }
                new Promise(function (resolve) {
                    console.log('');
                    let filesList = geFileList(projectFilePath);
                    fileTotalLength = filesList.length;
                    copy(projectFilePath, filePath, resolve, projectName);
                }).then(function (value) {
                    rl.setPrompt(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ' + filePath, '项目构建完成，保存路径为：'));
                    rl.prompt();
                    rl.close();
                });
            });
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目名称不能为空，请重新输入');
            buildProject(projectFilePath, updateCtx);
        }
    });
};

var questionSelectMenu = function () {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '请选择将要执行的项目，输入序号：'), (answer) => {
        console.log('');
        let selectIndex = `${answer}`;
        if (menuIndexArr.contains(selectIndex.trim().toUpperCase())) {
            selectMenuOk = true;
            switch (selectIndex.trim().toUpperCase()) {
                case '1':
                    // 构建WEB项目框架(包含数据展示及后台管理的框架)
                    buildProject('../projectc/pros/weball/', {
                        dir: {},
                        file: {
                            '.project': {
                                _PROJECT_NAME_: '_PROJECT_NAME_'
                            },
                            'org.eclipse.wst.common.component': {
                                _PROJECT_NAME_: '_PROJECT_NAME_'
                            },
                            'pom.xml': {
                                _PROJECT_NAME_: '_PROJECT_NAME_'
                            }
                        }
                    });
                    break;
                case '2':
                    // 构建WEB数据展示框架
                    rl.close();
                    break;
                case '3':
                    // 构建WEB后台管理框架
                    rl.close();
                    break;
                case '4':
                    // 构建微信公众号框架
                    rl.close();
                    break;
                case '5':
                    // 构建微信小程序框架
                    rl.close();
                    break;
                case '6':
                    // 构建手机端WebApp框架
                    rl.close();
                    break;
                case 'S1':
                    // 启动独立服务器
                    startNodeServer();
                    break;
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
            questionSelectMenu();
        }
    });
};

var webcStart = function () {
    showMenu();
    questionSelectMenu();
};

exports.webcStart = webcStart;