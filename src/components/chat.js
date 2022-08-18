import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import updateIcon from '../images/update-icon.svg';
import logOutIcon from '../images/logout-svgrepo-com.svg';
import returnBackIcon from '../images/return-back.svg';
import FileUploader from './FileUploader';

const BASE_URL = 'http://localhost:8000/api/';

export function Chat({ clientId, chatWindow }) {
  const [client, setClient] = useState('loading');
  const [number, setNumber] = useState(0);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const messageEl = useRef(null);
  const [openChat, setOpenChat] = useState(chatWindow);
  const [contactList, setContactList] = useState(true);

  let navigate = useNavigate();
  console.log(clientId);
  console.log(chatWindow);

  useEffect(() => {
    // console.log(chatWindow);
    if (!chatWindow) {
      getChats();
    }
    setOpenChat(chatWindow);
    if (client === 'loading') {
      getCLient();
    }

    if (client) {
      if (typeof openChat === 'string') {
        setNumber(chatWindow);
        const chatId = `${chatWindow}@c.us`;
        console.log('sup', chatId);
        getMessages(chatId);
      }
      getChats();
      // if (messageEl) {
      //   messageEl.current.addEventListener('DOMNodeInserted', event => {
      //     const { currentTarget: target } = event;
      //     target.scroll({ top: target.scrollHeight });
      //   });
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWindow, client, openChat]);

  const getCLient = async () => {
    const client = await axios.get(`${BASE_URL}getClient?client=${clientId}`);
    console.log(client);
    return setClient(client.data);
  };

  const postMessage = async e => {
    e.preventDefault();
    setMessage('');
    setTimeout(() => {
      getMessages(`${number}@c.us`);
    }, 1200);
    const send = await axios.get(
      `${BASE_URL}sendmessage?client=${clientId}&number=${number}&message=${message}`
    );
    return send.data;
  };

  const getChats = async () => {
    const chats = await axios.get(`${BASE_URL}getChats?client=${clientId}`);
    console.log(chatWindow);
    if (chats.data.err === 'server error') {
      logOut();
    }
    // console.log(chats.data.err);
    return setChats(chats.data);
  };

  const getMessages = async chatId => {
    // console.log(chatId);
    const messages = await axios.get(`${BASE_URL}getmessages?client=${clientId}&chatId=${chatId}`);
    return setChatHistory(messages.data);
  };

  const handleFile = async file => {
    const send = await axios.get(
      `${BASE_URL}sendmessage?client=${clientId}&number=${number}&message=${file}`
    );
    console.log('handleFile', send.data);
    return send.data;
  };
  const logOut = async () => {
    // setShow(false);
    // setClientInfo(false);
    await axios.get(`${BASE_URL}logout?client=${clientId}`);
    localStorage.removeItem('clientInfo');
    navigate('/');
  };

  const onReturnBtn = () => {
    setContactList(true);
    setClient('loading');
  };
  return (
    <div className='flex py-[30px]'>
      <div className='flex flex-col space-y-4 px-8 pb-8 pt-2 h-[auto] bg-gray-100 rounded-lg border h-screen'>
        <div className='flex items-center justify-between border-b py-4 w-60'>
          <p className='font-bold text-2xl'>Chats</p>
          <div className='flex space-x-2'>
            <button
              onClick={() => getChats()}
              className='cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border'>
              <img src={updateIcon} alt='update icon' className='w-6 ' />
            </button>
            <button
              onClick={() => logOut()}
              className='cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border'>
              <img src={logOutIcon} alt='log out icon' className='w-6 ' />
            </button>
            {/* <div className='cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border'>
              {svg1}
            </div>
            <div className='cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border'>
              {svg2}
            </div>
            <div className='cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border'>
              {svg3}
            </div> */}
          </div>
        </div>
        <div className='flex'>
          {!chatWindow && contactList && (
            <div className='flex flex-col space-y-4'>
              <div className='flex flex-col space-y-1 mr-6 overflow-y-auto h-[65vh]'>
                {chats.length > 0 && (
                  <ul>
                    {chats.map(chat => (
                      <li
                        key={chat?.id?.user}
                        onClick={() => {
                          console.log(chat);
                          setCurrentChat(chat.id._serialized);
                          setNumber(chat.id.user);
                          getMessages(chat.id._serialized);
                          setContactList(false);
                        }}
                        className={`${
                          currentChat === chat.id._serialized && 'bg-green-300'
                        } cursor-pointer hover:bg-green-50 border rounded-lg px-2 py-1 my-3`}>
                        {chat.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {!contactList && (
          <div className='flex items-center justify-between border-b py-4'>
            <div className='flex flex-col space-y-2'>
              <button
                onClick={onReturnBtn}
                className='cursor-pointer hover:bg-gray-50 flex justify-center items-center w-10 h-10 bg-white rounded-lg border'>
                <img src={returnBackIcon} alt='log out icon' className='w-6 ' />
              </button>
              <div
                ref={messageEl}
                className='flex flex-col space-y-2 overflow-y-auto w-96 h-[65vh] border rounded-lg p-4 bg-gray-50'>
                {chatHistory.length > 0 &&
                  chatHistory.map(msg => {
                    const timestamp = Date.now();
                    const date = new Intl.DateTimeFormat('ru-RU', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(timestamp);
                    if (msg.fromMe === true) {
                      return (
                        <div className='bg-gray-100 text-sm self-end px-3 py-2 border rounded-lg '>
                          {msg.body}
                          <p className='mt-1 text-xs text-gray-400 text-end'>{date}</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className='bg-white text-sm self-start px-3 py-2 border rounded-lg'>
                          {msg.body}
                          <p className='mt-1 text-xs text-gray-400 text-end'>{date}</p>
                        </div>
                      );
                    }
                  })}
              </div>
              <form onSubmit={e => postMessage(e)} className='flex relative space-x-2 items-center'>
                <FileUploader handleFile={() => handleFile()} />

                <input
                  placeholder='Type some message here...'
                  onChange={e => setMessage(e.target.value)}
                  value={message}
                  className='pl-8 w-full h-8 border-2 border-green-200 rounded-lg'
                  type='text'
                />
                <button
                  type='sumbit'
                  className='px-2 py-1 bg-green-300 hover:bg-green-200 rounded-lg border-2 border-white'>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
