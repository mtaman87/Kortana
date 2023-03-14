import React, { useState, useEffect } from "react";
import bot from "../../public/assets/k-logo-white.png";
import user from "../../public/assets/user.svg";
import Typing from "react-typing-animation";
import "../index.css";

function ChatContainer() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  // Define a function to handle user input
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Define a function to handle user submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let chatLogNew = [...chatLog, { isAi: false, value: `${input}` }];
    // Set the user's prompt
    setChatLog([...chatLog, { isAi: false, value: `${input}` }]);

    // Clear the user input
    setInput("");

    const messages = chatLogNew.map((msg) => msg.value).join("\n");

    try {
      // Send the user's prompt to the server and get the bot's response
      const response = await fetch("https://kortana-server.herokuapp.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: messages,
        }),
      });

      const data = await response.json();
      console.log(data);
      const value = data.data;
      setChatLog([...chatLogNew, { isAi: true, value: value }]);
    } catch (err) {
      console.log(err);
    }
  };

  const chatStripe = (isAi, value, index) => {
    return (
      <div key={index} className={`wrapper ${isAi ? "ai" : "user"}`}>
        <div className="chat">
          <div>
            <div className="profile">
              <img
                src={`${isAi ? bot : user} `}
                alt={`"${isAi ? "bot" : "user"}"`}
              />
            </div>
          </div>
          <div>
            {isAi ? (
              <Typing
                className="text-lg text-white"
                cursorClassName="text-teal-400"
                speed={0.05}
                hideCursorOnFinish={true}
              >
                {[value]}
              </Typing>
            ) : (
              <div className="text-lg text-white">{value}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const promptBox = () => {
    return (
      <div className="w-full">
        <form className="bg-slate-800 flex p-4 w-full justify-center ">
          <input
            name="prompt"
            type="text"
            placeholder="Ask Kortana..."
            value={input}
            onChange={handleInputChange}
            className=" w-full h-[50px] text-[18px] p-[10px] xl:ml-[30px] xl:w-[65%] rounded-[5px] text-white placeholder:text-gray-400 bg-slate-700 border-none outline-none resize-none"
          />
          <button className="bg-transparent" onClick={handleSubmit}>
            <img className="w-[30px]" src="assets/send.svg" alt="send" />
          </button>
        </form>
      </div>
    );
  };

  return (
    <div
      id="chat_container"
      className="flex-1 flex-col overflow-y-scroll scroll-smooth z-0 "
    >
      <div className="chatBox">
        <div className="flex flex-col overflow-y-scroll w-full p-4">
          <div>
            {chatLog.map((msg, index) =>
              chatStripe(msg.isAi, msg.value, index)
            )}
          </div>
        </div>
        {promptBox()}
      </div>
    </div>
  );
}
export default ChatContainer;
