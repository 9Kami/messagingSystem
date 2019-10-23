import React from 'react';
import {Avatar, Upload, Icon, Form, Input, Button} from 'antd';
import styles from './Communication.css';
import {connect} from "dva";
import moment from "moment";

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

  componentDidUpdate(prevProps) {
    if (this.props.from !== prevProps.from) {
      this.props.form.resetFields();
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
        console.log(values);
        console.log(moment().format());
        this.props.form.resetFields();
      }
    });
  };

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  onChange = (e) => {
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

  render() {
    const message = (this.props.userInterface.imageOnly)? this.props.userInterface.message.filter(e=>(e.isImage))
      :this.props.userInterface.message;
    const { getFieldDecorator } = this.props.form;

    return <main className={styles.main}>
      <div className={styles.communicationHeader}>
        <span>{this.props.from}</span>
        <a className={(this.props.userInterface.imageOnly)? styles.pictureOnlyActive:styles.pictureOnlyInactive}
           onClick={()=>this.handleImageOnly()}><Icon type="picture" /></a>
      </div>
      <div className={styles.communicationContent}>
      {message.map((e)=>(
        <div className={(e.send)? styles.messageRight:styles.messageLeft}>
          {(e.isImage)? <img className={styles.image} src={e.content} alt={'missing'} />:
            <span>{e.content}</span>}
          <br/>
          <span className={styles.time}>{this.changeTimeFormatByTime(moment(e.time))}</span>
        </div>
      ))}
      </div>
      <div className={styles.bottom}>
        <Upload accept={"image/*"}
                name="image"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={this.onChange}>
          <Button type="dashed" shape={"round"} size={"large"} className={styles.sendImage}>
            <Icon type="file-image" />
            Image
          </Button>
        </Upload>
        <Form hideRequiredMark onSubmit={this.handleSubmit} className={styles.sendForm}>
          <Form.Item className={styles.textInput}>
            {getFieldDecorator('message')(
              <Input/>
            )}
          </Form.Item>
          <Form.Item className={styles.sendButton}>
            <Button type="primary" htmlType="submit" loading={this.props.loading}>Send</Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  }
}

export default Form.create()(connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(Communication));
