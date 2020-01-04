//遍历目录操作

const fs = require('fs')

/**
 * 遍历目录下的文件目录
 * @param  {string} pathResolve  需进行遍历的目录路径
 * @param  {string} mime         遍历文件的后缀名
 * @return {object}              返回遍历后的目录结果
 */
const walkFile = function(  pathResolve , mime ){

  let files = fs.readdirSync( pathResolve )   //遍历目录的方法，得到一个文件数组

  let fileList = {}

   for( let [ i, item] of files.entries() ) {
    let itemArr = item.split('\.')   
    //取出数据的类型并进行判断看是否为SQL语句
    let itemMime = ( itemArr.length > 1 ) ? itemArr[ itemArr.length - 1 ] : 'undefined'
    let keyName = item + ''
    if( mime === itemMime ) {
      fileList[ item ] =  pathResolve + item
    }
  }
  //得到一个由文件名作为键，绝对路径作为值的map对象
  return fileList
}

module.exports = walkFile