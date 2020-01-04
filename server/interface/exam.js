const Router = require('koa-router')
const query  = require ('../db/db.js')

let router = new Router({
  prefix: '/exam'
})

//获取考试安排列表
router.get('/getExamArrangeList',async (ctx)=>{
  const reQuery=ctx.request.query
  //因为一个班的考试安排都是一样的,所以根据班级编号查询考试安排
  const arrange=(await query(`SELECT exam_arrange.*,teacher.tname,course.coname
                              FROM exam_arrange_class,exam_arrange,teacher,course
                              WHERE exam_arrange_class.cno=${reQuery.cno} 
                              AND teacher.tno=exam_arrange.tno
                              AND course.cono=exam_arrange.cono
                              AND exam_arrange.exno=exam_arrange_class.exno`))

  if(arrange)
   ctx.response.body=arrange
})

//获取题目内容
router.get('/getQuestionContent',async (ctx)=>{
  const reQuery=ctx.request.query
  const questionList=(await query(`SELECT question.* 
                                   FROM question,exam_question 
                                   WHERE exam_question.exno=${reQuery.exno}
                                   AND exam_question.qid=question.id`))
  ctx.response.body=questionList
})



module.exports=router
