import React from 'react';
import { connect } from 'dva';
import Login from "../components/Login";
import UserInterface from "../components/UserInterface";

class IndexPage extends React.Component {
  componentDidMount() {
    let loginInfo;
    if(window.localStorage){
      loginInfo = JSON.parse(window.localStorage.getItem("messagingSystemLoginInfo"));
    }
    if(loginInfo !== null){
      this.props.dispatch({
        type: 'indexPage/autoLogIn',
        payload: loginInfo
      });
    }
  }

  render() {
    return (this.props.indexPage.login == null)? <Login/>:
      <UserInterface userID={this.props.indexPage.login.userID}
                     nickName={this.props.indexPage.login.nickName}
                     avatar={this.props.indexPage.login.avatar}/>;
  }
}

export default connect(({indexPage, loading}) => ({indexPage, loading: loading.models.indexPage}))(IndexPage);
