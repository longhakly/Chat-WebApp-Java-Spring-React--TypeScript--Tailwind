import Logo from "../assets/logo.png";
import Profile from "../assets/profile.png";
import SendIcon from "../assets/send.png"
import { useState } from "react";
function ChatPage() {

    return (
      <>
        <div className="flex justify-center items-center w-full h-[100px] px-10 shadow-lg">
            <div className="w-[30%]">
                <img src={Logo} alt="logo" className="w-[150px] h-[70px]"/>
            </div>
            <div className="w-[40%] flex justify-start items-start relative ">
                <div className="w-[20%]">
                    <img src={Profile} className="w-[50px] absolute top-1/2 transform -translate-y-1/2 left-0"/>
                    <img src={Profile} className="w-[50px] absolute top-1/2 transform -translate-y-1/2 left-8"/>
                    <img src={Profile} className="w-[50px] absolute top-1/2 transform -translate-y-1/2 left-16"/>
                </div>

                <div className="w-[20%] flex justify-start items-center text-[#5F5F5F]">
                    12 People
                </div>
            </div>
            <div className="w-[30%] flex justify-end items-center">
                <button className="bg-red-500 text-white px-4 py-2 rounded-[10px]">End Chat</button>
            </div>
        </div>
        <div className="w-full px-[10%] block mt-10 mb-20 space-y-4 ">
            <div className="flex justify-start items-center min-h-[50px] space-x-2">
                <img src={Profile} className="w-[50px]"/>
                <div className="block relative">
                    <p className=" text-[8px] text-gray-400 mx-4 w-[200px]">Long Hakly</p>
                    <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] max-w-[40%] overflow-x-auto">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>

            </div>
            <div className="flex justify-start items-center min-h-[50px] space-x-2">
                <img src={Profile} className="w-[50px]"/>
                <div className="block relative">
                    <p className=" text-[8px] text-gray-400 mx-4 w-[200px]">Long Hakly</p>
                    <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] max-w-[40%] overflow-x-auto">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>

            </div>

            <div className="flex justify-end items-center min-h-[50px] space-x-2">
                <div className="block">
                    <div className="flex justify-end">
                        <p className="text-[8px] text-right text-gray-400 mx-4 w-[200px]">Long Hakly</p>
                    </div>
                    
                    <div className="flex justify-end">
                        <div className="bg-[#CCE0EE] min-h-[50px] flex items-center px-4 py-1 rounded-[10px] max-w-[40%] overflow-x-auto">
                            <p>
                                Lorem Ipsum is simply dummy text of the printing  Lorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printing.
                            </p>
                        </div>
                    </div>

                </div>
                <img src={Profile} className="w-[50px]"/>
            </div>
        </div>
        <div className="fixed bottom-0 w-full bg-white shadow-lg">
            <div className="w-full my-4 flex justify-center items-center space-x-2 px-[10%]">
                <div className="w-full">
                <input type="text" placeholder="Write a message..." className="bg-[#D9D9D9] w-full px-4 py-2 rounded-[10px] focus:outline-none focus:border-[2px] focus:border-[#38B6FF]"/>
                </div>
                <button className="w-[50px] flex justify-end">
                    <img src={SendIcon} className="w-[40px]"/>
                </button>  
            </div>

        </div>
      </>
    );
  }

export default ChatPage;