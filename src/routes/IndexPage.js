import React from 'react';
import { connect } from 'dva';
import Login from "../components/Login";
import UserInterface from "../components/UserInterface";

class IndexPage extends React.Component {
  //Check whether there is a login information in the local storage to auto log in
  componentDidMount() {
    let token;
    if(window.localStorage){
      token = JSON.parse(window.localStorage.getItem("messagingSystemToken"));
    }
    if(token !== null){
      this.props.dispatch({
        type: 'indexPage/autoLogIn',
        payload: token
      });
    }
  }

  render() {
    //If not log in, load Login component, otherwise load UerInterface component.
    return (this.props.indexPage.username === null)? <Login/>:
      <UserInterface username={this.props.indexPage.username}/>;
  }
}

export default connect(({indexPage, loading}) => ({indexPage, loading: loading.models.indexPage}))(IndexPage);
