<template>
  <v-app id="inspire">
      <div>
        <div id="header">

        </div>
        <div id="main-container">
            
          <PermissionList />
        </div>
        
      </div>
  </v-app>
</template>

<script>
import PermissionList from './components/PermissionList';

export default {
  name: 'App',
  components: {
      PermissionList
  },
  methods:{
  },
  data (){
    return{
      
    }
  },
  created(){
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}

body{
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5em;
  padding: 0;
  margin: 0;
}

#main-container{
  border: solid 1px #ccc;
  width: 600px;
  margin: 100px auto;
}

#header{
  background: black;
  padding: 10px;
}

h2{
  padding: 0 10px;
}
</style>
