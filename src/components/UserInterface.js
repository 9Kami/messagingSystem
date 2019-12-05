import React from 'react';
import {Layout, Avatar, Dropdown, Menu, Icon, Badge} from 'antd';
import CommonStyles from './UserInterface.css'
import ValerieStyles from './ValerieUserInterface.css';
import MayStyles from './MayUserInterface.css';
import BobStyles from './BobUserInterface.css';
import {connect} from "dva";
import Communication from "./Communication";

const { Header, Sider, Content } = Layout;

class UserInterface extends React.Component {
  //get all chats of the user
  getCommunications(username) {
    this.props.dispatch({
      type: 'userInterface/getCommunications',
      payload: username
    });
  }

  //Creates timer and update the chats on the side bar every 0.5 second.
  componentDidMount() {
    this.getCommunications(this.props.username);
    this.intervalId = setInterval(() => {
      this.getCommunications(this.props.username);
    }, 5000);
  }
  
  //Clear timer if component is unmount/closed
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  //Handle chat selection.
  handleClick(e) {
    this.props.dispatch({
      type: 'userInterface/selectCommunication',
      payload: e
    });
  }

  render() {
    //Change styles base on the user
    let styles;
    switch (this.props.username) {
      case "May":
        styles = MayStyles;
        break;
      case "Valerie":
        styles = ValerieStyles;
        break;
      case "Bob":
        styles = BobStyles;
        break;
      default:
        styles = CommonStyles;
        break;
    }
  
    //dropdown menu of user
    const userMenu = (
      <Menu className={styles.dropdown}>
        <Menu.Item key="logout">
          <a onClick={() =>
          {
            this.props.dispatch({
              type: 'indexPage/logOut'
            });
          }
          }><Icon className={styles.accountIcon} type='logout' />Log Out</a>
        </Menu.Item>
      </Menu>
    );

    return <Layout>
      <Header className={styles.userInterfaceHeader}>
        <Dropdown overlay={userMenu} placement="bottomRight">
        <a className={styles.user}>
          <Avatar size={50} icon="user" />
          <span className={styles.userName}>{this.props.username}</span>
        </a>
        </Dropdown>
      </Header>
      <Layout>
        <Sider className={styles.userInterfaceSider} theme={'light'} width={'30%'}>
          <Menu className={styles.userInterfaceMenu} mode="inline">
            {//create a menu item for each chat.
              this.props.userInterface.communications.map((e,i,arr)=>
              <Menu.Item key={e.chatId} className={styles.menuItems} onClick={()=>this.handleClick(e)}>
                <a className={styles.communication}>
                    <Avatar size={50} icon="user" />
                  <span className={styles.userName}>{e.from}</span>
                </a>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        {//if a chat is selected, load Communication component for that chat, otherwise display blank.
          (this.props.userInterface.select === null)?
          <div className={styles.userInterfaceBlank}/>:
          <Communication username={this.props.username} chat={this.props.userInterface.select}/>}
      </Layout>
    </Layout>
  }
}

//binds state to view
export default  connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(UserInterface);
