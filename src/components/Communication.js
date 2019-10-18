import React from 'react';
import {Layout, Avatar, Affix, Icon} from 'antd';
import styles from './Communication.css';
import {connect} from "dva";

const { Header,Content } = Layout;

class Communication extends React.Component {
  getMessages(from) {
    this.props.dispatch({
      type: 'userInterface/getMessages',
      payload: from
    });
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.getMessages(this.props.from);
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleImageOnly() {
    this.props.dispatch({
      type: 'userInterface/imageOnly'
    });
  }

  render() {
    const message = (this.props.userInterface.imageOnly)? this.props.userInterface.message.filter(e=>(e.isImage))
      :this.props.userInterface.message;

    return <main className={styles.main}>
      <div className={styles.header}>
        <span>{this.props.from}</span>
        <a className={(this.props.userInterface.imageOnly)? styles.pictureOnlyActive:styles.pictureOnlyInactive}
           onClick={()=>this.handleImageOnly()}><Icon type="picture" /></a>
      </div>
      <div className={styles.content}>
      {message.map((e)=>(
        <div className={(e.send)? styles.messageRight:styles.messageLeft}>
          {(e.isImage)? <img className={styles.image} src={e.content} alt={'missing'} />:
            <span className={styles.messageContent}>{e.content}</span>}
          <br/>
          <span className={styles.time}>{e.time}</span>
        </div>
      ))}
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
      <div className={styles.bottom}>Affix bottom</div>
    </main>
  }
}

export default  connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(Communication);
