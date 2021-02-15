import React, { useState, useEffect } from "react";
import  $, { data } from 'jquery';
import {useSelector, useDispatch} from 'react-redux';
import axios from "axios";
import NavLinks from './component/Nav';
import {baseUrl, getCookie, setCookie, SOCKET} from './myJs';
import { v4 as uuidv4 } from 'uuid';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import Logo from './component/Logo';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import useToggle from './myJs';
import { useHistory } from "react-router-dom";
import {addDefaultSrc, returnDefaultImage} from "./myJs";

const override = css`
  display: block;
  margin: 10px auto;
  border-radius: 50px !important;
  width: 95%;
`;

// localStorage.setItem("session_id", "VJZgDUeyMnJU0BpjPT7uvGl4ByTYwe75")
// setCookie("session_id", "AN9Gjrtdt2324st38Qntr2IrhAWvUAdD", 1)
// setCookie("user_id", 27, 1)
// app id: bd7c4ac2265f496dbaa84d9837960c78
// app secret: 40082f25ff2a4b88ac1358f7e863cba6
// channel: test
// token: 006bd7c4ac2265f496dbaa84d9837960c78IAAq1GZbv3moec3u6pFg67UZMEm0pzTuHT21ki9gqV9EXQx+f9gAAAAAEAAH/YchlRMJYAEAAQCYEwlg

let messageList = [], receiver_id, userData, searchName = "", 
searchPage = 1, myFriendList = [], friendId = null, onlineInterval;

const scrollToBottom = () => {
    var div = document.getElementById('chat-body');
    if (!!div)
        div.scroll({ top: div.scrollHeight, behavior: 'smooth' });
}

