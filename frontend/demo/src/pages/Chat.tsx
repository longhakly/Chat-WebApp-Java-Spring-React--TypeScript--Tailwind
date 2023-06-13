import Logo from "../assets/logo.png";
import Profile from "../assets/profile.png";
import SendIcon from "../assets/send.png";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getAndUpdateGroupMemberAPI } from "../axios/getAndUpdateGroup";
import sockjs from "sockjs-client/dist/sockjs"
import Stomp from 'stompjs';
type Chat = {
  id: string;
  message: string;
  sender: {
    id: string;
    username: string;
    profileImage: string;
  };
  timestamp: [number, number, number, number, number, number, number];
};


interface GroupChat {
  username: string;
  anonymous: boolean;
  timestamp: number[];
  profileImage: string;
  id: string;
}

function ChatPage() {

  // Get UserId from Cookie
  function getCookieValue(cookieName: string) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  }
  const [userId, setUserId] = useState(getCookieValue('UserId'));
  console.log("userId", userId);

  // Fetch GroupChat Data
  const { groupId } = useParams();
  console.log("param", groupId);
  const [Group, setGroup] = useState<{ userCount: number; chats: Chat[]; groupChats: GroupChat[] } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (userId === null){
        setUserId(" ");
        console.log("1",userId);
      }
      try {
        if (groupId && userId) {
          console.log("2",userId);
          const getAndUpdateGroupMemberAPIResponse = await getAndUpdateGroupMemberAPI(groupId, userId);
          if (getAndUpdateGroupMemberAPIResponse) {
            console.log("getAndUpdateGroupMemberAPIResponse", getAndUpdateGroupMemberAPIResponse.data);
            const sortedChats = getAndUpdateGroupMemberAPIResponse.data.chats.sort((a: Chat, b: Chat) => {
              // Extract timestamp components
              const [yearA, monthA, dayA, hourA, minuteA, secondA] = a.timestamp;
              const [yearB, monthB, dayB, hourB, minuteB, secondB] = b.timestamp;
  
              // Compare timestamp components
              if (yearA !== yearB) {
                return yearA - yearB;
              }
              if (monthA !== monthB) {
                return monthA - monthB;
              }
              if (dayA !== dayB) {
                return dayA - dayB;
              }
              if (hourA !== hourB) {
                return hourA - hourB;
              }
              if (minuteA !== minuteB) {
                return minuteA - minuteB;
              }
              return secondA - secondB;
            });
            const sortedGroupChats = getAndUpdateGroupMemberAPIResponse.data.groupChats.sort((a: GroupChat, b: GroupChat) => {
              const [yearA, monthA, dayA, hourA, minuteA, secondA] = a.timestamp;
              const [yearB, monthB, dayB, hourB, minuteB, secondB] = b.timestamp;
              if (yearA !== yearB) {
                return yearA - yearB;
              }
              if (monthA !== monthB) {
                return monthA - monthB;
              }
              if (dayA !== dayB) {
                return dayA - dayB;
              }
              if (hourA !== hourB) {
                return hourA - hourB;
              }
              if (minuteA !== minuteB) {
                return minuteA - minuteB;
              }
              return secondA - secondB;
            });
            const updatedGroup = {
              ...getAndUpdateGroupMemberAPIResponse.data,
              chats: sortedChats,
              groupChats: sortedGroupChats,
            };
            setGroup(updatedGroup);
            const last_index = updatedGroup.groupChats.length - 1;
            document.cookie = `UserId=${updatedGroup.groupChats[last_index].id}; path=/; SameSite=None; Secure;`;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [groupId]);

  const [messages, setMessages] = useState<Chat[]>([]);
  const [messageInput, setMessageInput] = useState('');

  let stompClient: Stomp.Client | null = null;

  const connect = () => {
    const socket: any = new sockjs('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame: Stomp.Frame | undefined) => {
      console.log('Connected: ' + frame);
      stompClient?.subscribe('/topic/group/' + groupId, (message: Stomp.Message) => {
        const chatMessage: Chat = JSON.parse(message.body || '');
        showChatMessage(chatMessage.sender.id, chatMessage.message, chatMessage.sender.username);
      });
    });
  };

  const disconnect = () => {
    if (stompClient !== null && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  };

  const sendChatMessage = (message: string) => {
    const payload = {
      groupId: groupId,
      message: message,
      userId: userId,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    };

    fetch('/chats', requestOptions)
      .then(response => response.json())
      .then(data => {
        // Handle the response data as needed
        console.log(data); // Example: Logging the data to the console
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error); // Example: Logging the error to the console
      });
  };

  const showChatMessage = (id:string ,message: string, username: string) => {
    setMessages(prevMessages =>
      prevMessages.concat({
        id, // replace with an appropriate ID for the chat message
        message,
        sender: {id, username, profileImage: 'some-profile-image-url' }, // replace with the profile image URL
        timestamp: [0, 0, 0, 0, 0, 0, 0],
      })
    );
  };
  

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);
  console.log("messages",messages);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      sendChatMessage(messageInput);
      setMessageInput('');
    }
  };
  return (
    <>
      <div className="flex justify-center items-center w-full h-[100px] px-10 shadow-lg">
        <div className="w-[30%]">
          <img src={Logo} alt="logo" className="w-[150px] h-[70px]" />
        </div>
        <div className="w-[40%] flex justify-start items-start relative ">
          <div className="w-[20%]">
            <img src={Profile} className="w-[50px] absolute top-1/2 transform -translate-y-1/2 left-0" />
            <img src={Profile} className="w-[50px] absolute top-1/2 transform -translate-y-1/2 left-8" />
            <img src={Profile} className="w-[50px] absolute top-1/2 transform -translate-y-1/2 left-16" />
          </div>

          <div className="w-[20%] flex justify-start items-center text-[#5F5F5F]">
            {Group?.userCount} People
          </div>
        </div>
        <div className="w-[30%] flex justify-end items-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded-[10px]">End Chat</button>
        </div>
      </div>
      <div className="w-full px-[10%] block mt-10 mb-20 space-y-4 ">
        {Group?.chats &&
          Group?.chats
            .map((item, index) =>
              item.sender.id === userId ? (
                <div className="flex justify-end items-center min-h-[50px] space-x-2" key={index}>
                  <div className="block">
                    <div className="flex justify-end">
                      <p className="text-[8px] text-right text-gray-400 mx-4 w-[200px]">{item.sender.username}</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] max-w-[40%] overflow-x-auto">
                        <p>{item.message}</p>
                      </div>
                    </div>
                  </div>
                  <img src={item.sender.profileImage} className="w-[40px]" />
                </div>
              ) : (
                <div className="flex justify-start items-center min-h-[50px] space-x-2" key={index}>
                  <img src={item.sender.profileImage} className="w-[40px]" />
                  <div className="block relative">
                    <p className="text-[8px] text-gray-400 mx-4 w-[200px]">{item.sender.username}</p>
                    <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] max-w-[40%] overflow-x-auto">
                      <p>{item.message}</p>
                    </div>
                  </div>
                </div>
              )
            )}
      </div>
      <div className="fixed bottom-0 w-full bg-white shadow-lg">
        <div className="w-full my-4 flex justify-center items-center space-x-2 px-[10%]">
          <div className="w-full">
            <input
              type="text"
              placeholder="Write a message..."
              className="bg-[#D9D9D9] w-full px-4 py-2 rounded-[10px] focus:outline-none focus:border-[2px] focus:border-[#38B6FF]"
            />
          </div>
          <button 
          onClick={handleSubmit}
          className="w-[50px] flex justify-end">
            <img src={SendIcon} className="w-[40px]" />
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
