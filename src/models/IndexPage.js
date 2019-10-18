export default {
  namespace: 'indexPage',
  state: {login:null},
  reducers: {
    logIn (state, {payload: {username , password}}) {
      if(username ==='Bob' && password === '111'){
        return {login:'Bob'};
      } else {
        alert("Username or password is wrong!")
      }
    },

    logOut (state) {
      return {login:null}
    },

    getCommunications (state, {payload: user}) {
      if(user === 'Bob') {
        return {}
      }
    }
  }
}
