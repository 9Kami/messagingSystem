let communications = [
  {from:'Alice',
    messages: [
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?',
        time: "2019-10-21T21:03:02-03:00"
      },
      {
        isImage:true,
        send:true,
        content:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        time: "2019-10-21T21:03:02-03:00"
      }
    ]
  },
  {from:'Bad',
    messages: [
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?111111111111111111111111111111111',
        time: 20190208
      },
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?1',
        time: 20190208
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?1',
        time: 20190208
      }
    ]
  },
  {from:'CAC',
    messages: [
      {
        isImage:false,
        send:false,
        content:'Hi! How are you?2',
        time: 20190208
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?2',
        time: 20190208
      },
      {
        isImage:false,
        send:true,
        content:'Hi! How are you?2',
        time: 20190208
      }
    ]
  },
];

export default {
  namespace: 'userInterface',
  state: {communications:[], select:null, message:[], imageOnly:false},
  reducers: {
    getCommunications (state, {payload: user}) {
      if(user === 'Bob') {
        return {...state, communications:[
            {from:'Bad', unread:1},
            {from:'Alice', unread:11},
            {from:'CAC', unread:13},
            {from:'CACq', unread:13},
            {from:'CACw', unread:13},
            {from:'CACe', unread:13},
            {from:'CACr', unread:13},
            {from:'CACt', unread:13},
            {from:'CACy', unread:13},
            {from:'CACu', unread:13},
            {from:'CACi', unread:13},
            {from:'CACo', unread:13},
            {from:'CACp', unread:13},
          ]}
      }
    },

    selectCommunication (state, {payload: from}) {
      return {...state,communications:state.communications.map((e)=>((e.from === from)? {from:from, unread:0}:e)), select:from, imageOnly:false}
    },

    getMessages (state, {payload: from}) {
      return {...state, message: communications[communications.findIndex((e)=>(e.from === from))].messages};
    },

    imageOnly (state) {
      return {...state, imageOnly:!state.imageOnly};
    },

    sendMessage (state, {payload: message}) {
      communications = communications.map(e => ((e.from === state.select)? {...e, messages:[...e.messages, message]}:e));
      console.log(communications)
      return state;
    }
  }
}
