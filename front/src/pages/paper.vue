<template>
  <div class="exam-container">
    <el-tag effect="dark" class="exam-tag" >
      <span>{{coname}}批改试卷</span> 
      <el-tag  style="position:absolute;top:10px;right:300px" effect="plain">
        李莉的试卷
      </el-tag>
      </el-tag>
    <el-card v-for="item in questionList" :key="item.id" class="exam-box-card">
      <div slot="header">
        <span>{{item.content[0]}}</span>
      </div>
        <el-radio-group v-model="item.answer"  class="question-select">
          <el-radio :label="String(index+1)"  v-for="(select,index) in item.content.slice(1)" :key="index" >{{select}}</el-radio>
        </el-radio-group>
    </el-card>   
    <el-input-number v-model="grade"></el-input-number></br>
      <el-button type="primary" @click="commitGrade">提交成绩</el-button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.questionList=JSON.parse(window.sessionStorage.getItem('paper'))
    console.log('试卷',this.questionList);
    
  },
  data() {
    return {
      coname: '',
      questionList:[],
      time: 90,
      grade: 0
    }
  },
  methods: {
    goTo(path){
      this.$router.push(path)
    },
    commitGrade(){
      const exno=window.sessionStorage.getItem('exno')
      const sno=window.sessionStorage.getItem('sno')
      this.axios.post('http://localhost:3000/teacher/commitGrade',{sno,cono,grade:this.grade}).then(res=>{
        if(res.status==200){
        console.log(res);
          this.goTo('teacher')
        }
      })
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

