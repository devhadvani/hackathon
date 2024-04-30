import React from 'react'
import './style/Message.css'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom/'
import moment from 'moment';

function Message() {

  const baseURL = 'http://127.0.0.1:8000/'
  // Create New State
  const [messages, setMessages] = useState([])
  let [newSearch, setnewSearch] = useState({search: "",});
  const [unreadCounts, setUnreadCounts] = useState({});;


  // Initialize the useAxios Function to post and get data from protected routes

  // Get and Decode Token
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token)
  // Get Userdata from decoded token
  const user_id = decoded.user_id
  const username = decoded.email
//   console.log(user_id);
//   const history = useHistory()

useEffect(() => {
    const fetchMessages =  () => {
        let interval = setInterval(async() => {
      try {
        const response = await axios.get(`${baseURL}/my-messages/${user_id}/`);
        setMessages(response.data);
  
        // Fetch unread message counts
        const unreadResponse = await axios.get(`${baseURL}/unread-message-counts/${user_id}/`);
        setUnreadCounts(unreadResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }, 1000);
    return () => {
      clearInterval(interval);
    };
    };
  console.log("work")
    fetchMessages();
}, []);
  
 
  const handleSearchChange = (event) => {
    setnewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });

  };

  const SearchUser = () => {
   const response =axios.get(baseURL + '/search/' + newSearch.username + '/')
        .then((res) => {
            if (res.status === 404) {
                // console.log(res.data.detail);
                alert("User does not exist");
            } else {
                // history.push('/search/'+newSearch.username+'/');
                // console.log("got it the user",res.data)
            }
        })
        .catch((error) => {
            console.log("User Does Not Exist",response.data)
            console.log("User Does Not Exist",error)
        });
};  
 const calculateUnreadCount = (message) => {
    const chatId = message.sender.id === user_id ? message.reciever.id : message.sender.id;
    return unreadCounts[chatId] || 0;
  };

console.log(messages);
return (
    <div className="container-chat">
      <div className="chat-list-container">
        {messages.map((message) => (
          <Link
            key={message.id}
            to={`/inbox/${message.sender.id === user_id ? message.reciever.id : message.sender.id}/`}
            className="chat-item"
          >
            <img
              src={message.sender.id === user_id ? message.reciever.profile_picture : message.sender.profile_picture}
              className="profile-image"
              alt="Profile"
            />
            <div className="chat-content">
              <div className="sender-name">
                {message.sender.id === user_id ? message.reciever.first_name : message.sender.first_name}
              </div>
              <div className="last-message">{message.message}</div>
              <div className="unread-count">{calculateUnreadCount(message)}</div>
            </div>
            <div className="time">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Message;