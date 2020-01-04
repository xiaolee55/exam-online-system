const Router = require('koa-router')
const query  = require ('../db/db.js')

let router = new Router({
  prefix: '/users'
})

//验证用户的身份
router.post('/verify',async (ctx,next)=>{
  const {roleId,username,password,scno} = ctx.request.body
  let resUser= await query(`SELECT * FROM user WHERE id=${username} AND pwd=${password} AND scno=${scno} AND roleId=${roleId}`)
  if(roleId==1){
    // resUser=await query(`SELECT student.*,class.cname,school.scname 
    // FROM teacher,course,school 
    // WHERE teacher.cono=course.cono 
    // AND student.scno=school.scno 
    // AND student.sno=${username}
    // AND student.scno=${resUser.scno}`)
    resUser= (await query(`SELECT * FROM student WHERE student.sno=${username}`))[0]     //学生
    resUser.cname=(await query(`SELECT cname FROM class WHERE class.cno=${resUser.cno}`))[0].cname
    resUser.scname=(await query(`SELECT scname FROM school WHERE school.scno=${resUser.scno}`))[0].scname
  }else{
    // resUser=await query(`SELECT teacher.*,course.coname,school.scname 
    //             FROM teacher,course,school 
    //             WHERE teacher.cono=course.cono 
    //             AND teacher.scno=school.scno 
    //             AND teacher.tno=${username}
    //             AND teacher.scno=${resUser.scno}`)
    resUser=(await query(`SELECT * FROM teacher WHERE teacher.tno=${username}`))[0]    //教师
    resUser.coname=(await query(`SELECT coname FROM course WHERE course.cono=${resUser.cono}`))[0].coname
    resUser.scname=(await query(`SELECT scname FROM school WHERE school.scno=${resUser.scno}`))[0].scname    
  }

   if(resUser)
    ctx.response.body=resUser
  else
    ctx.response.body='没有该用户'
})

module.exports=router