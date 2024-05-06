  import React from 'react'
  import './style/Message.css'
  import { useState, useEffect } from 'react'
  import axios from 'axios';
  import {jwtDecode} from 'jwt-decode'
  import { Link, useParams, useNavigate } from 'react-router-dom'
  import moment from 'moment';
  import Message from './Message';
  import SearchUsers from './SearchUser';

  function MessageDetail() {

    const baseURL = 'http://127.0.0.1:8000/'
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])
    const [user, setUser] = useState([])
    const [profile, setProfile] = useState([])
    let [newMessage, setnewMessage] = useState({message: "",});
    let [newSearch, setnewSearch] = useState({search: "",});


    // const axios = useAxios()
    const id = useParams()
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token)
    const user_id = decoded.user_id
    const username = decoded.username
    const history = useNavigate()

    useEffect(() => {
      try {
        axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
          setMessages(res.data)
        })
      } catch (error) {
        // console.log(error);
      }
    }, [])

    // Get all messages for a conversation
    useEffect(() => {
      let interval = setInterval(() => {
        try {
          axios.get(baseURL + '/get-messages/' + user_id + '/' + id.id + '/').then((res) => {
            setMessage(res.data)
            // console.log(res.data);      
          })
        } catch (error) {
          console.log(error);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    },[id]);

    useEffect(() => {
      const fetchProfile = async () => {
            try {
              // console.log("this is log for",id.id)
              await axios.get(baseURL + '/profile/' + id.id + '/').then((res) => {
                setProfile(res.data)
                // console.log("got",res.data)
                setUser(res.data)
                // console.log("hi",res.data)
              })
                
            }catch (error) {
                console.log(error);
              }}
          fetchProfile()
    },[id])

    // capture changes made by the user in those fields and update the component's state accordingly.
    const handleChange = (event) => {
      setnewMessage({
        ...newMessage,
        [event.target.name]: event.target.value,
      });
    };
  // fetchProfile;
    // Send Message
    const SendMessage = () => {
      const formdata = new FormData()
      formdata.append("user", user_id)
      formdata.append("sender", user_id)
      formdata.append("reciever", id.id)
      formdata.append("message", newMessage.message)
      formdata.append("is_read", false)

      try {
          axios.post(baseURL + '/send-messages/', formdata).then((res) => {
            document.getElementById("text-input").value = "";
            setnewMessage(newMessage = "")
          })
      } catch (error) {
          console.log("error ===", error);
      }

    }


    useEffect(() => {
      // Check if the current user is the receiver of any message
      const isReceiver = message.some(msg => msg.reciever.id === user_id);
    
      // If the current user is the receiver, mark messages as read
      if (isReceiver) {
        markMessagesAsRead(id.id);
        console.log("Messages marked as read");
      }
    
      // console.log("Messages:", message);
    }, [message, user_id, id]);
    
    // console.log(id.id);
    // console.log(id);
    
    // Update markMessagesAsRead function to accept chat detail ID as parameter
    const markMessagesAsRead = async (chatDetailId) => {
      try {
        // Extract message IDs to mark as read
        const receiverMessages = message.filter(msg => msg.reciever.id === user_id);

        // Extract message IDs to mark as read
        const messageIds = receiverMessages.map(msg => msg.id);
        console.log(receiverMessages)
        console.log("Messages to mark as read:", messageIds);
        // Send request to backend to mark messages as read
        await axios.put(`${baseURL}/mark-messages-as-read/`, { messageIds, chatDetailId });
    
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    const handleSearchChange = (event) => {
      setnewSearch({
        ...newSearch,
        [event.target.name]: event.target.value,
      });

    };


    // console.log(newSearch.username);

    const SearchUser = () => {
      axios.get(baseURL + '/search/' + newSearch.username + '/')
          .then((res) => {
              if (res.status === 404) {
                  // console.log(res.data.detail);
                  alert("User does not exist");
              } else {
                  history('/search/'+newSearch.username+'/');
              }
          })
          .catch((error) => {
              alert("User Does Not Exist")
          });
  };


  return (
    <div>
      {/* <SearchUsers /> */}
      <div className="flex-grow-1 d-flex align-items-center mt-2">
                        <input
                          type="text"
                          className="form-control my-3"
                          placeholder="Search..."
                          onChange={handleSearchChange}
                          name='username'

                        />
                        <button className='ml-2' onClick={SearchUser} style={{border:"none", borderRadius:"50%"}}><i className='fas fa-search'></i></button>
                      </div>
      <main className="content" style={{ marginTop: "30px" }}>
        <div className="container-list">
      {/* <Message /> */}
          <div className="container-chats">
            <div className="chat-container">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
                {/* Search input */}
                <hr/>
              </div>
              <div className="col-12 col-lg-7 col-xl-9">
                <div className="chat-header">
                  <div className="profile-info">
                    {/* Profile image */}
                    <div className="profile-image">
                    <img src={user.profile_picture} />


                    </div>
                    <div className="profile-details">
                      {/* <strong>{profile}</strong> */}
                      <div className="username">@{user.first_name} {user.last_name}</div>

                    </div>
                  </div>
                </div>
                <div className="chat-messages">
                  {message.map((message, index) => 
                    <div className={message.sender.id !== user_id ? "message-left" : "message-right"} key={index}>
                      <div className="message-content">
                        {message.sender.id !== user_id &&
                          <div className="message-sender">{message.sender.first_name}</div>
                        }
                        <div className="message-text">{message.message}</div>
                        <div className="message-time">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message"
                    value={newMessage.message} 
                    name="message" 
                    id='text-input'
                    onChange={handleChange}
                  />
                  <button onClick={SendMessage} className="btn btn-primary">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
  }
  export default MessageDetail