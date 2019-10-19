import React from 'react';
import {Layout, Avatar, Dropdown, Menu, Icon, Badge} from 'antd';
import styles from './UserInterface.css';
import {connect} from "dva";
import Communication from "./Communication";

const { Header, Sider, Content } = Layout;

class UserInterface extends React.Component {
  getCommunications(user) {
    this.props.dispatch({
      type: 'userInterface/getCommunications',
      payload: user
    });
  }

  getMessages(from) {
    this.props.dispatch({
      type: 'userInterface/getMessages',
      payload: from
    });
  }

  componentDidMount() {
    this.getCommunications(this.props.user);
    this.intervalId = setInterval(() => {
      this.getCommunications(this.props.user);
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  userMenu = (
    <Menu className={styles.dropdown}>
      <Menu.Item key="logout">
        <a onClick={this.props.onLogOut}><Icon className={styles.accountIcon} type='logout' />Log Out</a>
      </Menu.Item>
    </Menu>
  );

  handleClick(from) {
    this.props.dispatch({
      type: 'userInterface/selectCommunication',
      payload: from
    });
    this.getMessages(from)
  }

  render() {
    return <Layout>
      <Header className={styles.userInterfaceHeader}>
        <Dropdown overlay={this.userMenu} placement="bottomRight">
        <a className={styles.user}>
          <Avatar size={50} icon="user" />
          <span className={styles.userName}>{this.props.user}</span>
        </a>
        </Dropdown>
      </Header>
      <Layout>
        <Sider className={styles.userInterfaceSider} theme={'light'} width={'30%'}>
          <Menu onClick={({key})=>this.handleClick(key)} mode="inline">
            {this.props.userInterface.communications.map((e,i,arr)=>
              <Menu.Item key={e.from} className={styles.menuItems}>
                <a className={styles.communication}>
                  <Badge count={e.unread}>
                    <Avatar size={50} icon="user" />
                  </Badge>
                  <span className={styles.userName}>{e.from}</span>
                </a>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        {(this.props.userInterface.select === null)?
          <div className={styles.userInterfaceBlank}/>: <Communication from={this.props.userInterface.select}/>}
      </Layout>
    </Layout>
  }
}

export default  connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(UserInterface);
