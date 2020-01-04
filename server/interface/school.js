const Router = require('koa-router')
const query  = require ('../db/db.js')

let router = new Router()

router.get('/getSchool',async (ctx)=>{
 const schoolList= await query('SELECT * FROM school')
 if(schoolList)
  ctx.response.body=schoolList
})

module.exports=router
