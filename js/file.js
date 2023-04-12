const fs = require("fs");
const { getTimeNow } = require("./util");
const { dbDir } = require("./config");
const path = require('path');


function createDir(myPath) {
    return new Promise((rs, rj) => {
        fs.mkdir(myPath, err => {
            if (err) rj(err)
            rs()
        });
    })
}

function writeFile(path, data) {
    if (!data) return Promise.reject("缺少資料")
    return new Promise((rs, rj) => {
        fs.writeFile(path, data, (err) => {
            if (err) rj(err)
            console.log('File寫入成功:', path)
            rs()
        })
    })
}

// function isDirDup(myPath=dbDir){
//     let arr = fs.readdirSync(myPath) || []
//     let tempT = getTimeNow().slice(0,-4)
//     let isDup = arr.some(vo =>  vo.includes(tempT))
//     return isDup
// }

function getLastDir() {
    let arr = fs.readdirSync(dbDir) || []
    return arr[arr.length - 1]
}

function readdir(myPath = dbDir) {
    return fs.readdirSync(myPath) || []
}

function deleteFolderRecursive(myPath) {
    if (fs.existsSync(myPath)) {
        fs.readdirSync(myPath).forEach((file, index) => {
            const curPath = path.join(myPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(myPath);
        console.log('已刪除: ', myPath);
    }
};


module.exports = {
    createDir,
    writeFile,
    deleteFolderRecursive,
    getLastDir,
    readdir
}