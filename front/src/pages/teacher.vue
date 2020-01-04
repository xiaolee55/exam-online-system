<template>
  <div>
    <el-container style="height:100%">
      <el-aside width="200px" style="height:100%">
        <el-menu style="height:100%"
         @select="select"
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">
              <i class="el-icon-location"></i>
              <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-edit"></i>
            <span slot="title">发布考试</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-tickets"></i>
            <span slot="title">批改试卷</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-tickets"></i>
            <span slot="title">查看学生信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main >
        <el-card v-if='currentIndex==1'>
          <span>名字：{{teacherInfo.tname}}</span>
          <el-divider></el-divider>
          <span>工号：{{teacherInfo.tno}}</span>
          <el-divider></el-divider>
          <span>性别：{{teacherInfo.tsex}}</span>
          <el-divider></el-divider>
          <span>所教课程：{{teacherInfo.coname}}</span>
          <el-divider></el-divider>
          <span>联系方式：{{teacherInfo.phone_num}}</span>
          <el-divider></el-divider>
          <span>头衔：{{teacherInfo.title}}</span>
          <el-divider></el-divider>
          <span>所在学校：{{teacherInfo.scname}}</span>
        </el-card>
        <el-card  v-else-if='currentIndex==2'>
          <el-form  label-width="80px"  class="form-card">
            <el-form-item label="考试科目">
              <el-input v-model="exam_info.course"></el-input>
            </el-form-item>
            <el-form-item label="监卷教师">
              <el-input v-model="exam_info.tname"></el-input>
            </el-form-item>
            <el-form-item label="题目数量">
              <el-input v-model="exam_info.question_num"></el-input>
            </el-form-item>
            <el-form-item label="考试班级">
              <el-checkbox-group v-model="exam_info.select_class" >
                  <el-checkbox v-for="cl in  class_group" :label="cl.cno" :key="cl.cno">{{cl.cname}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="exam_info.start_time"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="总时间">
              <el-input v-model="exam_info.max_time"></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="commitExam">发布考试</el-button>
            </el-form-item>
          </el-form>         
        </el-card>
        <el-card v-else-if="currentIndex==3">
          <el-table
            :data="paperList"
            border
            style="width: 100%">
            <el-table-column
              prop="sname"
              label="名字"
              width="180">
            </el-table-column>
            <el-table-column
              prop="sno"
              label="学号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cname"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="grade"
              label="试卷">
              <template slot-scope="scope">
                 <el-button type="primary" @click="markPaper(scope)">批改</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="finish_time"
              label="提交时间">
            </el-table-column>
          </el-table>          
        </el-card>
        <el-card v-else-if="currentIndex==4">
          <el-table
            :data="studentsInfo"
            border
            style="width: 100%">
            <el-table-column
              prop="sname"
              label="名字"
              width="180">
            </el-table-column>
            <el-table-column
              prop="sno"
              label="学号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cname"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="grade"
              label="分数">
            </el-table-column>
          </el-table>          
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  mounted() {
    this.teacherInfo=JSON.parse(window.sessionStorage.getItem('user'))
    this.getClasses()
    this.getStudentsInfo()
    this.getPaperList()
  },
  data() {
    return {
      studentsInfo:[],
      paperList:[],
      questionList:[],
      class_group:[],
      teacherInfo: {},
      currentIndex: 1,
      exam_info:{
        course:'',
        tname: '',
        question_num:'',
        select_class:[],
        start_time:'',
        max_time:''
      }
    }
  },
  methods: {
    markPaper(scope){
      const row=scope.row
      console.log(row);
      
        this.axios.get('http://localhost:3000/teacher/getPaperContent',{
          params:{
            cono: JSON.parse(window.sessionStorage.getItem('user')).cono,
            sno:row.sno
          }
        }).then(res=>{
          if(res.status==200){
            this.questionList=[]
              if(res.data) 
                res.data[0].forEach((item) => {
                  let tmp={}
                  tmp.content=item.content.split('**')
                  tmp.id=item.id
                  tmp.answer=item.q_answer
                  this.questionList.push(tmp)
                })
            window.sessionStorage.setItem('paper',JSON.stringify(this.questionList))
            window.sessionStorage.setItem('sno',row.sno)
            this.goTo('paper')
          }
          console.log(this.questionList);
          
        })
    },
    getPaperList(){
      this.axios.get('http://localhost:3000/teacher/getPaperList',{
        params:{
         cono: this.teacherInfo.cono
        }
      }).then(res=>{
        if(res.status==200)
          this.paperList=res.data
      })
    },
    getClasses(){
      this.axios.get('http://localhost:3000/teacher/getClasses',{
        params:{
          tno: this.teacherInfo.tno
        }
      }).then(res=>{
        this.class_group=res.data      
      })
    },
    getStudentsInfo(){
      //获取学生信息列表
      this.axios.get('http://localhost:3000/teacher/getStudentsInfo',{
        params:{
          tno: this.teacherInfo.tno
        }
      }).then(res=>{
        this.studentsInfo=res.data
      })
    },
    formatDateTime(date) {
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? ('0' + m) : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      var h = date.getHours();  
      var minute = date.getMinutes();  
      minute = minute < 10 ? ('0' + minute) : minute;  
      return y + '-' + m + '-' + d+' '+h+':'+minute;  
    },   
    select(index){
      this.currentIndex=index
    },
    goTo(path){
      this.$router.push(path)
    },
    commitExam(){
      const tmp=JSON.parse(JSON.stringify(this.exam_info))
      tmp.tno=this.teacherInfo.tno
      tmp.cono=this.teacherInfo.cono
      tmp.start_time=this.formatDateTime(new Date(tmp.start_time))
      this.axios.post('http://localhost:3000/teacher/commitExam',tmp).then(res=>{
        if(status==200){
           this.currentIndex=1
          this.$message({
            message: '考试发布成功',
            type: 'success'
          });          
        }
      })
    }
  }
}
</script>

<style>
 .form-card{
   margin: 0 auto;
   width: 500px;
 }
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
.el-checkbox {
  float: left;
}
</style>