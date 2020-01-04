<template>
  <div>
    <el-container style="height:100%">
      <el-aside width="200px" style="height:100%">
        <el-menu style="height:100%"
         @select="select"
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">
              <i class="el-icon-location"></i>
              <span>个人动态</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-edit"></i>
            <span slot="title">考试安排</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-user"></i>
            <span slot="title">查看个人信息</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-tickets"></i>
            <span slot="title">成绩查询</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main >
        <div class="student-main" v-if='currentIndex==2'>
          <el-card class="box-card" v-for="item in examInfo" :key="item.cono+item.cno">
            <div slot="header" class="card-header">
              <h3 class="card-header-title">{{item.couname}}</h3>
              <el-button type="primary" icon="el-icon-edit"  style="width:auto" @click="enterExam(item.exno,item.couname)">进入考试</el-button>
            </div>
            <div>考试开始时间：<span>{{item.startTime}}</span></div>
            <el-divider></el-divider>
            <div>监卷老师：<span>{{item.tname}}</span></div>
            <el-divider></el-divider>
            <div>考试总时长: <span>{{item.totalTime}}（分钟）</span></div>
            <el-divider></el-divider>
            <div>题目总数量:<span>{{item.totalNum}}</span></div>
          </el-card>
        </div>
      <el-card v-if='currentIndex==3'>
          <span>名字：{{studentInfo.sname}}</span>
          <el-divider></el-divider>
          <span>学号：{{studentInfo.sno}}</span>
          <el-divider></el-divider>
          <span>性别：{{studentInfo.ssex}}</span>
          <el-divider></el-divider>
          <span>联系方式：{{studentInfo.phoneNum}}</span>
          <el-divider></el-divider>
          <span>所在班级：{{studentInfo.cname}}</span>
          <el-divider></el-divider>
          <span>所在学校：{{studentInfo.scname}}</span>
        </el-card>
        <div  v-if='currentIndex==4'>
          <el-card v-for="(item,index) in gradeList" :key="index">
            <span>科目：{{item.coname}}</span>
            <el-divider></el-divider>
            <span>成绩：{{item.grade}}</span>
            <el-divider></el-divider>
            <span>查看详情：<a href="">点击</a></span>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  mounted() {
    this.studentInfo=JSON.parse(window.sessionStorage.getItem('user'))
    //考试安排是一个班统一安排的，所以根据班级编号即可得到考试信息
    this.axios.get('http://localhost:3000/exam/getExamArrangeList',{
      params:{
        cno: this.studentInfo.cno
      }
    }).then((res)=>{  
      res.data.map((item,index)=>{
        let tmp={}
        tmp.tname=item.tname
        tmp.cono=item.cono
        tmp.cno=item.cno
        tmp.exno=item.exno
        tmp.couname=item.coname
        tmp.startTime=new Date(item.start_time)
        tmp.totalTime=item.max_time
        tmp.totalName=item.question_num
        this.examInfo.push(tmp)
      })
      window.sessionStorage.setItem('examArrange',JSON.stringify(this.examInfo))
    })
    this.getGrade()
  },
  data() {
    return {
      studentInfo: {},
      currentIndex: 2,
      examInfo:[]
    }
  },
  methods: {
    select(index){
      this.currentIndex=index
    },
    getGrade(){
      const sno=JSON.parse(window.sessionStorage.getItem('user')).sno
      this.axios.get('http://localhost:3000/paper/getGrade',{
      params:{
        sno:sno
      }
    }).then(res=>{
        console.log(res);
        this.gradeList=res.data
      })
    },
    enterExam(exno,coname){
      let questionList=[]
      //根据课程号获取题目,同时将班级号发送过去，用以插入题目记录
      this.axios.get('http://localhost:3000/exam/getQuestionContent',{
        params:{
          exno
        }
      }).then((res)=>{
         questionList=res.data
         window.sessionStorage.setItem('coname',coname)
         window.sessionStorage.setItem('exno',exno)
         window.sessionStorage.setItem('questionList',JSON.stringify(questionList))
         this.goTo('exam')
      })
    },
    goTo(path){
      this.$router.push(path)
    }
  }
}
</script>

<style>
 .box-card{
   width: 300px;
   height:300px;
   margin: 50px;
 }
 .card-header{
   display: flex;
  justify-content: space-around;
 }
 .el-button--primary span{
   color: white!important;
 }
 .card-header-title{
   line-height: 10px;
 }
 .el-divider--horizontal {
    margin: 16px 0;
}
.student-main{
  display: flex;
}
.desc-text{
  color:#303133
}
.box-card span{
  color:#606266
}
</style>