const Router = require('koa-router')
const query  = require ('../db/db.js')

let router = new Router({
  prefix: '/teacher'
})

router.get('/getClasses',async(ctx)=>{     //获取所有教的班级
  const tno=ctx.request.query.tno
  const classGroup=await query(`SELECT * FROM class_teacher,class WHERE class_teacher.tno=${tno} AND class.cno=class_teacher.cno`)
  ctx.response.body=classGroup
})

router.get('/getStudentsInfo',async(ctx)=>{   //获取所有学生信息
  const tno=ctx.request.query.tno
  const studentGroup=await query(`SELECT * FROM student WHERE student.cno in 
                                                                        (SELECT class.cno FROM class_teacher,class,student 
                                                                          WHERE class_teacher.tno=${tno} 
                                                                          AND class.cno=class_teacher.cno)`)
  for (const [key,val] of studentGroup.entries()) {
    studentGroup[key].cname=(await query(`SELECT cname FROM class WHERE class.cno=${val.cno}`))[0].cname
  }
  ctx.response.body=studentGroup
})

router.post('/commitExam',async(ctx)=>{    //提交考试安排
  const {start_time,max_time,tno,question_num,cono,select_class}=ctx.request.body
  // //插入一条数据到考试安排表
  await query(`INSERT INTO exam_arrange(start_time,max_time,tno,question_num,cono) VALUES('${start_time}',${max_time},${tno},${question_num},${cono})`)
  let order=(await query(`SELECT MAX(exno) FROM exam_arrange`))[0]['MAX(exno)']         //使用聚集函数查询目前考试安排号中的最大数字，用以下面的语句
  !order?order=1:''
  for (const [key,val] of select_class.entries()) {     //插入数据到参加考试联系表
    await query(`INSERT INTO exam_arrange_class(exno,cno) VALUES(${order},${val})`)
  }
  const questionList=(await query(`SELECT * FROM question WHERE cono=${cono}`))   //从题库中抽取题目组成此次考试的试题' 
  for (const [key,val] of questionList.entries()) {     //将当前考试题目插入到考试题目表
    await query(`INSERT INTO exam_question(exno,qid) VALUES(${order},${val.id})`)
    } 
  ctx.response.body='考试安排成功'
})

router.get('/getPaperList',async(ctx)=>{     //获取学生试卷列表
  const cono=ctx.request.query.cono      //根据科目得到所有学生的试卷
  const paperGroup=await query(`SELECT paper.*,student.sname,class.cname 
                                FROM paper,student,class,exam_arrange
                                WHERE exam_arrange.cono=${cono} 
                                AND exam_arrange.exno=paper.exno 
                                AND paper.sno=student.sno 
                                AND class.cno=student.cno`)
  ctx.response.body=paperGroup
})

router.get('/getPaperContent',async(ctx)=>{     //获取某个学生的试卷及答案
  const {sno,cono}=ctx.request.query
  //先根据课程号得到所有的考试安排,再得到每场考试安排得到对应的题号,再根据学号和题号得到该学生的题目的答案 
  const examList=await query( `SELECT exno FROM exam_arrange WHERE cono=${cono}`)    
  let questionList=[]
  for (const [key,val] of examList.entries()) {
    questionList.push(
    await query(`SELECT question.content,question.id,answer.q_answer FROM exam_question,answer,question WHERE 
    exam_question.exno=${val.exno}
    AND answer.sno=${sno}
    AND exam_question.qid =question.id
    AND answer.qid=exam_question.qid`))
  }
  ctx.response.body=questionList
})

router.post('/commitGrade',async(ctx)=>{   //提交学生的成绩
  console.log(ctx.request.body);
  
  const {sno,exno,grade}=ctx.request.body
  await query(`UPDATE paper SET grade=${grade} WHERE sno=${sno} AND exno=${exno}`)
  ctx.response.body='修改成功'
}) 

module.exports=router