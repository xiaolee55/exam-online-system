<template>
  <div class="exam-container">
    <el-tag effect="dark" class="exam-tag" >
      <span>{{coname}}考试</span> 
      <el-tag  style="position:absolute;top:10px;right:300px" effect="plain">
        离考试结束还剩 <span style="color:red">{{time}}</span> 分钟
      </el-tag>
      </el-tag>
    <el-card v-for="item in questionList" :key="item.id" class="exam-box-card">
      <div slot="header">
        <span>{{item.content[0]}}</span>
      </div>
        <el-radio-group v-model="answer[item.id]"  class="question-select">
          <el-radio :label="index+1"  v-for="(select,index) in item.content.slice(1)" :key="index">{{select}}</el-radio>
        </el-radio-group>
    </el-card>   
    <div><el-button type="danger" @click="submit">提交试卷</el-button></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.coname= window.sessionStorage.getItem('coname')
    let list  = JSON.parse(window.sessionStorage.getItem('questionList'))
    if(list) 
      list.forEach((item) => {
        let tmp={}
        tmp.content=item.content.split('**')
        tmp.id=item.id
        this.questionList.push(tmp)
      })
  },
  data() {
    return {
      coname: '',
      questionList:[],
      answer:{},
      time: 90
    }
  },
  methods: {
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
    submit(){
      this.$confirm('提交答案后将不能修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //还有题目没有做则报错
          if(Object.keys(this.answer).length<this.questionList.length){
              this.$message.error('还有题目未做答，请仔细检查');
              return
          }else{
            let store=window.sessionStorage
            this.axios.post('http://localhost:3000/paper/submitPaper',{
              sno:JSON.parse(store.getItem('user')).sno,
              answer:this.answer,
              finish_time: this.formatDateTime(new Date()),
              cno: JSON.parse(store.getItem('user')).cno,
              exno: store.getItem('exno')
            }).then((res)=>{
              if(res.status===200){
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '试卷提交成功，2s后返回主页面',
                  offset: 500,
                  duration: 1000
                });
                setTimeout(() => {
                  this.goTo('student')
                }, 2000)
              }
            })
          }
          
        }).catch(() => { 

      });     
    },
    goTo(path){
      this.$router.push(path)
    }
  },
}
</script>

<style>
.exam-tag{
  position: relative;
  width:100%;
  text-align: center;
  font-size: 30px;
  line-height: 60px;
  height: 60px;
}
.exam-container{
  display: flex;
  flex-direction: column;
  align-items: center;
}
 .exam-box-card{
   width: 70%; 
   height:150px;
   margin: 50px;
 }
 .question-select{
   display: flex;
   justify-content: space-around;
 }
</style>