const ChatBox = (props) =>{
    const dispatch = useDispatch();
    const history = useHistory()
    // window.setTimeout()
    const[Likes, setLikes] = useState([]);
    const[Visitors, setVisitors] = useState([]);
    const[FriendList, setFriendlist] = useState([]);
    const[isLoaded, setIsLoaded] = useState(false);
    const[FriendUserId, setFriendId] = useState(null);
    const[AllData, setData] = useState('');
    const[CompleteMessageList, setMessages] = useState([]);
    const[UserMessage, setuserMessage] = useState('');
    const[randomNumber, setRandomNumber] = useState('');
    const [isOn, toggleIsOn] = useToggle();
    const [GiftData , setGiftData] =useState([]);

    let [loading, setLoading] = useState(false);
    const[recording, setRecording] = useState(false);
    const [dummyMediaRc, setDummyMediaRc] = useState(null)
    const [chatTyping, setChatTyping] = useState("")

    const [searchUser, setSearchUser] = useState("")
    const [searchUserForm, setSearchUserForm] = useState("")
    const [userInterval, setUserInterval] = useState(0)

    const createNotificationCustom = (type) => {
  
        switch (type) {
          case 'success':
            NotificationManager.success('Send successfull', 'Gift');
            break;
          case 'error':
            NotificationManager.error('Please recharge and try again', 'Insufficient Balance!', 5000, () => {
            });
            break; 
      };
      };

// console.log(UserMessage);
    const[GetActivity, setActivity] = useState(0);

    // userData = useSelector(userProfile).user.profile; //using redux useSelector here
      userData = {user_id: 27, first_name: "Neo", last_name: "Anderson"}

    console.log(CompleteMessageList, "nowwww")
    const sessionId = getCookie("session_id");


    const updateFriendDetails = (details) => {
        friendId = details.id;
        console.log(details.id, "kkkkkk")
        setFriendId(details.id)
        console.log(details, "details..")
        setData(details);
    }
    // Fetching details of user initial time
    const getAllDetails = async (name, page, scroll) => {
        // const likes = await axios.post(LIKED_LIST,bodyParameters)
        // setLikes(likes.data.data);

        // Destructing response and getting data part
        // const visitor = await axios.post(VISITOR_LIST_API,bodyParameters)
        // setVisitors(visitor.data.result);
        const bodyParameters = {
            session_id: getCookie("session_id"),
            name
        };

        const friend= await axios.post(baseUrl() + "/fake-user?page="+page, bodyParameters)
        console.log(friend, "friend......")
        if (!!friend.data.users) {
            let data = friend.data.users.data;
            if (scroll) {
                console.log(myFriendList, data, "test...")
                data = [...myFriendList, ...data]
            }
            myFriendList = data;
            console.log(myFriendList, "myFriendList...")
            setFriendlist(data);
        }
    }

// Onclick button, getting LIkes, Visitor and friends list

    const getLikes = async () => {  //Likes here
        // setActivity(0);
        // const { data: {data} } = await axios.post(LIKED_LIST,bodyParameters)
        // setLikes(data);
    }

    const getVisitors = async () => {  // Visitors here
        // setActivity(1);
        // const { data: {result} } = await axios.post(VISITOR_LIST_API,bodyParameters)
        // setVisitors(result);

    }

    const getFriend = async() => { //Friends here
        // setActivity(2);
        // const {data:{data}}= await axios.post(FRIENDLIST_API,bodyParameters)
        // setFriendlist(!!data ? data : []);
    }

    // fetching friends according to userID
    const getFriendDetails = async() => {
        // const bodyParameters = {
        //     session_id: localStorage.getItem('session_id'),
        //     user_id: FriendUserId,
        // };

        // const {data:{data}}= await axios.post(GET_USERPROFILE_API,bodyParameters)
        // setData(data);
    }


    const AcceptUserRequest = (LikedUserId) =>{
        // const bodyParameters = {
        //     session_id : sessionId,
        //     id : LikedUserId
        // }
        // axios.post(ACCEPT_REQUEST_API , bodyParameters)
        //     .then((response) => {
        //         if(response.status==200)
        //         {
        //             createNotification('accept');
        //         }
        //     }, (error) => {
        //     });

    }

    const realTimeActiveUser = () => {
        onlineInterval = window.setInterval(
               function () {
                   console.log(userInterval, "userInterval....")
                    SOCKET.emit('realtime_active_users', {user_id: getCookie("user_id") });
               },
               1000
           )
       }
   

    //all gift
    const handleGift = async() =>{
        // toggleIsOn(true);
        // const bodyParameters = {
        //     session_id :  localStorage.getItem('session_id'),
        //     }
        //     const {data:{result}} = await axios.post(GIFT_LIST_API , bodyParameters)
        //     setGiftData(result);
            }
     
        //get single  gift item
           const getGiftItem = async(giftId) => {
        //    const bodyParameters ={
        //    session_id :  localStorage.getItem('session_id') ,
        //    gift_id : giftId ,
        //    given_to : FriendUserId
        //    }
        //     const {data : {giftStatus}} = await axios.post(GIFT_PURCHASE_API , bodyParameters)
        //         // alert(giftStatus.get_gifts.image);

        //         if(!!giftStatus)
        //         {
        //         toggleIsOn(false);
        //         var msg = {};
        //         msg.file = giftStatus.get_gifts.image;
        //         msg.fileName = "abc_image";
        //         msg.sessionId = sessionId;
        //         msg.reciever_id = receiver_id;
        //         SOCKET.emit('gift_send', msg);
        //         setLoading(true);
        //         }
        //         else
        //         {
        //             toggleIsOn(false);
        //             createNotificationCustom('error');
                    
        //         }
             }
    /************************************* Working here socket *******************************************************/

    function readThenSendFile(data){
        var reader = new FileReader();
        reader.onload = function(evt){
            var msg ={};
            msg.file = evt.target.result;
            msg.fileName = data.name;
            msg.sessionId = sessionId;
            msg.reciever_id = receiver_id;
            console.log(msg, "msg...")
            SOCKET.emit('media_file', msg);
            setLoading(true);
        };
        reader.readAsDataURL(data);
    }


    // Authenicating user here
    const DetermineUser = () => {
        var secondUserDataId = FriendUserId;
        SOCKET.emit("authenticate", {
            session_id: sessionId,
            reciever_id: secondUserDataId
        });
    }

    // Socket Methods
    const CheckTextInputIsEmptyOrNot = (e) =>  {
        e.preventDefault()
        if ( UserMessage != '') {
            var secondUserDataId = FriendUserId;
            var message = { "session_id": sessionId, "reciever_id": secondUserDataId, "message": UserMessage }
            console.log('sent>>>> Data', message);
            SOCKET.emit("send_message", message);
            setuserMessage(''); //Empty user input here
        } else {
            console.log("Please enter message")
        }
    }
    // Get all messages here
    const GetAllMessages = (messages) => {
        console.log(messages.message_list,"messages.message_list....")

    }

    useEffect(() => {
        console.log(FriendList, "FriendList...")
    }, [FriendList])
    useEffect(() => {
        scrollToBottom();
    }, [randomNumber])
// console.log(FriendUserId);

    const verifyFakeUser = async () => {
        const bodyParameters = {
            session_id: getCookie("session_id"),
            user_id: getCookie("user_id")
        }
        try {
            const loginUser= await axios.post(baseUrl() + "/getSingleUserDetail", bodyParameters)
            if (loginUser.data.status === 200 && loginUser.data.success) {
                if (loginUser.data.userData.is_fake !== 2) {
                    window.location.href = "http://moshmatch.com/apprich/admin/home"    
                }
            }
            else {
                window.location.href = "http://moshmatch.com/apprich/admin/home"
            }
        }
        catch (err) {
            window.location.href = "http://moshmatch.com/apprich/admin/home"
        }
    }

    const makeMeFrd = async () => {
        const bodyParameters = {
            session_id: getCookie("session_id"),
            user_id: friendId
        }
        console.log(FriendUserId, "FriendUserId....")
        const makeMyFrd= await axios.post(baseUrl() + "/chatUser", bodyParameters)
    }

    useEffect(()=>{
        verifyFakeUser();
        realTimeActiveUser();
        $('#chat').on('scroll', function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                const nextPage = searchPage + 1;
                searchPage = nextPage 
                getAllDetails(searchName, nextPage, true)
            }
        })
        SOCKET.connect()
        window.setTimeout(() => {
            $('#uploadfile').bind('change', function(e){
                var data = e.originalEvent.target.files[0];
                const fileName = data.name.split(".");
                const imageFormat = fileName[fileName.length - 1];
                if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" ||
                    imageFormat === "PNG" || imageFormat === "JPG" || imageFormat === "JPEG") {
                    readThenSendFile(data);
                }
                else {
                    alert("Only .png, .jpg, .jpeg image formats supported.")
                }
            })
        }, 2000);

        // getAllDetails("", 1);

        SOCKET.on('getMessage', (messages) => { // only one time
            setLoading(false);
            setMessages(messages.message_list);
            messageList = messages.message_list;
            if(messageList.length === 0) {
                makeMeFrd()
            }
        });
        // Checking the typing user
        SOCKET.on('typing', (typing) => {
            if (!!typing) {
                if ((typing.user_id === userData.user_id && typing.reciever_id === receiver_id)
                    ||
                    (typing.user_id === receiver_id && typing.reciever_id === userData.user_id)
                ) { // check one-to-one data sync

                    if (typing.user_id !== userData.user_id) {
                        setChatTyping(typing.typing_user)
                        window.setTimeout(() => {
                            setChatTyping("")
                        }, 2000)
                    }
                }
            }
        })

        SOCKET.on('message_data', (messages) => {
            // console.log(messages, "test..");
            console.log(messageList, "CompleteMessageList")
            let messagesList = messageList;
            if (!!messages) {

                if ((messages.obj.user_from_id === userData.user_id && messages.obj.user_to_id === receiver_id)
                    ||
                    (messages.obj.user_from_id === receiver_id && messages.obj.user_to_id === userData.user_id)
                ) { // check one-to-one data sync
                    messagesList.push(messages.obj);
                    messageList = messagesList;
                    console.log(messagesList, "messageList...")
                    setMessages(messagesList);
                    setRandomNumber(Math.random());
                    scrollToBottom()
                }
            }
        });
        SOCKET.on('media_file', (messages) => {
            console.log(messageList, "CompleteMessageList")
            let messagesList = messageList;
            if (!!messages) {
                if ((messages.obj.user_from_id === userData.user_id && messages.obj.user_to_id === receiver_id)
                    ||
                    (messages.obj.user_from_id === receiver_id && messages.obj.user_to_id === userData.user_id)
                ) {
                    messagesList.push(messages.obj);
                    messageList = messagesList;
                    console.log(messagesList, "messageList... pic")
                    setMessages(messagesList);
                    setuserMessage(''); //Empty user input here
                    setLoading(false);
                    setRandomNumber(Math.random());
                    scrollToBottom()
                }
            }
        });

        SOCKET.on('gift_send',(messages) =>{
            console.log(messages,"message_gift....");
           let messagesList = messageList;
            if(!!messages)
            {
                if ((messages.obj.user_from_id === userData.user_id && messages.obj.user_to_id === receiver_id)
                    ||
                    (messages.obj.user_from_id === receiver_id && messages.obj.user_to_id === userData.user_id)
                )
                {
                    messagesList.push(messages.obj);
                    messageList = messagesList;
                    console.log(messagesList,"messageList_gift_send ........ ");
                    setMessages(messagesList);
                    setLoading(false);
                    setRandomNumber(Math.random());
                    scrollToBottom();
                }
            }
        });

        SOCKET.on('voice', function(arrayBuffer) {
            let messagesList = messageList;
            console.log(messageList, "CompleteMessageList")
            if (!!arrayBuffer) {
                if ((arrayBuffer.obj.user_from_id === userData.user_id && arrayBuffer.obj.user_to_id === receiver_id)
                    ||
                    (arrayBuffer.obj.user_from_id === receiver_id && arrayBuffer.obj.user_to_id === userData.user_id)
                ) {
                    messagesList.push(arrayBuffer.obj);
                    messageList = messagesList;
                    console.log(messagesList, "messageList... pic")
                    setMessages(messagesList);
                    setuserMessage(''); //Empty user input here
                    setRandomNumber(Math.random());
                    scrollToBottom()
                }
            }
            // src= window.URL.createObjectURL(blob);

        });

        SOCKET.on('realtime_active_users', (data) => {
            if(data.user_id == getCookie("user_id") ){
             const apiData= myFriendList;
             const socketData = data.list;
            for (let i in apiData) {
             apiData[i].is_online = false
                for (let j in socketData) {
                    console.log(apiData[i].id, socketData[j].id, "check....")
                    if (apiData[i].id == socketData[j].id) {
                        apiData[i].is_online = true
                    }
                }
             }
             myFriendList = apiData;
             setFriendlist(myFriendList);
             setUserInterval(Math.random())
      }
    })

    return () => {clearInterval(onlineInterval)}
    },[])

    // On text typing value
    const changeInput = (e) => {
        setuserMessage(e.target.value)
        SOCKET.emit("typing", {
            user_id: userData.user_id,
            typing_user: userData.first_name + " " + userData.last_name,
            reciever_id: receiver_id
        })
    }

    useEffect(()=>{
            setMessages([]);
            messageList = [];
            // getFriendDetails();
        
        if (!!FriendUserId) {
            receiver_id = FriendUserId;
            DetermineUser();
            setLoading(true);
            //  GetAllMessages();
            //  OnReceivedMessage();

        }
        // get messagesfrom socket...

    },[FriendUserId])

    var blobToBase64 = function(blob, callback) {
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            return callback(base64);
        };
        reader.readAsDataURL(blob);
    };

    useEffect(() => {
        console.log(recording, "record....")
    }, [recording])
    const sendVoiceNote = () => {
        console.log(recording, "recordddddddd")
        if (!dummyMediaRc) {
            var constraints = {audio: true};
            let recordAudio = false;
            if ( !!navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
                    recordAudio = true;
                    var mediaRecorder = new MediaRecorder(mediaStream);

                    mediaRecorder.onstart = function (e) {
                        setDummyMediaRc(mediaRecorder);
                        this.chunks = [];
                    };
                    mediaRecorder.ondataavailable = function (e) {
                        this.chunks.push(e.data);
                    };
                    mediaRecorder.onstop = function (e) {
                        var blob = new Blob(this.chunks,);
                        console.log(blob, "blob.....")
                        blobToBase64(blob, (output) => {
                            SOCKET.emit('radio', {blob: 'data:audio/mp3;base64,' + output, sessionId, reciever_id: FriendUserId});
                        })
                    };

                    // Start recording
                    mediaRecorder.start();
                }).catch(function (err) {
                    createNotification('error-message')
                    alert(err.message)
                })
            }
            else {
                alert("You need a secure https connection in order to record voice")
            }
        }
        else {
            console.log(dummyMediaRc, "media rec...")
            dummyMediaRc.stop();
            setDummyMediaRc(null);
        }
    }
    useEffect( () => {
        console.log(CompleteMessageList.length, "CompleteMessageList length...")
        scrollToBottom()
    }, [CompleteMessageList])

    /*=============================== Video Call ========================================================*/

    const handleVideo = (image) =>{
        // var secondUserDataId = FriendUserId;
        // dispatch(
        //     videoCall({
        //         user_from_id: userData.user_id,
        //         user_to_id: secondUserDataId,
        //         user_to_image: image,
        //         channel_id: uuidv4(),
        //         channel_name: null,
        //         channel_token: null
        //     })
        // );
        // history.push("/searching-profile");
    }


    const handleCall = (image) =>{
        // var secondUserDataId = FriendUserId;
        // dispatch(
        //     audioCall({
        //         user_from_id: userData.user_id,
        //         user_to_id: secondUserDataId,
        //         user_to_image: image,
        //         channel_id: uuidv4(),
        //         channel_name: null,
        //         channel_token: null
        //     })
        // );
        // history.push("/searching-profile-call");
    }

    const createNotification = (type) => {
        return () => {
            switch (type) {
                case 'accept':
                    NotificationManager.success('Like sucessfully', 'Like');
                    break;
                case 'success':
                    NotificationManager.success('Success message', 'Title here');
                    break;
                case 'error-secure':
                    NotificationManager.error('err.message', 'Click me!', 5000, () => {
                    });
                case 'error-message':
                    NotificationManager.error('err.message', 'Click me!', 5000, () => {

                    });
                    break;
            }
        };
    };

    const onChangeInput = (e) => {
        const target = e.target;
        setSearchUser(target.value)
    }

    const submitSearchUserForm = (e) => {
        e.preventDefault();
        $('#chat').scrollTop(0);
        searchName = searchUser
        setSearchUserForm(searchUser)
    }
    useEffect(() => {
        // hit api to fetch the records...
        myFriendList = [];
        setFriendlist([])
        searchPage = 1;
        // $('#chat').scrollTop(0);
        getAllDetails(searchUserForm, 1, false)
    }, [searchUserForm])

    // useEffect(() => {
    //     // hit api to fetch the records...
    //     setFriendlist([])
    //     setSearchPage(1);
    //     const friend= await axios.post(baseUrl() + "/fake-user?page=1",bodyParameters)
    //     console.log(friend, "friend......")
    //     const data = friend.data.users.data;
    // }, [searchUserForm])

    return(

        <section className="home-wrapper">
            <img className="bg-mask" src="/assets/images/mask-bg.png" alt="Mask" />
            <div className="header-bar">
                <div className="container-fluid p-0">
                    <div className="row no-gutters align-items-center">
                        <div className="col-lg-3 p-3">
                            <div className="d-flex flex-wrap align-items-center">
                                <div className="logo-tab d-flex justify-content-between align-items-start">
                                    <a href="javascript:void(0)">
                                        <Logo/>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <div className="rcall-head text-center">
                                <h4>User chat</h4>
                            </div>
                        </div> */}
                       
                    </div>
                </div>
            </div>
            <div className="chat-box-wrapper">
                <div className="container">
                    <div className="row panel messages-panel">
                        <div className="contacts-list col-md-4">
                            <form className="search-form" onSubmit={(e) => submitSearchUserForm(e)}>
                                <input style={{width: "307px", padding: "20px"}} type="text" placeholder="Search user..." onChange={(e) => onChangeInput(e)}/>
                            </form>
                            <ul className="nav inbox-categories d-flex flex-wrap mb-3" role="tablist">
                                <li className="nav-item">
                                    <a id="tab-chat" href="javascript:void(0);" className="nav-link" data-toggle="tab" role="tab">Chat</a>
                                </li>
                            </ul>
                                <div id="chat" className="contacts-outter-wrapper tab-pane">
                                    <div className="contacts-outter">
                                        <ul className="nav contacts">

                                            { FriendList.map((item, i) => {
                                                return <li className="nav-item">
                                                    <a className="nav-link" href="javascript:void(0);" data-toggle="tab" data-id={item.user_id} role="tab" onClick={() =>  updateFriendDetails(item)}>
                                                        <div className="status-check">
                                                            <img className="img-circle medium-image" 
                                                            onError={(e) => addDefaultSrc(e)} src={!!item.profile_pic ? item.profile_pic : returnDefaultImage()} alt={item.name}
                                                            />
                                                            <span class={item.is_online ? "circle-shape-online" : "circle-shape-offline"}></span>
                                                         </div>
                                                        <div className="contacts_info">
                                                            <div className="user_detail">
                                                                <span className="message-time">{item.created_at}</span>
                                                                <h5 className="mb-0 name">{item.name}</h5>
                                                                {/* <div className="message-count">2</div> */}
                                                            </div>
                                                            <div className="vcentered info-combo">
                                                                <p>Yep, I'm new in town and I wanted</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        {/* Chat box here */}
                        {FriendUserId !== null ?
                            <div className="col-md-8 tab-content chat-block" role="tablist">
                                {
                                    !loading && CompleteMessageList.length === 0 &&
                                    <div className="nothing-to-see text-center active">
                                        <figure>
                                            <img src="/assets/images/message-circle.png" alt="Message" />
                                            <figcaption>Nothing To See</figcaption>
                                        </figure>
                                    </div>
                                }
                                <div className="tab-pane tab-pane" id="chat-field">
                                    <div className="message-top d-flex flex-wrap align-items-center justify-content-between">
                                        <div className="chat-header-info d-flex align-items-center">
                                            {!!AllData ? 
                                            <div className="status-check">
                                                <img className="img-circle medium-image" 
                                                onError={(e) => addDefaultSrc(e)} src={!!AllData.profile_pic ? AllData.profile_pic : returnDefaultImage()} alt={AllData.name}
                                                />
                                                <span class={AllData.is_online ? "circle-shape-online" : "circle-shape-offline"}></span>
                                            </div>
                                             : ""}
                                            <div className="chat-user-info ml-2">
                                                {!!AllData ? <h5 className="mb-0 name">{AllData.name}</h5> : <h5>  </h5> }
                                            </div>
                                        </div>
                                        
                                        {/* Video call */}
                                        {/* <div className="chat-call-opt d-flex">
                                        <a className="bg-grd-clr mr-3" onClick = {() => handleCall(AllData.profile_images[0])} href="javascript:void(0)">
                                                <NotificationContainer/>
                                                <i className="fas fa-phone-alt" /></a>
                                            <a className="bg-grd-clr" onClick = {() => handleVideo(AllData.profile_images[0])} href="javascript:void(0)">
                                                <NotificationContainer/>
                                                <i className="fas fa-video" />

                                            </a>
                                        </div> */}
                                    </div>

                                    {/*<div className="chat-date text-center my-2">Today</div>*/}
                                    <div className="message-chat">

                                        <div className="chat-body" id={"chat-body"}>
                                            {
                                                CompleteMessageList.map((data, i) => (
                                                    <div>
                                                        {
                                                            (data.user_from_id === FriendUserId) ?
                                                                <div className="message info">
                                                                    <div className="message-body">
                                                                        {
                                                                            !!data.media &&
                                                                            <div className="media-socket">
                                                                                <img onError={(e) => addDefaultSrc(e)} src={!!data.media ? data.media : returnDefaultImage()}/>
                                                                            </div>
                                                                        }

                                                                        {
                                                                            !!data.message &&
                                                                            <div className="message-text">
                                                                                <p>{data.message}</p>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !!data.audio &&
                                                                            <div  className="audio-socket">
                                                                                <audio controls src={data.audio} className="audio-left"/>
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="message my-message ">
                                                                    <div className="message-body">
                                                                        {
                                                                            !!data.media &&
                                                                            <div className="media-socket">
                                                                                <img onError={(e) => addDefaultSrc(e)} src={!!data.media ? data.media : returnDefaultImage()}/>
                                                                            </div>
                                                                        }

                                                                        {
                                                                            !!data.message &&
                                                                            <div className="message-text">
                                                                                <p>{data.message}</p>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !!data.audio &&
                                                                            <div>
                                                                                <audio controls src={data.audio} className="audio-right"/>
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                            <NotificationContainer/>
                                        </div>
                                        <form onSubmit={CheckTextInputIsEmptyOrNot}>

                                            <div className="chat-footer">
                                                <div className="sweet-loading">
                                                    <BarLoader color={"#fcd46f"} loading={loading} css={override} size={1000} />
                                                </div>
                                                {/* <label className="upload-file">
                                                    <div>
                                                        <input id="uploadfile" type="file" />
                                                        <i className="far fa-image" />
                                                    </div>
                                                </label> */}
                                                {/* <textarea className="send-message-text" placeholder="Message..." defaultValue={UserMessage} /> */}
                                                <input className="send-message-text" name="Message" id="Message" type="text" placeholder="Message..." value={UserMessage} onChange={e => changeInput(e)} />
                                                {/* <label className="gift-message bg-grd-clr">
                                                    <a href="javascript:void(0)" onClick={handleGift} >
                                                        <i className="fas fa-gift" />
                                                    </a>
                                                </label> */}
                                                <label className="record-message">
                                                    <a  onClick={sendVoiceNote}>
                                                        {
                                                            dummyMediaRc &&
                                                            <i className="fas fa-microphone-slash"/>
                                                        }
                                                        {
                                                            !dummyMediaRc &&
                                                            <i className="fas fa-microphone" />
                                                        }

                                                    </a>
                                                    <NotificationContainer/>
                                                </label>
                                                <button type="submit" className="send-message-button bg-grd-clr"><i className="fas fa-paper-plane" /></button>
                                                {
                                                    !!chatTyping &&
                                                    <div>{chatTyping} is typing...</div>
                                                }
                                            </div>
                                        </form>
                                    </div>

                                </div>

                            </div>
                            :<div className="nothing-to-see text-center active">
                                <figure>
                                    <img src="/assets/images/message-circle.png" alt="Message" />
                                    <figcaption>Nothing To See</figcaption>
                                </figure>
                            </div> }

                        {/* End chat box here */}
                        <div className={isOn ? 'all-gifts-wrapper active': 'all-gifts-wrapper '} >
                            <div className="all-gift-inner">
                                <a href="javascript:void(0)" className="close-gift-btn modal-close" onClick={toggleIsOn}><img src="/assets/images/btn_close.png" /></a>
                                <div className="all-gift-header d-flex flex-wrap align-items-center mb-3">
                                    <h5 className="mb-0 mr-4">Send Gift</h5>
                                    <div className="remaining-coins">
                                        <img src="/assets/images/diamond-coin.png" alt="Coins" />
                                        <span>152</span>
                                    </div>
                                </div>
                                <div className="all-gift-body">

                                    <ul className="d-flex flex-wrap text-center">
                                        {GiftData.map((items , i) => {
                                            return <li onClick={() => getGiftItem(items.id)}>
                                                <a href="javascript:void(0)" >
                                                    <div>
                                                        <figure>
                                                            <img onError={(e) => addDefaultSrc(e)} src={!!items.image ? items.image : returnDefaultImage()} alt={items.name} />
                                                        </figure>
                                                        <div className="gift-price">
                                                            <img src="/assets/images/diamond-coin.png" alt="Coins" />
                                                            <span>{items.coins}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        })}
                                        <li>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ChatBox;