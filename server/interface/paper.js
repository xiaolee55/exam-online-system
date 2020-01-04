const Router = require('koa-router')
const query  = require ('../db/db.js')

let router = new Router({
  prefix: '/paper'
})

//提交试卷
router.post('/submitPaper',async (ctx)=>{
  const reqBody=ctx.request.body
  //将答案插入答案表
  for (const key in reqBody.answer) {
    await query(`INSERT INTO answer(sno,qid,q_answer) VALUES(${reqBody.sno},${key},'${reqBody.answer[key]}')`)
  }
  //增加一张试卷
  let createPaper=`INSERT INTO paper(sno,exno,finish_time) VALUES(${reqBody.sno},${reqBody.exno},'${reqBody.finish_time}')`
  await query(createPaper)
  ctx.response.body='提交成功，即将返回主页面' 
})

//获取学生成绩
router.get('/getGrade',async (ctx)=>{
  const reqBody=ctx.request.query
  const sno=reqBody.sno
  //根据学号获取所有成绩
  const gradeList=await query(`SELECT paper.*,course.coname 
                              FROM paper,course,exam_arrange 
                              WHERE paper.sno=${sno} 
                              AND course.cono=exam_arrange.cono
                              AND exam_arrange.exno=paper.exno`)
  ctx.response.body=gradeList
})

module.exports=router
