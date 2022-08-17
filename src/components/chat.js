import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Chat({clientId,chatWindow}) {
  const [client, setClient] = useState('loading');
  const [number, setNumber] = useState(0);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const messageEl = useRef(null);
  const [openChat, setOpenChat] = useState(chatWindow)


  let navigate = useNavigate();

  useEffect(() => {
    setOpenChat(chatWindow)
    if (client === 'loading') { getCLient() }
    if (!client) { navigate('/')}
    if (client) {
      if (typeof openChat === 'string') {
        setNumber(chatWindow)
        const chatId = `${chatWindow}@c.us`
        console.log('sup',chatId)
        getMessages(chatId)
      }
      getChats();
      if (messageEl) {
        messageEl.current.addEventListener("DOMNodeInserted", (event) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight });
        });
      }
    }    
  }, [client]);

  const getCLient = async () => {
    const client = await axios.get(`http://localhost:8000/api/getClient?client=${clientId}`);
    return setClient(client.data);
  };

  const postMessage = async (e) => {
    e.preventDefault();
    setMessage("");
    setTimeout(() => {
      getMessages(`${number}@c.us`);
    }, 1200);
    const send = await axios.get(`http://localhost:8000/api/sendmessage?client=${clientId}&number=${number}&message=${message}`);
    return send.data;
  };

  const getChats = async () => {
    const chats = await axios.get(`http://localhost:8000/api/getChats?client=${clientId}`);
    return setChats(chats.data);
  };

  const getMessages = async (chatId) => {
    console.log(chatId)
    const messages = await axios.get(`http://localhost:8000/api/getmessages?client=${clientId}&chatId=${chatId}`);
    return setChatHistory(messages.data);
  };

  return (
    <div
    className="flex self-end"
    >
      <div className="flex flex-col space-y-4 px-8 pb-8 pt-2 bg-gray-100 rounded-lg border h-screen">
        <div className="flex items-center justify-between border-b py-4">
          <div className="font-bold text-2xl">Chats</div>
          <div className="flex space-x-2">
            <div className="cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <div className="cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <div className="cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex">

         { !chatWindow && <div className="flex flex-col space-y-4">
            <button
              onClick={() => getChats()}
              className="mx-6 border-2 rounded-lg border-blue-300"
            >
              Update
            </button>
            <div className="flex flex-col space-y-1 mr-6 overflow-y-auto h-96">
              {chats.length > 0 &&
                chats.map((chat) => {
                  return (
                    <div
                      onClick={() => {
                        setCurrentChat(chat.id._serialized);
                        setNumber(chat.id.user);
                        getMessages(chat.id._serialized);
                      }}
                      className={`${
                        currentChat === chat.id._serialized && "bg-green-100"
                      } cursor-pointer hover:bg-green-50 border rounded-lg px-2 py-1`}
                    >
                      {chat.name}
                    </div>
                  );
                })}
            </div>
          </div>}

          <div className="flex flex-col space-y-2">
            <div
              ref={messageEl}
              className="flex flex-col space-y-2 overflow-y-auto w-96 h-[76vh] border rounded-lg p-4 bg-gray-50"
            >
              {chatHistory.length > 0 &&
                chatHistory.map((msg) => {
                  const timestamp = Date.now();
                  const date = new Intl.DateTimeFormat("ru-RU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(timestamp);
                  if (msg.fromMe === true) {
                    return (
                      <div className="bg-gray-100 text-sm self-end px-3 py-2 border rounded-lg ">
                        {msg.body}
                        <p className="mt-1 text-xs text-gray-400 text-end">
                          {date}
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-white text-sm self-start px-3 py-2 border rounded-lg">
                        {msg.body}
                        <p className="mt-1 text-xs text-gray-400 text-end">
                          {date}
                        </p>
                      </div>
                    );
                  }
                })}
            </div>
            <form
              onSubmit={(e) => postMessage(e)}
              className="flex space-x-2 items-center"
            >
              <input
                placeholder="Type some message here..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="px-2 py-1 w-full h-8 border-2 border-green-200 rounded-lg"
                type="text"
              />
              <button
                type="sumbit"
                className="px-2 py-1 bg-green-300 hover:bg-green-200 rounded-lg border-2 border-white"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
