/*
路由对象模块
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/login.vue'
import Student from '../pages/student.vue'
import Exam from '../pages/exam.vue'
import Teacher from '../pages/teacher.vue'
import Paper from '../pages/paper.vue'
// 声明使用插件
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',    //使用路由的history模式，去除#号
  // 所有路由
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login, // 返回路由组件的函数, 只有执行此函数才会加载路由组件, 这个函数在请求对应的路由路径时才会执行
    },
    {
      path: '/student',
      name: 'student',
      component: Student
    },
    {
      path: '/exam',
      name: 'exam',
      component: Exam
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher,
    },
    {
      path: '/paper',
      name: 'paper',
      component: Paper,
    },
    {
      path: '/',
      component: Login,
      redirect: '/login'   //重定向
    },
    {
      path: '**',   // 错误路由
      redirect: '/login'   //重定向
    },
  ]
})