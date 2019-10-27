export default {
  namespace: 'indexPage',
  state: {login:null},
  reducers: {
    logIn (state, {payload: {username, password, remember}}) {
      const loginInfo = {
        userID: 'Bob',
        nickName: 'Bob',
        avatar: ''
      };
      if(username ==='Bob' && password === '111'){
        if(remember) {
          if(window.localStorage){
            localStorage.setItem("messagingSystemLoginInfo", JSON.stringify(loginInfo));
          }
        }
        return {login: loginInfo};
      } else {
        alert("Username or password is wrong!");
      }
    },

    logOut (state) {
      localStorage.removeItem("messagingSystemLoginInfo");
      return {login:null};
    },

    autoLogIn (state, {payload: loginInfo}){
      return {login: loginInfo};
    }
  }
}
