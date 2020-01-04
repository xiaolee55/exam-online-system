
<template>
  <el-container>
    <el-header class="header">
      <el-row :gutter="0">
        <el-col class="login-header">
          <span>在线考试系统</span>
        </el-col>
      </el-row>     
    </el-header>
    <el-main>
      <el-row style="margin-top:10%">
        <el-col :span="6" :offset="9">
          <el-form label-width="100px" :model="user" status-icon :rules="rules" ref="user">
            <el-form-item label="选择身份" prop="roleId"> 
              <el-radio v-model="user.roleId" label="1" border>学生</el-radio>
              <el-radio v-model="user.roleId" label="2" border>老师</el-radio>
            </el-form-item>
            <el-form-item label="账号"  prop="username">
              <el-input type="username" placeholder="请输入账号" v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="password" >
              <el-input type="password"  placeholder="请输入密码" v-model="user.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="学校" class="school-select" prop="schoolId">
              <el-select v-model="user.scno" placeholder="请选择您的学校"  filterable>
                    <el-option v-for="(school,index) in schoolList" :key="index" :value="school.scno" :label="school.scname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="btn">
              <el-button type="primary" @click="login('user')" class="bbb">
                <span v-if="login_status">登陆中<i class="el-icon-loading"></i></span>
                <span v-else>登录</span>
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer style="height:0">
       <el-row :gutter="0">
        <el-col class="login-footer">
          <span>17级软件工程(1)班李昌校</span>
        </el-col>
      </el-row>      
    </el-footer>
  </el-container>
</template>

<script>
export default {
    data() {
      return {
        rules: {
          username: [
            { required: true, message: '账号不能为空'},
            { type: 'string', message: '账号必须为数字值'}
          ],
          password: [
            { required: true, message: '密码不能为空'}
          ],
          scno: [
            { required: true, message: '请选择学校', trigger: 'change' }
          ],
                  
        },
        schoolList:[],
        login_status: false,
        user: {
          roleId: '1',
          username: '',
          password: '',
          scno: '',
        }
      }
    },
    mounted() {
      this.axios.get('http://localhost:3000/getSchool').then((res)=>{
          this.schoolList=res.data
      })     
    },
    methods: {
      login(){
        this.axios.post('http://localhost:3000/users/verify',this.user).then((res)=>{
            if(res.status==200){
              if(res.data=="没有该用户")
                this.$message.error('登录失败，请检查输入信息是否有误。')
              else{
                if(this.user.roleId=='1')
                  name=res.data.sname
                else 
                  name=res.data.tname
                this.$message({
                  message: `欢迎您，${name}`,
                  type: 'success',
                  duration: '1000'
                })
                window.sessionStorage.setItem('user',JSON.stringify(res.data))
                this.user.roleId=='1'?this.goTo('student'):this.goTo('teacher')
              }
            }else{
              this.$message.error(`登录失败，状态码为${res.status}`)
            }
        })
      },
      goTo(path){
        this.$router.replace(path)
      }
    } 
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
footer,header{
  padding: 0!important;
}
  .login-header{
    padding: 20px;
    background-color: #303133;
    text-align: center;
    color: white;
    font-size: 25px;
  }
  .login-footer{
    padding: 10px;
    background-color: #303133;
    text-align: center;
    color: white;
    font-size: 10px;  
  }
  .login-content{
    margin: 0px auto;
  }
    .el-select{
      display: block;
    }
    .bbb{
      width: 100%;
    }
    .el-checkbox{
      float: right;
    }
</style>