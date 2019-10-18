import React from 'react';
import { connect } from 'dva';
import Login from "../components/Login";
import UserInterface from "../components/UserInterface";

const IndexPage = ({ dispatch, indexPage, loading}) => {
  function handleOnLogIn(username, password, remember) {
    dispatch({
      type: 'indexPage/logIn',
      payload: {username, password, remember}
    });
  }

  function handleOnLogOut() {
    dispatch({
      type: 'indexPage/logOut'
    });
  }

  return ((indexPage.login == null)? <Login onLogIn={handleOnLogIn}/>:
    <UserInterface user={indexPage.login} onLogOut={handleOnLogOut}/>);
};

IndexPage.propTypes = {
};

export default connect(({indexPage, loading}) => ({indexPage, loading: loading.models.indexPage}))(IndexPage);
