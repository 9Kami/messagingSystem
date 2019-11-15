import React from 'react';
import {Avatar, Upload, Icon, Form, Input, Button, Modal} from 'antd';
import CommonStyles from './Communication.css'
import ValerieStyles from './ValerieCommunication.css';
import MayStyles from './MayCommunication.css';
import {connect} from "dva";
import moment from "moment";


class Communication extends React.Component {
  navigateToBottom() {
    let lastMessage = document.getElementById("lastMessage");
    if(lastMessage){
      lastMessage.scrollIntoView(true);
    }
  }

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
    this.navigateToBottom();
  }

  componentDidUpdate(prevProps) {
    if (this.props.from !== prevProps.from) {
      this.props.form.resetFields();
      this.props.dispatch({
        type: 'userInterface/disableSend'
      });
      this.navigateToBottom();
    } else if(this.props.userInterface.message !== prevProps.userInterface.message){
      this.navigateToBottom();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleImageOnly() {
    this.props.dispatch({
      type: 'userInterface/imageOnly'
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'userInterface/sendMessage',
          payload: {
            isImage:false,
            send: true,
            content: values.message,
            time: moment().format()
          }
        });
        this.getMessages(this.props.from);
        this.props.form.resetFields();
        this.props.dispatch({
          type: 'userInterface/disableSend'
        });
      }
    });
  };

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  onChange = e => {
    if (e.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(e.file.originFileObj, imageUrl =>
        this.props.dispatch({
          type: 'userInterface/sendMessage',
          payload: {
            isImage: true,
            send: true,
            content: imageUrl,
            time: moment().format()
          }
        })
      );
    }
  };

  handleInputChange = e => {
    let allSpace = /^\s*$/;
    console.log(e.target.value);
    if(allSpace.test(e.target.value)) {
      this.props.dispatch({
        type: 'userInterface/disableSend'
      })
    } else if(this.props.userInterface.sendDisable){
      this.props.dispatch({
        type: 'userInterface/enableSend'
      })
    }
  };

  changeTimeFormatByTime(time) {
    if(time > moment().subtract(1, 'minutes')) {
      return time.startOf('second').fromNow();
    } else if(time > moment().subtract(1, 'hours')) {
      return time.startOf('minute').fromNow();
    } else if(time > moment().subtract(1, 'days')) {
      return time.format('h:mm:ss a');
    } else if(time > moment().subtract(1, 'years')) {
      return time.format("MMM Do");
    } else {
      return time.format("MMM Do YYYY");
    }
  }

  handleImageZoom(imageUrl) {
    this.props.dispatch({
      type: 'userInterface/changeImageZoomState',
      payload: imageUrl
    })
  }

  render() {
    let styles;
    switch (this.props.nickName) {
      case "May":
        styles = MayStyles;
        break;
      case "Valerie":
        styles = ValerieStyles;
        break;
      default:
        styles = CommonStyles;
        break;
    }

    const message = (this.props.userInterface.imageOnly)? this.props.userInterface.message.filter(e=>(e.isImage))
      :this.props.userInterface.message;
    const { getFieldDecorator } = this.props.form;

    return <main className={styles.communicationMain}>
      <div className={styles.communicationHeader}>
        <span className={styles.communicationFrom}>{this.props.from}</span>
        <a className={(this.props.userInterface.imageOnly)? styles.pictureOnlyActive:styles.pictureOnlyInactive}
           onClick={()=>this.handleImageOnly()}><Icon type="picture" /></a>
      </div>
      <div className={styles.communicationContent} id={"messages"}>
      {message.map((e,i,arr)=>(
        <div className={(e.send)? styles.messageRight:styles.messageLeft} key={"message" + i}
             id={(i === arr.length-1)? "lastMessage":"message" + i}>
          {(e.isImage)?
            <img className={styles.image} src={e.content} alt={'missing'}
                 onClick={() => this.handleImageZoom(e.content)
                 }/>:
            <span>{e.content}</span>}
          <br/>
          <span className={styles.time}>{this.changeTimeFormatByTime(moment(e.time))}</span>
        </div>
      ))}
      </div>
      <div className={styles.communicationBottom}>
        <Upload accept={"image/*"}
                name="image"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={this.onChange}>
          <Button type="primary" shape={"round"} size={"large"} className={styles.sendImage}>
            <Icon type="file-image" />
          </Button>
        </Upload>
        <Form hideRequiredMark onSubmit={this.handleSubmit} className={styles.sendForm}>
          <Form.Item className={styles.textInput}>
            {getFieldDecorator('message')(
              <Input onChange={this.handleInputChange} placeholder = "Type message and hit Send"/>
            )}
          </Form.Item>
          <Form.Item className={styles.sendButton}>
            <Button type="primary" htmlType="submit" loading={this.props.loading}
                    disabled={this.props.userInterface.sendDisable}>Send</Button>
          </Form.Item>
        </Form>
      </div>
      <Modal className={styles.modal}
             visible={this.props.userInterface.imageZoom}
             onCancel={() => this.handleImageZoom("")}
             maskClosable={true}
             centered={true}
             width={"auto"}
             footer={null}>
        <img className={styles.zoomedImage} src={this.props.userInterface.zoomedImage} alt={'missing'}
             height={window.innerHeight - 150} onClick={() => this.handleImageZoom("")}/>
      </Modal>
    </main>
  }
}

export default Form.create()(connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(Communication));
