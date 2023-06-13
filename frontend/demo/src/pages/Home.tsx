import Logo from "../assets/logo.png";
import { useState, useRef } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createGroupChatAPI } from "../axios/createGroupChat";
type Group = {
    id: string;
    name: string;
    hostId: string;
    // Add other properties if necessary
  };
  
function HomePage() {
    const [isGenerate, setIsGenerate] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [group, setGroup] = useState<Group | null>(null);

    const handleGenerateLink = async () => {
        const groupName = inputRef.current?.value?? "";
        if(groupName === "") {
            setErrorMessage("Please enter a group name");
          return false;  
        }
        try {
            console.log(groupName);
            const createGroupChatAPIresponse = await createGroupChatAPI(groupName); // Pass the groupName as an argument to the API function
            if (createGroupChatAPIresponse) {
                console.log(createGroupChatAPIresponse.data);
                setIsGenerate(true);
                setGroup(createGroupChatAPIresponse.data as Group);
                const last_index = createGroupChatAPIresponse.data.groupChats.length - 1;
                document.cookie = `UserId=${createGroupChatAPIresponse.data.groupChats[last_index].id}; path=/; SameSite=None; Secure;`;
            } else {
              console.log('Error fetching data');
            }
          } catch (error) {
            console.log('Error fetching data', error);
          }
    };

    const [errorMessage, setErrorMessage] = useState("");
    const handleCopy = () => {
        const textToCopy = document.getElementById("text-copy");
        const text = textToCopy?.textContent;
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setErrorMessage('Text copied to clipboard');
                })
                .catch((error) => {
                    setErrorMessage('Failed to copy text');
                    console.log('Error fetching data', error);
                });
        }
    };
    console.log("here",group)
    return (
      <>
        <div className="flex items-center justify-center">
            <div className="block mt-[200px]">
                <img src={Logo} alt="logo" className="w-[600px] h-[250px]"/>
                <div className="flex items-center justify-center">
                    {isGenerate != true ? (
                        <div className="space-x-2">
                            <input  
                                ref={inputRef} // Assign the ref to the input field
                                type="text" 
                                className="border-2 focus:outline-none border-[#5BA5DB] rounded-[10px] px-4 py-2 font-bold text-[20px]"
                                placeholder="Group name"
                            />
                            <button 
                                className="bg-[#5BA5DB] text-white px-4 py-2 font-bold text-[20px] rounded-[10px]" 
                                onClick={handleGenerateLink}
                            >
                                Generate Link
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-[#cbeaff] px-4 py-2 space-x-4">
                            <h3 className="font-bold">Link :</h3>
                            <p id="text-copy">http://localhost:5173/groups/{group?.id.toString()}</p>
                            <button onClick={handleCopy}>
                                <ContentCopyIcon/>
                            </button>
                        </div>                    
                    )}
                </div>
                <div className="flex items-center justify-center mt-5">
                    {errorMessage.length > 0 && <p className="text-green-600">{errorMessage}</p> }
                </div>
            </div>

        </div>
      </>
    );
}

export default HomePage;
