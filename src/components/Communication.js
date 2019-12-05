import React from 'react';
import {Avatar, Upload, Icon, Form, Input, Button, Modal, Spin} from 'antd';
import CommonStyles from './Communication.css'
import ValerieStyles from './ValerieCommunication.css';
import MayStyles from './MayCommunication.css';
import BobStyles from './BobCommunication.css';
import {connect} from "dva";
import moment from "moment";
import WebSocketInstance from "../websocket";


class Communication extends React.Component {
  state = {
    messages: [],
    gotMessage: false
  };
  
  constructor(props) {
    super(props);
    this.initialiseChat();
    WebSocketInstance.addCallbacks(
      messages => {
        this.setState({...this.state, messages: messages.reverse()});
        if(!this.state.gotMessage) {
          this.setState({...this.state, gotMessage: true});
          this.navigateToBottom();
        }
      },
      message => {
        console.log(message);
        this.setState({...this.state, messages:[...this.state.messages, message]});
        if(message.author !== this.props.chat.from){
          this.navigateToBottom();
        }
      }
    );
  }
  
  //Connect to the websocket server
  initialiseChat() {
    this.waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(
        this.props.username,
        this.props.chat.chatId
      );
    });
    WebSocketInstance.connect(this.props.chat.chatId);
  }
  
  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
        return;
      } else {
        console.log("wait for connection...");
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }
  
  //scroll to the last message into view.
  navigateToBottom() {
    let lastMessage = document.getElementById("lastMessage");
    if(lastMessage){
      lastMessage.scrollIntoView(true);
    }
  }
  
  //Switch socket when select another chat
  componentDidUpdate(prevProps) {
    if (this.props.chat.chatId !== prevProps.chat.chatId) {
      WebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        WebSocketInstance.fetchMessages(
          this.props.username,
          this.props.chat.chatId
        );
      });
      WebSocketInstance.connect(this.props.chat.chatId);
      this.setState({...this.state, gotMessage: false});
    }
  }

  //Show image messages only
  handleImageOnly() {
    this.props.dispatch({
      type: 'userInterface/imageOnly'
    });
  }
  
  //Send message.
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const messageObject = {
          from: this.props.username,
          content: values.message,
          chatId: this.props.chat.chatId,
          isImage: false,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.props.form.resetFields();
        this.props.dispatch({
          type: 'userInterface/disableSend'
        });
      }
    });
  };
  
  //Get base64 of the uploaded image.
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  //send the image.
  onChange = e => {
    if (e.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(e.file.originFileObj, imageUrl =>
        {
          const messageObject = {
            from: this.props.username,
            content: imageUrl,
            chatId: this.props.chat.chatId,
            isImage: true
          };
          WebSocketInstance.newChatMessage(messageObject);
        }
      );
    }
  };
  
  //Disable the send button if the input is blank or contains only spaces.
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
  
  //change the time format based on how soon the messages were sent.
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
  
  //Zoom the image
  handleImageZoom(imageUrl) {
    this.props.dispatch({
      type: 'userInterface/changeImageZoomState',
      payload: imageUrl
    })
  }

  render() {
    // Change the styles based on the user
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
    
    let messages = this.state.messages.map(e =>
      ({ isImage:e.isImage, send:e.author !== this.props.chat.from, content:e.content, time:e.timestamp }));
    // Filter all image messages if imageOnly is active.
    messages = (this.props.userInterface.imageOnly)? messages.filter(e=>(e.isImage)):messages;
    
    const { getFieldDecorator } = this.props.form;

    return <main className={styles.communicationMain}>
      <div className={styles.communicationHeader}>
        <span className={styles.communicationFrom}>{this.props.chat.from}</span>
        <a className={(this.props.userInterface.imageOnly)? styles.pictureOnlyActive:styles.pictureOnlyInactive}
           onClick={()=>this.handleImageOnly()}><Icon type="picture" /></a>
      </div>
      {(!this.state.gotMessage)? <Spin className={styles.communicationContent} size="large" />:
        <div className={styles.communicationContent} id={"messages"}>
          {//Display each message and give them styles based on whether its received or sent
            messages.map((e,i,arr)=>(
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
        </div>}
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

//Connect the userInterface model to the Communication component.
export default Form.create()(connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(Communication));
