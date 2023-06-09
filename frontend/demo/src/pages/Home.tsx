import Logo from "../assets/logo.png";
import { useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
function HomePage() {
    const [isGenerate, setIsGenerate] = useState(false);
    const handleGenerateLink = () => {
        setIsGenerate(true);
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
                });
        }
    };
    return (
      <>
        <div className="flex items-center justify-center">
            <div className="block mt-[200px]">
                <img src={Logo} alt="logo" className="w-[600px] h-[250px]"/>
                <div className="flex items-center justify-center">
                    {isGenerate!=true?
                        (
                            <button className="bg-[#5BA5DB] text-white px-4 py-2 font-bold text-[20px] rounded-[10px]" onClick={handleGenerateLink}>Generate Link</button>
                        ):    
                        (
                            <div className="flex items-center justify-center bg-[#cbeaff] px-4 py-2 space-x-4">
                                <h3 className="font-bold">Link :</h3>
                                <p id="text-copy">http://localhost:5173/chat</p>
                                <button onClick={handleCopy}>
                                    <ContentCopyIcon/>
                                </button>
                            </div>                    
                        )
                    }
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