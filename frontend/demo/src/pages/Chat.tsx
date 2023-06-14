import Logo from "../assets/logo.png";
import SendIcon from "../assets/send.png";
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { getAndUpdateGroupMemberAPI } from "../axios/getAndUpdateGroup";
import sockjs from "sockjs-client/dist/sockjs"
import Stomp from 'stompjs';
import { createChatAPI } from "../axios/createChat";
import { getGroupChatByIdAPI } from "../axios/getGroupChatById";
import { deleteGroupChatByIdAPI } from "../axios/deleteGroupChatById";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

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


  // Fetch GroupChat Data  
  const [userId, setUserId] = useState(getCookieValue('UserId'));
  const { groupId } = useParams();
  const [Group, setGroup] = useState<{ userCount: number; name:String, chats: Chat[]; groupChats: GroupChat[] } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (userId === null){
        setUserId("Not Found");
      }
      try {
        console.log("called1")
        if (groupId && userId) {
          const getGroupChatAPIResponse = await getGroupChatByIdAPI(groupId);
          if (getGroupChatAPIResponse) {
            console.log("called2")
            const isUserInGroup = getGroupChatAPIResponse.data.groupChats.some((user: GroupChat) => user.id === userId);
            console.log(userId)
            console.log("isUserInGroup", isUserInGroup)
            if (isUserInGroup){
              console.log("called3")
              const sortedChats = getGroupChatAPIResponse.data.chats.sort((a: Chat, b: Chat) => {
                const [yearA, monthA, dayA, hourA, minuteA, secondA] = a.timestamp;
                const [yearB, monthB, dayB, hourB, minuteB, secondB] = b.timestamp;
                if (yearA !== yearB) {return yearA - yearB;}
                if (monthA !== monthB) {return monthA - monthB;}
                if (dayA !== dayB) {return dayA - dayB;}
                if (hourA !== hourB) {return hourA - hourB;}
                if (minuteA !== minuteB) {return minuteA - minuteB;}
                return secondA - secondB;
              });
              const sortedGroupChats = getGroupChatAPIResponse.data.groupChats.sort((a: GroupChat, b: GroupChat) => {
                const [yearA, monthA, dayA, hourA, minuteA, secondA] = a.timestamp;
                const [yearB, monthB, dayB, hourB, minuteB, secondB] = b.timestamp;
                if (yearA !== yearB) {return yearA - yearB;}
                if (monthA !== monthB) {return monthA - monthB;}
                if (dayA !== dayB) {return dayA - dayB;}
                if (hourA !== hourB) {return hourA - hourB;}
                if (minuteA !== minuteB) {return minuteA - minuteB;}
                return secondA - secondB;
              });
              const updatedGroup = {
                ...getGroupChatAPIResponse.data,
                chats: sortedChats,
                groupChats: sortedGroupChats,
              };
              setGroup(updatedGroup);
              console.log("updatedGroup", updatedGroup);
            } else {
              try {
                console.log("called4")
                const UpdateGroupMemberAPIResponse = await getAndUpdateGroupMemberAPI(groupId, userId);
                if (UpdateGroupMemberAPIResponse && UpdateGroupMemberAPIResponse.data.user){
                  console.log("UpdateGroupMemberAPIResponse", UpdateGroupMemberAPIResponse.data)
                  setUserId(UpdateGroupMemberAPIResponse.data.user.id);
                  document.cookie = `UserId=${UpdateGroupMemberAPIResponse.data.user.id}; path=/; SameSite=None; Secure;`;
                  console.log("success");
                }
              } catch (error){
                console.error('Error fetching data:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  // Socket
  const [messages, setMessages] = useState<Chat[]>([]);
  let stompClient: Stomp.Client | null = null;
  const connect = () => {
    const socket: any = new sockjs('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame: Stomp.Frame | undefined) => {
      console.log('Connected: ' + frame);
      stompClient?.subscribe('/topic/group/' + groupId, (message: Stomp.Message) => {
        const chatMessage: Chat = JSON.parse(message.body || '');
        showChatMessage(chatMessage.sender.id, chatMessage.message, chatMessage.sender.username, chatMessage.sender.profileImage);
      });
    });
  };
  const showChatMessage = (id:string ,message: string, username: string, profileImage:string) => {
    setMessages(prevMessages =>
      prevMessages.concat({
        id, 
        message,
        sender: {id, username, profileImage},
        timestamp: [0, 0, 0, 0, 0, 0, 0],
      })
    );
  };
  const disconnect = () => {
    if (stompClient !== null && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  };
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const messageInput = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message_Input = messageInput.current?.value?? "";
    if (message_Input.trim() !== '' && userId && groupId) {
      try {
        const createChatResponse = await createChatAPI(groupId, userId, message_Input);
        if(createChatResponse){
          console.log("createChatResponse",createChatResponse.data);
          messageInput.current!.value = "";
        }
        else{
          console.log("Error fetching data");
        }
      } catch (error) {
        console.log('Error fetching data', error);
      }
    }
  };

  // Scroll to bottom
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatContainerRef.current]);

  // Handle Enter key press submit
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleEndChat = async () => {
    try{
      if (groupId){
        const endGroupChatAPIResponse = await deleteGroupChatByIdAPI(groupId);
        if (endGroupChatAPIResponse){
          console.log("endGroupChatAPIResponse", endGroupChatAPIResponse.data);
          history.push("/");
          location.reload();
        }
      }
    }catch (error){
      console.error('Error fetching data:', error);
    }
  }
  return (
    <>
      <div className="flex justify-center items-center w-full h-[100px] px-10 shadow-lg">
        <div className="w-[30%]">
          <img src={Logo} alt="logo" className="w-[150px] h-[70px]" />
        </div>
        <div className="w-[40%] flex justify-center items-start relative ">
            <div className="block">
              <div className="text-[20px] font-bold text-center">{Group?.name}</div>
              <p className="text-[10px] font-500 text-[#5F5F5F] text-center">{Group?.userCount} People</p>
            </div>
        </div>
        <div className="w-[30%] flex justify-end items-center">
          <button 
          onClick={handleEndChat}
          className="bg-red-500 text-white px-5 py-1 rounded-[10px] text-[12px] font-bold">End Chat</button>
        </div>
      </div>
      <div className="w-full px-[10%] block mt-0 pt-10 mb-0 pb-10 space-y-4 overflow-y-scroll h-[720px] scroll-auto" ref={chatContainerRef}>
        {Group?.chats &&
          Group?.chats
            .map((item, index) =>
              item.sender.id === userId ? (
                <div className="flex justify-end items-center min-h-[50px] space-x-2" key={index}>
                  <div className="block max-w-[50%]">
                    <div className="flex justify-end">
                      <p className="text-[9px] text-gray-400 mx-4 min-w-auto w-auto inline-block max-[100%]">{item.sender.username}</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] min-w-auto max-w-[100%]">
                        <p className="w-auto inline-block overflow-wrap break-word">{item.message}</p>
                      </div>
                    </div>
                  </div>
                  <img src={item.sender.profileImage} className="w-[45px]" />
                </div>
              ) : (
              <div className="flex justify-start items-center min-h-[50px] space-x-2 " key={index}>
                <img src={item.sender.profileImage} className="w-[45px]" />
                <div className="block relative max-w-[50%]">
                  <p className="text-[9px] text-gray-400 mx-4 min-w-auto w-auto inline-block max-[100%]">{item.sender.username}</p>
                  <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] min-w-auto max-w-[100%]">
                    <p className="w-auto inline-block overflow-wrap break-word">{item.message}</p>
                  </div>
                </div>
              </div>

              )
            )}
            {messages.map((item, index) =>
              item.sender.id === userId ? (
                <div className="flex justify-end items-center min-h-[50px] space-x-2" key={index}>
                  <div className="block max-w-[50%]">
                    <div className="flex justify-end">
                      <p className="text-[8px] text-gray-400 mx-4 min-w-auto w-auto inline-block max-[100%]">{item.sender.username}</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] min-w-auto max-w-[100%]">
                        <p className="w-auto inline-block overflow-wrap break-word">{item.message}</p>
                      </div>
                    </div>
                  </div>
                  <img src={item.sender.profileImage} className="w-[40px]" />
                </div>
              ) : (
                <div className="flex justify-start items-center min-h-[50px] space-x-2" key={index}>
                <img src={item.sender.profileImage} className="w-[40px]" />
                <div className="block relative max-w-[50%]">
                  <p className="text-[8px] text-gray-400 mx-4 min-w-auto w-auto inline-block max-[100%]">{item.sender.username}</p>
                  <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] min-w-auto max-w-[100%]">
                    <p className="w-auto inline-block overflow-wrap break-word">{item.message}</p>
                  </div>
                </div>
              </div>
              )
            )}
      </div>
      {/* <div className="w-full px-[10%] block mt-10 mb-20 space-y-4 ">
        
      </div> */}
      <div className="fixed bottom-0 w-full bg-white shadow-lg">
        <div className="w-full my-4 flex justify-center items-center space-x-2 px-[10%]">
          <div className="w-full">
            <input
              ref={messageInput}
              onKeyPress={handleKeyPress}
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
