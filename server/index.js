const Koa = require('koa')
const app = new Koa()

const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')

const school=require('./interface/school')
const users=require('./interface/users')
const exam=require('./interface/exam.js')
const paper=require('./interface/paper.js')
const teacher=require('./interface/teacher.js')

//配置可跨域访问
app.use(cors({
  origin: function (ctx) {
      return "*";  //表示允许所有端口访问
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
//解析post请求
app.use(bodyParser())

//挂载路由
app.use(school.routes()).use(school.allowedMethods())
app.use(users.routes()).use(users.allowedMethods())
app.use(exam.routes()).use(exam.allowedMethods())
app.use(paper.routes()).use(paper.allowedMethods())
app.use(teacher.routes()).use(teacher.allowedMethods())

app.use( async ( ctx ) => {
  console.log('请求数据',ctx.request.body)
})

app.listen(3000, () => {
  console.log('程序已在3000端口运行')
})