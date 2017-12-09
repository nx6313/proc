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

const assert = require('assert');
var libHttp = require('http'); //HTTP协议模块
var libHttps = require('https'); //HTTPS协议模块
var libUrl = require('url'); //URL解析模块
var libFs = require("fs"); //文件系统模块
var libPath = require("path"); //路径解析模块
var readline = require('readline'); //用户输入读取模块
var util = require('util'); //工具包模块
var childProcess = require('child_process');
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
        '构建WEB项目框架(包含数据展示及后台管理的框架)', '构建WEB后台接口程序框架', '构建微信公众号框架',
        '构建微信小程序框架', '构建手机端WebApp框架', '构建H5活动推广页'
    ];
    let menuSuperArr = [
        '为WebApp项目执行 npm install 命令（ptcx支持）', '为WebApp项目导入想要的组件（ptcx支持）', '为WebApp项目集成JPush（第一步）（请确保执行过npm install）（ptcx支持）',
        '为WebApp项目集成JPush 执行 npm install ionic2-jpush --save 命令（第二步）（ptcx支持）'
    ];
    let desMenu = [
        'WebApp JPush使用说明：执行S3和S4命令后，程序中导入 import { IonJPushModule, JPushService } from "ionic2-jpush";'
    ];
    console.log('');
    console.log('================================ 操作菜单 ================================');
    console.log('');
    if (menuArr) {
        for (menuIndex = 1; menuIndex <= menuArr.length; menuIndex++) {
            menuIndexArr.push(String(menuIndex));
            let menuVal = menuArr[menuIndex - 1];
            console.log(util.format(styles.cyanBG[0] + '%s' + styles.cyanBG[1] + ' ' + menuVal, ' ' + menuIndex + '. '));
        }
    }
    if (menuArr && menuArr.length > 0 && menuSuperArr && menuSuperArr.length > 0) {
        console.log('==========================================================================');
        console.log('');
    }
    if (menuSuperArr) {
        for (menuSuperIndex = 1; menuSuperIndex <= menuSuperArr.length; menuSuperIndex++) {
            menuIndexArr.push('S' + String(menuSuperIndex));
            let menuVal = menuSuperArr[menuSuperIndex - 1];
            console.log(util.format(styles.cyanBG[0] + '%s' + styles.cyanBG[1] + ' ' + menuVal, ' S' + menuSuperIndex + '. '));
        }
    }
    console.log('==========================================================================');
    if (desMenu) {
        for (menuDesIndex = 1; menuDesIndex <= desMenu.length; menuDesIndex++) {
            let menuVal = desMenu[menuDesIndex - 1];
            console.log(util.format(styles.cyanBG[0] + '%s' + styles.cyanBG[1] + ' ' + menuVal, ' 说明-' + menuDesIndex + '. '));
        }
    }
    console.log('==========================================================================');
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
            let ingroneThisDir = false;
            for (let ignoreProjectDirKey in ignoreProjectDirContainer) {
                if (ignoreProjectDirContainer[ignoreProjectDirKey] == file) {
                    if (eval(ignoreProjectDirKey)) {
                        ingroneThisDir = true;
                        break;
                    }
                }
            }
            if (!ingroneThisDir) {
                var obj = new Object();
                obj.type = 'dir';
                obj.name = file;//文件夹名
                obj.path = url; //文件夹绝对路径
                filesList.push(obj);
                readFile(url, filesList);
            }
        } else {
            let ingroneThisFile = false;
            for (let ignoreProjectFileKey in ignoreProjectFileContainer) {
                if (ignoreProjectFileContainer[ignoreProjectFileKey] == file) {
                    if (eval(ignoreProjectFileKey)) {
                        ingroneThisFile = true;
                        break;
                    }
                }
            }
            if (!ingroneThisFile) {
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

var projectConfigSetContainer = {}; // 需要修改的项目相关配置信息，由提问获取
var updateProjectDirContainer = {}; // 需要修改的文件夹相关内容
var updateProjectFileContainer = {}; // 需要修改的文件相关内容
var ignoreProjectDirContainer = {}; // 需要忽略掉的文件夹
var ignoreProjectFileContainer = {}; // 需要忽略掉的文件
var filePath = libPath.resolve(); // 获取当前目录绝对路径
var newProjectDataBase, newProjectDataBaseUrl, newProjectDataBaseUserName, newProjectDataBasePassWord,
    newProjectSelectedPageShowType, newProjectAddUserTb; // WEB项目使用参数
var fileTotalLength = 0, currentFileIndex = 0, cursorDx = 0, cursorDy = 0, dxInfo;
var copy = function (src, dst, resolve, projectName, packageReplace) {
    //判断文件需要时间，则必须同步
    if (libFs.existsSync(src)) {
        libFs.readdir(src, function (err, files) {
            if (err) { console.log(err); return; }
            let thisFolderFileSize = files.length;
            files.forEach(function (filename, thisFolderFileIndex) {
                var url = libPath.join(src, filename), dest = libPath.join(dst, filename);

                setTimeout(() => {
                    let stats = libFs.statSync(libPath.join(src, filename));
                    if (stats) {
                        if (stats.isFile()) {
                            let ingroneThisFile = false;
                            for (let ignoreProjectFileKey in ignoreProjectFileContainer) {
                                if (ignoreProjectFileContainer[ignoreProjectFileKey] == filename) {
                                    if (eval(ignoreProjectFileKey)) {
                                        ingroneThisFile = true;
                                        break;
                                    }
                                }
                            }
                            if (!ingroneThisFile) {
                                currentFileIndex += 1;
                                printCopyProgress(currentFileIndex, false, null, url);
                                //对文件的名称做处理
                                if (filename == 'ProjectNameApplication.java') { // 针对WEB项目Maven
                                    let dirUpdateToVal = firstUpReplaceReg(projectName) + 'Application.java';
                                    dest = libPath.join(dst, dirUpdateToVal);
                                } else if (filename == 'ProjectNameApplicationTests.java') { // 针对WEB项目Maven
                                    let dirUpdateToVal = firstUpReplaceReg(projectName) + 'ApplicationTests.java';
                                    dest = libPath.join(dst, dirUpdateToVal);
                                } else if (filename == '_project_name_.properties') { // 针对WEB项目Maven
                                    let dirUpdateToVal = projectName.toLowerCase() + '.properties';
                                    dest = libPath.join(dst, dirUpdateToVal);
                                } else if (filename == '_ACTIVE_PAGE_NAME_.html') { // 针对ACTIVE_H5
                                    let dirUpdateToVal = projectName.toLowerCase() + '.html';
                                    dest = libPath.join(dst, dirUpdateToVal);
                                } else if (filename == '_ACTIVE_PAGE_NAME_.js') { // 针对ACTIVE_H5
                                    let dirUpdateToVal = projectName.toLowerCase() + '.js';
                                    dest = libPath.join(dst, dirUpdateToVal);
                                } else if (filename == '_ACTIVE_PAGE_NAME_.css') { // 针对ACTIVE_H5
                                    let dirUpdateToVal = projectName.toLowerCase() + '.css';
                                    dest = libPath.join(dst, dirUpdateToVal);
                                }
                                //创建读取流
                                readable = libFs.createReadStream(url);
                                if (packageReplace || updateProjectFileContainer[filename]) {
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
                            }
                        } else if (stats.isDirectory()) {
                            let ingroneThisDir = false;
                            for (let ignoreProjectDirKey in ignoreProjectDirContainer) {
                                if (ignoreProjectDirContainer[ignoreProjectDirKey] == filename) {
                                    if (eval(ignoreProjectDirKey)) {
                                        ingroneThisDir = true;
                                        break;
                                    }
                                }
                            }
                            if (!ingroneThisDir) {
                                currentFileIndex += 1;
                                printCopyProgress(currentFileIndex, false, null, url);
                                if (updateProjectDirContainer[filename]) {
                                    let dirUpdateToVal = updateProjectDirContainer[filename];
                                    if (dirUpdateToVal == '_PROJECT_NAME_') {
                                        dirUpdateToVal = projectName;
                                    }
                                    dest = libPath.join(dst, dirUpdateToVal);
                                }
                                exists(url, dest, copy, resolve, projectName, packageReplace);
                            }
                        }
                    }
                }, 100);
            });
        });
    } else {
        rl.setPrompt('项目文件源不存在');
        rl.prompt();
        rl.close();
        return;
    }
};
function exists(url, dest, callback, resolve, projectName, packageReplace) {
    libFs.exists(dest, function (exists) {
        if (exists) {
            callback && callback(url, dest, resolve, projectName, packageReplace);
        } else {
            //第二个参数目录权限 ，默认0777(读写权限)
            libFs.mkdir(dest, 0777, function (err) {
                if (err) throw err;
                callback && callback(url, dest, resolve, projectName, packageReplace);
            });
        }
    });
}
function doFileUpdate(dataBuffer, fileUpdateObj, writable, projectName) {
    let dataCtx = dataBuffer.toString('utf8');
    // 替换包名
    dataCtx = dataCtx.replace(/com.nx._PROJECT_NAME_/g, 'com.nx.' + projectName);
    // 替换指定内容
    if (fileUpdateObj) {
        for (let fileUpdateKey in fileUpdateObj) {
            let updateToVal = fileUpdateObj[fileUpdateKey];
            if (updateToVal == '_PROJECT_NAME_') {
                updateToVal = projectName;
            } else if (updateToVal == '_l_project_name_') {
                updateToVal = projectName.toLowerCase();
            } else if (updateToVal.indexOf('_INDEXOF_PROJECT_NAME_FIRST_UP_') == 0) {
                updateToVal = updateToVal.replace(/_INDEXOF_PROJECT_NAME_FIRST_UP_/g, firstUpReplaceReg(projectName));
            } else if (updateToVal == '_BY_DATA_BASE_SELECTED_') {
                if (newProjectDataBase && newProjectDataBase == 1) {
                    // mysql
                    updateToVal = `<dependency>
\t\t\t<groupId>mysql</groupId>
\t\t\t<artifactId>mysql-connector-java</artifactId>
\t\t</dependency>`;
                } else if (newProjectDataBase && newProjectDataBase == 2) {
                    // sqlserver
                    updateToVal = `<dependency>
\t\t\t<groupId>com.microsoft.sqlserver</groupId>
\t\t\t<artifactId>sqljdbc4</artifactId>
\t\t\t<version>4.0</version>
\t\t</dependency>`;
                }
            } else if (updateToVal == '_BY_PAGE_SHOW_SELECTED_TYPE_') {
                if (newProjectSelectedPageShowType && newProjectSelectedPageShowType == 1) {
                    // thymeleaf
                    updateToVal = `<dependency>
\t\t\t<groupId>org.springframework.boot</groupId>
\t\t\t<artifactId>spring-boot-starter-thymeleaf</artifactId>
\t\t</dependency>`;
                } else if (newProjectSelectedPageShowType && newProjectSelectedPageShowType == 2) {
                    // jsp
                    updateToVal = `<dependency>
\t\t\t<groupId>org.springframework.boot</groupId>
\t\t\t<artifactId>spring-boot-starter-tomcat</artifactId>
\t\t\t<scope>provided</scope>
\t\t</dependency>
\t\t<dependency>
\t\t\t<groupId>org.apache.tomcat.embed</groupId>
\t\t\t<artifactId>tomcat-embed-jasper</artifactId>
\t\t\t<scope>provided</scope>
\t\t</dependency>
\t\t<dependency>
\t\t\t<groupId>javax.servlet</groupId>
\t\t\t<artifactId>javax.servlet-api</artifactId>
\t\t\t<scope>provided</scope>
\t\t</dependency>
\t\t<dependency>
\t\t\t<groupId>javax.servlet</groupId>
\t\t\t<artifactId>jstl</artifactId>
\t\t</dependency>`;
                }
            } else if (updateToVal == '_BY_PAGE_SHOW_SELECTED_TYPE_TO_SET_PROPERTIES_') {
                // 根据页面显示方式，设置项目的 application.properties 相关参数
                if (newProjectSelectedPageShowType && newProjectSelectedPageShowType == 1) {
                    // thymeleaf
                    updateToVal = `#thymeleaf
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML5
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.content-type=text/html
spring.thymeleaf.cache=false`;
                } else if (newProjectSelectedPageShowType && newProjectSelectedPageShowType == 2) {
                    // jsp
                    updateToVal = `#jsp
spring.mvc.view.prefix=views/
spring.mvc.view.suffix=.jsp`;
                }
            } else if (updateToVal == '_BY_DATA_BASE_SOURCE_URL_TO_SET_PROPERTIES_') {
                updateToVal = newProjectDataBaseUrl;
            } else if (updateToVal == '_BY_DATA_BASE_SOURCE_USERNAME_TO_SET_PROPERTIES_') {
                updateToVal = newProjectDataBaseUserName;
            } else if (updateToVal == '_BY_DATA_BASE_SOURCE_PASSWORD_TO_SET_PROPERTIES_') {
                updateToVal = newProjectDataBasePassWord;
            } else if (updateToVal == '_BY_DATA_BASE_DRIVER_CLASS_NAME_TO_SET_PROPERTIES_') {
                if (newProjectDataBase && newProjectDataBase == 1) {
                    // mysql
                    updateToVal = `com.mysql.jdbc.Driver`;
                } else if (newProjectDataBase && newProjectDataBase == 2) {
                    // sqlserver
                    updateToVal = `com.microsoft.sqlserver.jdbc.SQLServerDriver`;
                }
            } else if (updateToVal == '_BY_DATA_BASE_DIALECT_TO_SET_PROPERTIES_') {
                if (newProjectDataBase && newProjectDataBase == 1) {
                    // mysql
                    updateToVal = `org.hibernate.dialect.MySQLDialect`;
                } else if (newProjectDataBase && newProjectDataBase == 2) {
                    // sqlserver
                    updateToVal = `org.hibernate.dialect.SQLServerDialect`;
                }
            } else if (updateToVal == '_THIS_APP_PACKET_NAME_') {
                updateToVal = projectConfigSetContainer.WEB_APP_PACKET_NAME;
            } else if (updateToVal == '_THIS_APP_NAME_') {
                updateToVal = projectConfigSetContainer.WEB_APP_SHOW_NAME;
            } else if (updateToVal == '_BY_ACTIVE_H5_PAGE_COUNT_') {
                let activeH5PageCount = projectConfigSetContainer.ACTIVEH5_PAGE_COUNT;
                updateToVal = ``;
                for (let h5PageIndex = 0; h5PageIndex < activeH5PageCount; h5PageIndex++) {
                    updateToVal += `<li class="pageItem pageItem${h5PageIndex + 1}">
\t\t\t<!-- 请在此处添加第 ${h5PageIndex + 1} 页代码 -->\n
\t\t</li>`;
                }
            } else if (updateToVal == '_CSS_BY_ACTIVE_H5_PAGE_COUNT_') {
                let activeH5PageCount = projectConfigSetContainer.ACTIVEH5_PAGE_COUNT;
                updateToVal = ``;
                for (let h5PageIndex = 0; h5PageIndex < activeH5PageCount; h5PageIndex++) {
                    updateToVal += `/****************** 第 ${h5PageIndex + 1} 页 ******************/
/****** 背景图设置 ******/
.pageItemWrap li.pageItem${h5PageIndex + 1} {
\tbackground-image: url('');
}
/****** 其他样式 - 页面元素 ******/\n\n`;
                }
            }
            dataCtx = dataCtx.replace(eval('/' + fileUpdateKey + '/g'), updateToVal);
        }
    }
    return writable.write(dataCtx, 'utf8');
}
// 输出打印文件解析进度
function printCopyProgress(currentFileIndex, loadingFlag, loadingTxt, url) {
    var progressStr = '';
    var outputContent = '';
    if (!loadingFlag) {
        var progressVal = currentFileIndex / fileTotalLength;
        progressStr = getProgressTxt(progressVal);
        outputContent = util.format(styles.blackBG[0] + '%s' + styles.blackBG[1] + '[' + progressStr + '] [ %d% (%d/%d) ] ', '解析文件 -> ', (currentFileIndex * 100 / fileTotalLength).toFixed(2), currentFileIndex, fileTotalLength);
    } else {
        progressStr = getProgressTxt(currentFileIndex, true);
        outputContent = util.format(styles.blackBG[0] + '%s' + styles.blackBG[1] + '[' + progressStr + ']', loadingTxt + ' -> ');
    }

    //将光标移动到已经写入的字符前面
    readline.moveCursor(rl.output, cursorDx * -1, cursorDy * -1);
    //清除当前光标后的所有文字信息，以便接下来输出信息能写入到控制台
    readline.clearScreenDown(rl.output);
    rl.output.write(outputContent);
    dxInfo = getStrOccRowColumns(outputContent);
    cursorDx = dxInfo.columns;
    cursorDy = dxInfo.rows;

    //console.log('');
    if (!loadingFlag) {
        if (fileTotalLength == currentFileIndex) {
            rl.setPrompt(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + '[' + progressStr + '] [ %d% (%d/%d) ] ' + '解析完成', '解析文件 -> ', 100, currentFileIndex, fileTotalLength));
            rl.prompt();
            console.log('');
        }
    }
}
// 获取进度条文本
function getProgressTxt(currentProgress, loadingFlag, maxLength) {
    let allProgressDiamondsCount = 20;
    if (maxLength) {
        allProgressDiamondsCount = maxLength;
    }
    let progressTxt = '';
    if (!loadingFlag) {
        let hasCompliteProgress = Math.floor(currentProgress * allProgressDiamondsCount);
        let waitProgress = allProgressDiamondsCount - hasCompliteProgress;
        for (let h = 0; h < hasCompliteProgress; h++) {
            progressTxt += '■';
        }
        for (let e = 0; e < waitProgress; e++) {
            progressTxt += '□';
        }
    } else if (loadingFlag) {
        let loadingProgressLength = 3;
        let loadingProgressCount = loadingProgressLength;
        let otherLoadingPreCount = 0;
        let preProgressCount = currentProgress % allProgressDiamondsCount;
        if (preProgressCount > allProgressDiamondsCount - loadingProgressCount && preProgressCount < allProgressDiamondsCount) {
            otherLoadingPreCount = (preProgressCount + loadingProgressLength) - allProgressDiamondsCount;
            loadingProgressCount = allProgressDiamondsCount - preProgressCount;
            preProgressCount -= otherLoadingPreCount;
        } else {
            otherLoadingPreCount = 0;
            loadingProgressCount = loadingProgressLength;
        }
        let afterProgressCount = allProgressDiamondsCount - preProgressCount - loadingProgressCount - otherLoadingPreCount;
        for (let ol = 0; ol < otherLoadingPreCount; ol++) {
            progressTxt += '■';
        }
        for (let p = 0; p < preProgressCount; p++) {
            progressTxt += '□';
        }
        for (let l = 0; l < loadingProgressCount; l++) {
            progressTxt += '■';
        }
        for (let a = 0; a < afterProgressCount; a++) {
            progressTxt += '□';
        }
    }
    return progressTxt;
}

// 首字母大写
function firstUpReplaceReg(str) {
    str = str.toLowerCase();
    return str.replace(/\b(\w)|\s(\w)/g, function (m) {
        return m.toUpperCase()
    });
}

/**
 * 构建WEB项目框架
 */
var buildWebProject = function (projectFilePath, updateCtx) {
    askProjectName(function (projectName) {
        askProjectSavePath(function () {
            askProjectUseDataBase(function (projectDataBase) {
                askProjectUseDataBaseURL(projectDataBase, function (projectDataBaseUrl) {
                    askProjectUseDataBaseUserName(function (projectDataBaseUserName) {
                        askProjectUseDataBasePassWord(function (projectDataBasePassWord) {
                            askProjectPageShowType(function (selectedPageShowType) {
                                askProjectIfAddUserTb(function (projectAddUserTb) {
                                    startToBuildWebProjectWhenAskAfter(projectFilePath, updateCtx,
                                        projectName, projectDataBase, projectDataBaseUrl,
                                        projectDataBaseUserName, projectDataBasePassWord,
                                        selectedPageShowType, projectAddUserTb);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

/**
 * 构建WEBAPP项目框架
 */
var buildWebAppProject = function (projectFilePath, updateCtx) {
    askProjectName(function (projectName) {
        askProjectAppPacketName(function (packetName) {
            askProjectAppShowName(function (appShowName) {
                askProjectSavePath(function () {
                    askProjectAppType(function (appType) {
                        startToBuildWebAppProjectWhenAskAfter(projectFilePath, updateCtx, projectName, packetName, appShowName, appType);
                    });
                });
            });
        });
    });
};

// 构建H5活动推广页
var buildActiveH5Project = function (activeH5ProjectPath, updateCtx) {
    askProjectName(function (projectName) {
        askProjectSavePath(function () {
            askActiveH5PageCount(function (activeH5PageCount) {
                startToBuildActiveH5ProjectWhenAskAfter(activeH5ProjectPath, updateCtx, projectName, activeH5PageCount);
            });
        });
    });
};

// 询问完成，开始执行WEB项目创建
function startToBuildWebProjectWhenAskAfter(projectFilePath, updateCtx, projectName, projectDataBase, projectDataBaseUrl,
    projectDataBaseUserName, projectDataBasePassWord,
    selectedPageShowType, projectAddUserTb) {
    newProjectDataBase = projectDataBase;
    newProjectDataBaseUrl = projectDataBaseUrl;
    newProjectDataBaseUserName = projectDataBaseUserName;
    newProjectDataBasePassWord = projectDataBasePassWord;
    newProjectSelectedPageShowType = selectedPageShowType;
    newProjectAddUserTb = projectAddUserTb;
    projectConfigSetContainer = {}; // 清空修改的项目相关配置信息，由提问获取
    updateProjectDirContainer = {}; // 清空修改部分文件夹容器对象
    updateProjectFileContainer = {}; // 清空修改部分文件容器对象
    ignoreProjectDirContainer = {}; // 清空忽略文件夹部分容器
    ignoreProjectFileContainer = {}; // 清空忽略文件部分容器
    updateProjectDirContainer._PROJECT_NAME_ = projectName;
    let packageReplace = false;
    if (updateCtx) {
        if (updateCtx.packageReplace) {
            packageReplace = updateCtx.packageReplace;
        }
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
        if (updateCtx.ignoreDir) {
            for (let updateFileKey in updateCtx.ignoreDir) {
                ignoreProjectDirContainer[updateFileKey] = updateCtx.ignoreDir[updateFileKey];
            }
        }
        if (updateCtx.ignoreFile) {
            for (let updateFileKey in updateCtx.ignoreFile) {
                ignoreProjectFileContainer[updateFileKey] = updateCtx.ignoreFile[updateFileKey];
            }
        }
    }
    libFs.exists(libPath.join(filePath, ''), function (savePathExists) {
        if (savePathExists) {
            libFs.exists(libPath.join(filePath, projectName), function (projectDirExists) {
                if (!projectDirExists) {
                    new Promise(function (resolve) {
                        console.log('');
                        let filesList = geFileList(projectFilePath);
                        fileTotalLength = filesList.length;
                        copy(projectFilePath, filePath, resolve, projectName, packageReplace);
                    }).then(function (value) {
                        rl.setPrompt(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ' + filePath, '项目构建完成，保存路径为：'));
                        rl.prompt();
                        rl.close();
                    });
                } else {
                    console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目保存路径下存在同名的文件夹，请重新输入');
                    askProjectName(function (projectName) {
                        startToBuildWebProjectWhenAskAfter(projectFilePath, updateCtx,
                            projectName, projectDataBase, projectDataBaseUrl,
                            projectDataBaseUserName, projectDataBasePassWord,
                            selectedPageShowType, projectAddUserTb);
                    });
                }
            });
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目保存路径不存在，请重新输入');
            askProjectSavePath(function () {
                startToBuildWebProjectWhenAskAfter(projectFilePath, updateCtx,
                    projectName, projectDataBase, projectDataBaseUrl,
                    projectDataBaseUserName, projectDataBasePassWord,
                    selectedPageShowType, projectAddUserTb);
            });
        }
    });
}

// 询问完成，开始执行WEBAPP项目创建
function startToBuildWebAppProjectWhenAskAfter(projectFilePath, updateCtx, projectName, packetName, appShowName, appType) {
    projectConfigSetContainer = {}; // 清空修改的项目相关配置信息，由提问获取
    updateProjectDirContainer = {}; // 清空修改部分文件夹容器对象
    updateProjectFileContainer = {}; // 清空修改部分文件容器对象
    ignoreProjectDirContainer = {}; // 清空忽略文件夹部分容器
    ignoreProjectFileContainer = {}; // 清空忽略文件部分容器
    updateProjectDirContainer._WEB_APP_ = projectName;
    // 提问得来的参数
    projectConfigSetContainer.WEB_APP_PACKET_NAME = packetName;
    projectConfigSetContainer.WEB_APP_SHOW_NAME = appShowName;
    if (appType == '1') {
        projectFilePath += 'tab/';
    }
    let packageReplace = false;
    if (updateCtx) {
        if (updateCtx.packageReplace) {
            packageReplace = updateCtx.packageReplace;
        }
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
        if (updateCtx.ignoreDir) {
            for (let updateFileKey in updateCtx.ignoreDir) {
                ignoreProjectDirContainer[updateFileKey] = updateCtx.ignoreDir[updateFileKey];
            }
        }
        if (updateCtx.ignoreFile) {
            for (let updateFileKey in updateCtx.ignoreFile) {
                ignoreProjectFileContainer[updateFileKey] = updateCtx.ignoreFile[updateFileKey];
            }
        }
    }
    libFs.exists(libPath.join(filePath, ''), function (savePathExists) {
        if (savePathExists) {
            libFs.exists(libPath.join(filePath, projectName), function (projectDirExists) {
                if (!projectDirExists) {
                    new Promise(function (resolve) {
                        console.log('');
                        let filesList = geFileList(projectFilePath);
                        fileTotalLength = filesList.length;
                        copy(projectFilePath, filePath, resolve, projectName, packageReplace);
                    }).then(function (value) {
                        rl.setPrompt(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ' + filePath, '项目构建完成，保存路径为：'));
                        rl.prompt();
                        rl.close();
                    });
                } else {
                    console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目保存路径下存在同名的文件夹，请重新输入');
                    askProjectName(function (projectName) {
                        startToBuildWebAppProjectWhenAskAfter(projectFilePath, updateCtx, projectName, packetName, appShowName, appType);
                    });
                }
            });
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目保存路径不存在，请重新输入');
            askProjectSavePath(function () {
                startToBuildWebAppProjectWhenAskAfter(projectFilePath, updateCtx, projectName, packetName, appShowName, appType);
            });
        }
    });
}

// 询问完成，开始执行ActiveH5项目创建
function startToBuildActiveH5ProjectWhenAskAfter(activeH5ProjectPath, updateCtx, projectName, activeH5PageCount) {
    projectConfigSetContainer = {}; // 清空修改的项目相关配置信息，由提问获取
    updateProjectDirContainer = {}; // 清空修改部分文件夹容器对象
    updateProjectFileContainer = {}; // 清空修改部分文件容器对象
    ignoreProjectDirContainer = {}; // 清空忽略文件夹部分容器
    ignoreProjectFileContainer = {}; // 清空忽略文件部分容器
    updateProjectDirContainer._ACTIVE_H5_PROJECT_ = projectName;
    // 提问得来的参数
    projectConfigSetContainer.ACTIVEH5_PAGE_COUNT = activeH5PageCount;
    let packageReplace = false;
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
        if (updateCtx.ignoreDir) {
            for (let updateFileKey in updateCtx.ignoreDir) {
                ignoreProjectDirContainer[updateFileKey] = updateCtx.ignoreDir[updateFileKey];
            }
        }
        if (updateCtx.ignoreFile) {
            for (let updateFileKey in updateCtx.ignoreFile) {
                ignoreProjectFileContainer[updateFileKey] = updateCtx.ignoreFile[updateFileKey];
            }
        }
    }
    libFs.exists(libPath.join(filePath, ''), function (savePathExists) {
        if (savePathExists) {
            libFs.exists(libPath.join(filePath, projectName), function (projectDirExists) {
                if (!projectDirExists) {
                    new Promise(function (resolve) {
                        console.log('');
                        let filesList = geFileList(activeH5ProjectPath);
                        fileTotalLength = filesList.length;
                        copy(activeH5ProjectPath, filePath, resolve, projectName, packageReplace);
                    }).then(function (value) {
                        rl.setPrompt(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ' + filePath, '项目构建完成，保存路径为：'));
                        rl.prompt();
                        rl.close();
                    });
                } else {
                    console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目保存路径下存在同名的文件夹，请重新输入');
                    askProjectName(function (projectName) {
                        startToBuildActiveH5ProjectWhenAskAfter(activeH5ProjectPath, updateCtx, projectName, activeH5PageCount);
                    });
                }
            });
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目保存路径不存在，请重新输入');
            askProjectSavePath(function () {
                startToBuildActiveH5ProjectWhenAskAfter(activeH5ProjectPath, updateCtx, projectName, activeH5PageCount);
            });
        }
    });
}

// 询问项目名称
function askProjectName(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目名称：'), (projectName) => {
        if (projectName) {
            if (callback && typeof callback === 'function') {
                callback(projectName.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目名称不能为空，请重新输入');
            askProjectName(callback);
        }
    });
}

// 询问项目包名
function askProjectAppPacketName(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目包名：'), (packetName) => {
        if (packetName) {
            if (callback && typeof callback === 'function') {
                callback(packetName.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目包名不能为空，请重新输入');
            askProjectAppPacketName(callback);
        }
    });
}

// 询问WebApp项目程序名称
function askProjectAppShowName(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入程序显示名称：'), (appShowName) => {
        if (appShowName) {
            if (callback && typeof callback === 'function') {
                callback(appShowName.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '项目包名不能为空，请重新输入');
            askProjectAppShowName(callback);
        }
    });
}

// 询问WebApp类型（tab、...）
function askProjectAppType(callback) {
    let webAppTypes = '⑴ tab   ...(其他方式敬请期待)';
    let webAppTypesArr = ['1'];
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '选择WebApp类型〖' + webAppTypes + '〗，输入序号（默认使用 tab）：'), (webAppType) => {
        let selectedWebAppType = '1';
        if (webAppType.trim()) {
            if (webAppTypesArr.contains(webAppType.trim())) {
                selectedWebAppType = webAppType.trim();
                if (callback && typeof callback === 'function') {
                    callback(selectedWebAppType);
                }
            } else {
                console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新选择');
                askProjectAppType(callback);
            }
        } else {
            if (callback && typeof callback === 'function') {
                callback(selectedWebAppType);
            }
        }
    });
}

// 询问项目保存地址
function askProjectSavePath(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目保存路径（默认当前路径）：'), (projectSavePath) => {
        if (projectSavePath) {
            filePath = projectSavePath;
        } else {
            filePath = libPath.resolve(); // 获取当前目录绝对路径
        }
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

// 询问H5活动页包含的页面数量
function askActiveH5PageCount(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '该H5活动页共包含几个页面：'), (activeH5PageCount) => {
        if (activeH5PageCount && /^[1-9]+[0-9]*]*$/.test(activeH5PageCount)) {
            if (callback && typeof callback === 'function') {
                callback(activeH5PageCount.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '活动页面数量输入有误，请重新输入');
            askActiveH5PageCount(callback);
        }
    });
}

// 询问项目使用的数据库
function askProjectUseDataBase(callback) {
    let dataBaseTypes = '⑴ mysql   ⑵ sqlserver';
    let dataBaseTypesArr = ['1', '2'];
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '选择项目使用的数据库〖' + dataBaseTypes + '〗，输入序号（默认使用 mysql）：'), (projectDataBase) => {
        let selectedDataBaseType = '1';
        if (projectDataBase.trim()) {
            if (dataBaseTypesArr.contains(projectDataBase.trim())) {
                selectedDataBaseType = projectDataBase.trim();
                if (callback && typeof callback === 'function') {
                    callback(selectedDataBaseType);
                }
            } else {
                console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新选择');
                askProjectUseDataBase(callback);
            }
        } else {
            if (callback && typeof callback === 'function') {
                callback(selectedDataBaseType);
            }
        }
    });
}

// 询问项目使用数据库的URL
function askProjectUseDataBaseURL(selectedDataBaseType, callback) {
    let dataBaseUrlInputPre = '';
    let sslSet = '';
    if (selectedDataBaseType == 1) {
        dataBaseUrlInputPre = 'jdbc:mysql://';
        sslSet = '?useSSL=false';
    } else if (selectedDataBaseType == 2) {
        dataBaseUrlInputPre = 'jdbc:sqlserver://';
    }
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ' + dataBaseUrlInputPre, '输入项目使用的数据库 url：'), (projectDataBaseUrl) => {
        if (projectDataBaseUrl.trim()) {
            if (callback && typeof callback === 'function') {
                callback(dataBaseUrlInputPre + projectDataBaseUrl.trim() + sslSet);
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
            askProjectUseDataBaseURL(selectedDataBaseType, callback);
        }
    });
}

// 询问项目使用数据库的username
function askProjectUseDataBaseUserName(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目使用的数据库 username：'), (projectDataBaseUserName) => {
        if (projectDataBaseUserName.trim()) {
            if (callback && typeof callback === 'function') {
                callback(projectDataBaseUserName.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
            askProjectUseDataBaseUserName(callback);
        }
    });
}

// 询问项目使用数据库的password
function askProjectUseDataBasePassWord(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入项目使用的数据库 password：'), (projectDataBasePassWord) => {
        if (projectDataBasePassWord.trim()) {
            if (callback && typeof callback === 'function') {
                callback(projectDataBasePassWord.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
            askProjectUseDataBasePassWord(callback);
        }
    });
}

// 询问项目将使用的页面展示方式
function askProjectPageShowType(callback) {
    let pageShowTypes = '⑴ thymeleaf   ⑵ jsp';
    let pageShowTypesArr = ['1', '2'];
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '选择项目使用的页面展示方式〖' + pageShowTypes + '〗，输入序号（默认使用 thymeleaf）：'), (projectPageShowType) => {
        let selectedPageShowType = '1';
        if (projectPageShowType.trim()) {
            if (pageShowTypesArr.contains(projectPageShowType.trim())) {
                selectedPageShowType = projectPageShowType.trim();
                if (callback && typeof callback === 'function') {
                    callback(selectedPageShowType);
                }
            } else {
                console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新选择');
                askProjectPageShowType(callback);
            }
        } else {
            if (callback && typeof callback === 'function') {
                callback(selectedPageShowType);
            }
        }
    });
}

// 询问项目是否添加基础的用户表
function askProjectIfAddUserTb(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '是否添加默认用户表 Y/N（默认 Y）：'), (projectAddUserTb) => {
        if (projectAddUserTb.trim()) {
            if (['Y', 'N'].contains(projectAddUserTb.trim().toUpperCase())) {
                if (callback && typeof callback === 'function') {
                    callback(projectAddUserTb.trim());
                }
            } else {
                console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
                askProjectIfAddUserTb(callback);
            }
        } else {
            if (callback && typeof callback === 'function') {
                callback(projectAddUserTb.trim());
            }
        }
    });
}

// 询问WebApp项目所在文件夹名称
function askWebAppProjectRootDir(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '您的WebApp所在的文件夹名称：'), (projectRootDir) => {
        if (projectRootDir) {
            if (callback && typeof callback === 'function') {
                callback(projectRootDir.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入错误，请重新输入');
            askWebAppProjectRootDir(callback);
        }
    });
}

// 询问JPush的appKey
function askJPushAppKey(callback) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '输入你的WebApp应用程序在极光推送注册获得的 AppKey：'), (appKey) => {
        if (appKey.trim()) {
            if (callback && typeof callback === 'function') {
                rl.close();
                callback(appKey.trim());
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
            askJPushAppKey(callback);
        }
    });
}

function runNpmIForWebApp(npmCommand) {
    askWebAppProjectRootDir((projectRootDir) => {
        // 判断项目是否存在
        libFs.exists(libPath.join(filePath, projectRootDir), function (projectDirExists) {
            if (projectDirExists) {
                let npmInstallCommand = 'npm i';
                if (npmCommand) {
                    npmInstallCommand = npmCommand;
                }
                console.log('');
                console.log(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', ' > ' + npmInstallCommand));

                toggleLoading('执行中');
                const npmInstallOptions = {
                    cwd: projectRootDir,
                    encoding: 'utf8'
                };
                const bat = childProcess.exec(npmInstallCommand, npmInstallOptions);
                bat.stdout.on('data', (data) => {
                    console.log('');
                    console.log(`${data}`);
                });

                bat.stderr.on('data', (data) => {
                    console.log('');
                    toggleLoading();
                    console.log(`错误： ${data}`);
                });

                bat.on('close', (code) => {
                    console.log('');
                    toggleLoading();
                    rl.close();
                });
            } else {
                console.error(styles.redBG[0] + '%s' + styles.redBG[1], 'WebApp项目 ' + projectRootDir + ' 不存在，请重新输入项目所在文件夹');
                runNpmIForWebApp();
            }
        });
    });
}

// 为WebApp集成JPush
function getInToWebAppJPush() {
    askWebAppProjectRootDir((projectRootDir) => {
        // 判断项目是否存在
        libFs.exists(libPath.join(filePath, projectRootDir), function (projectDirExists) {
            if (projectDirExists) {
                askJPushAppKey((appKey) => {
                    let installJPushCommand = 'ionic cordova plugin add jpush-phonegap-plugin --variable APP_KEY=' + appKey;
                    console.log('');
                    console.log(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', ' > ' + installJPushCommand));

                    //toggleLoading('执行中');
                    const installJPushOptions = {
                        cwd: projectRootDir,
                        encoding: 'utf8'
                    };
                    const bat = childProcess.exec(installJPushCommand, installJPushOptions);
                    bat.stdout.on('data', (data) => {
                        console.log(`${data}`);
                    });

                    bat.stderr.on('data', (data) => {
                        console.log(`错误： ${data}`);
                    });

                    bat.on('close', (code) => {
                        console.log(`子进程退出码：${code}`);
                        rl.close();
                        //toggleLoading();
                    });
                });
            } else {
                console.error(styles.redBG[0] + '%s' + styles.redBG[1], 'WebApp项目 ' + projectRootDir + ' 不存在，请重新输入项目所在文件夹');
                getInToWebAppJPush();
            }
        });
    });
}

var questionSelectMenu = function (doForType) {
    rl.question(util.format(styles.greenBG[0] + '%s' + styles.greenBG[1] + ' ', '请选择将要执行的项目，输入序号：'), (answer) => {
        console.log('');
        let selectIndex = `${answer}`;
        if (menuIndexArr.contains(selectIndex.trim().toUpperCase())) {
            selectMenuOk = true;
            switch (selectIndex.trim().toUpperCase()) {
                case '1':
                    // 构建WEB项目框架(包含数据展示及后台管理的框架)
                    let webProjectModePath = '../projectc/pros/weball/';
                    if (doForType == 'forD') {
                        webProjectModePath = libPath.join('D:/nx-proc/node_modules/', 'projectc/pros/weball/');
                    }
                    buildWebProject(webProjectModePath, {
                        packageReplace: true,
                        dir: {
                            _PROJECT_NAME_: '_PROJECT_NAME_'
                        },
                        file: {
                            'pom.xml': {
                                _PROJECT_NAME_: '_PROJECT_NAME_',
                                _DATA_BASE_DEPENDENCY_: '_BY_DATA_BASE_SELECTED_',
                                _PAGE_SHOW_TYPE_DEPENDENCY_: '_BY_PAGE_SHOW_SELECTED_TYPE_'
                            },
                            'application.properties': {
                                _PAGE_SHOW_TYPE_SET_PROPERTIES_: '_BY_PAGE_SHOW_SELECTED_TYPE_TO_SET_PROPERTIES_',
                                _DATA_BASE_SOURCE_URL_SET_PROPERTIES_: '_BY_DATA_BASE_SOURCE_URL_TO_SET_PROPERTIES_',
                                _DATA_BASE_SOURCE_USERNAME_SET_PROPERTIES_: '_BY_DATA_BASE_SOURCE_USERNAME_TO_SET_PROPERTIES_',
                                _DATA_BASE_SOURCE_PASSWORD_SET_PROPERTIES_: '_BY_DATA_BASE_SOURCE_PASSWORD_TO_SET_PROPERTIES_',
                                _DATA_BASE_DRIVER_CLASS_NAME_SET_PROPERTIES_: '_BY_DATA_BASE_DRIVER_CLASS_NAME_TO_SET_PROPERTIES_',
                                _DATA_BASE_DIALECT_SET_PROPERTIES_: '_BY_DATA_BASE_DIALECT_TO_SET_PROPERTIES_'
                            },
                            'ProjectNameApplication.java': {
                                ProjectNameApplication: '_INDEXOF_PROJECT_NAME_FIRST_UP_Application'
                            },
                            'ProjectNameApplicationTests.java': {
                                ProjectNameApplicationTests: '_INDEXOF_PROJECT_NAME_FIRST_UP_ApplicationTests'
                            },
                            'Constants.java': {
                                _PROJECT_NAME_: '_PROJECT_NAME_',
                                _project_name_: '_l_project_name_'
                            }
                        },
                        ignoreDir: {
                            'newProjectSelectedPageShowType==1': 'webapp',
                            'newProjectSelectedPageShowType==2': 'templates'
                        },
                        ignoreFile: {
                            'newProjectAddUserTb=="N"': 'UserInfo.java'
                        }
                    });
                    break;
                case '2':
                    // 构建WEB后台接口程序框架
                    rl.close();
                    break;
                case '3':
                    // 构建微信公众号框架
                    rl.close();
                    break;
                case '4':
                    // 构建微信小程序框架
                    rl.close();
                    break;
                case '5':
                    // 构建手机端WebApp框架
                    let webAppProjectModePath = '../projectc/pros/webapp/';
                    if (doForType == 'forD') {
                        webAppProjectModePath = libPath.join('D:/nx-proc/node_modules/', 'projectc/pros/webapp/');
                    }
                    buildWebAppProject(webAppProjectModePath, {
                        dir: {
                            _WEB_APP_: '_PROJECT_NAME_'
                        },
                        file: {
                            'config.xml': {
                                _THIS_APP_PACKET_NAME_: '_THIS_APP_PACKET_NAME_',
                                _THIS_APP_NAME_: '_THIS_APP_NAME_'
                            },
                            'ionic.config.json': {
                                _WEB_APP_: '_PROJECT_NAME_'
                            },
                            'package.json': {
                                _WEB_APP_: '_PROJECT_NAME_'
                            }
                        },
                        ignoreDir: {

                        },
                        ignoreFile: {

                        }
                    });
                    break;
                case '6':
                    // 构建H5活动推广页
                    let activeH5ProjectModePath = '../projectc/pros/activeH5/';
                    if (doForType == 'forD') {
                        activeH5ProjectModePath = libPath.join('D:/nx-proc/node_modules/', 'projectc/pros/activeH5/');
                    }
                    buildActiveH5Project(activeH5ProjectModePath, {
                        dir: {
                            _ACTIVE_H5_PROJECT_: '_PROJECT_NAME_'
                        },
                        file: {
                            '_ACTIVE_PAGE_NAME_.html': {
                                _ACTIVE_PAGE_NAME_: '_PROJECT_NAME_',
                                _ACTIVE_PAGE_ITEM_TEMPLETE_: '_BY_ACTIVE_H5_PAGE_COUNT_'
                            },
                            '_ACTIVE_PAGE_NAME_.js': {
                                _ACTIVE_PAGE_NAME_: '_PROJECT_NAME_'
                            },
                            '_ACTIVE_PAGE_NAME_.css': {
                                _ACTIVE_PAGE_MAIN_CSS_: '_CSS_BY_ACTIVE_H5_PAGE_COUNT_'
                            }
                        },
                        ignoreDir: {

                        },
                        ignoreFile: {

                        }
                    });
                    break;
                case 'S1':
                    // 为WebApp项目执行 npm install 命令
                    runNpmIForWebApp();
                    break;
                case 'S2':
                    // 为WebApp项目导入想要的组件
                    rl.close();
                    break;
                case 'S3':
                    // 为WebApp项目集成JPush（步骤一）
                    // https://www.npmjs.com/package/ionic2-jpush
                    // ionic cordova plugin add jpush-phonegap-plugin --variable APP_KEY=
                    getInToWebAppJPush();
                    break;
                case 'S4':
                    // 为WebApp项目集成JPush（步骤二）
                    // npm install ionic2-jpush --save
                    runNpmIForWebApp('npm i ionic2-jpush --save');
                    break;
            }
        } else {
            console.error(styles.redBG[0] + '%s' + styles.redBG[1], '输入无效，请重新输入');
            questionSelectMenu(doForType);
        }
    });
};

let doingCurIndex = 0;
let loadingTimer = null;
function toggleLoading(tip) {
    if (tip) {
        if (!loadingTimer) {
            loadingTimer = setInterval(() => {
                doingCurIndex += 1;
                printCopyProgress(doingCurIndex, true, tip);
            }, 60);
        }
    } else {
        clearInterval(loadingTimer);
        doingCurIndex = 0;
        loadingTimer = null;
    }
}

var webcStart = function () {
    showMenu();
    questionSelectMenu('normal');
};

var webcStartX = function () {
    showMenu();
    questionSelectMenu('forD');
};

exports.webcStart = webcStart;
exports.webcStartX = webcStartX;