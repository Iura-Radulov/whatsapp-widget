import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import svgSettings from '../images/svgSettings';
import EnterInstraction from './EnterInstaction';
import updateIcon from '../images/update-icon.svg';
import enterIcon from '../images/enterIcon.svg';
// const BASE_URL = 'https://whatsapp-widget.herokuapp.com/';

const BASE_URL = 'http://localhost:8001/';

export default function Settings({ clientId }) {
  const [qr, setQr] = useState(0);
  // const [show, setShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [clientInfo, setClientInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [interval, setInterval] = useState(null);

  let navigate = useNavigate();
  // const interval = useRef();
  console.log('clientInfo', clientInfo);
  // console.log(qr);
  useEffect(() => {
    // getCLientInfo();
    // const clientInfoInterval = setInterval(() => getCLientInfo(), 5000);
    // setInterval(clientInfoInterval);

    console.log('qr-effect', qr);
    console.log('clientId', clientId);
    if (qr) {
      console.log('clientInfo', clientInfo);
      setLoading(false);
    }
    if (clientInfo) {
      navigate(`/chat`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientInfo, qr]);

  if (qr && !update) {
    setTimeout(() => setUpdate(true), 40000);
  }

  const getCLientInfo = async () => {
    console.log('SEARCHING', clientId);
    const clientInfo = await axios.get(`${BASE_URL}api/getClient?client=${clientId}`);
    console.log(clientInfo.data);
    if (clientInfo.data.err === 'undefined not found!') {
      return;
    }
    if (clientInfo.data.me) {
      return setClientInfo(clientInfo.data);
    }
  };

  // const getCLientInfo = async () => {
  //   console.log('SEARCHING', clientId);
  //   const clientInfo = await axios.get(`${BASE_URL}api/getClient?client=${clientId}`);
  //   console.log(clientInfo.data);

  //   if (clientInfo.data.err === 'undefined not found!') {
  //     return;
  //   }
  //   if (clientInfo.data.me) {
  //     localStorage.setItem('clientInfo', JSON.stringify(clientInfo.data));
  //     return setClientInfo(clientInfo.data);
  //   }
  // };

  const onUpdate = async () => {
    setLoading(true);
    const qr = await axios.get(`${BASE_URL}api/createClient?client=${clientId}`);
    setUpdate(false);
    // console.log('qr-onRestart', qr);
    // if (qr.data.client) {
    //   navigate(`/chat`);
    // }
    if (qr.data.qr) {
      return setQr(qr.data.qr);
    }
  };

  const logIn = async () => {
    setLoading(true);
    const qr = await axios.get(`${BASE_URL}api/createClient?client=${clientId}`);
    // const clientInfoInterval = setInterval(() => getCLientInfo(), 1000);

    console.log('qr-login', qr);
    // if (qr.data.client) {
    //   navigate(`/chat`);
    // }
    if (qr.data.qr) {
      return setQr(qr.data.qr);
    }
  };

  // const logOut = async () => {
  //   // setShow(false);
  //   setClientInfo(false);
  //   await axios.get(`${BASE_URL}api/logout?client=${clientId}`);
  //   // return setLogged(false);
  // };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div className='flex items-center flex-col w-96 min-h-96 py-4 rounded-lg border bg-gray-50'>
        <h1 className='my-4 font-bold text-4xl'>WhatsApp Client</h1>
        <div className='flex flex-col items-center'>
          {/* {clientInfo !== null && clientInfo === false && ( */}
          {/* <div> */}
          <EnterInstraction />
          <QRCodeSVG value={qr} className='my-[30px]' />
          <div className='flex'>
            {update && (
              <button
                onClick={() => onUpdate()}
                className='flex items-center space-x-2 mr-3 px-3 py-1 mb-3 bg-green-400 font-bold rounded-lg hover:bg-green-200'>
                {loading && svgSettings}
                {!loading && <img src={updateIcon} alt='update icon' className='w-6' />}
                {/* <p>{loading ? 'Loading...' : 'Update!'}</p> */}
              </button>
            )}

            {qr ? (
              <button
                onClick={() => getCLientInfo()}
                className='flex items-center space-x-2 px-2 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200'>
                <img src={enterIcon} alt='enter icon' className='w-6' />
              </button>
            ) : (
              <button
                onClick={() => logIn()}
                className='flex items-center space-x-2 px-3 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200'>
                {loading && svgSettings}
                <p>{loading ? 'Loading...' : 'Login'}</p>
              </button>
            )}
          </div>
          {/* {clientInfo && navigate(`/chat`)} */}
          {/* </div> */}
          {/* )} */}
          {/* {clientInfo !== null && clientInfo?.phone && (
            <button onClick={() => logOut()}>Logout</button>
          )} */}
        </div>
      </div>
    </div>
  );
}
