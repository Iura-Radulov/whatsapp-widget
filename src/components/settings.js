import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import svgSettings from '../images/svgSettings';
import EnterInstraction from './EnterInstaction';

export default function Settings({ clientId }) {
  const [qr, setQr] = useState(0);
  // const [show, setShow] = useState(false);
  // const [logged, setLogged] = useState(false);
  const [clientInfo, setClientInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  console.log('clientInfo', clientInfo);
  console.log(qr);
  useEffect(() => {
    console.log('qr', qr);

    if (qr.length > 0) {
      getCLientInfo();
      console.log('clientInfo', clientInfo);

      // setShow(true);
      setLoading(false);
    }
  }, [qr]);

  useEffect(() => {
    if (!clientInfo) {
      getCLientInfo();
    }
    if (clientInfo) navigate(`/chat`);
  }, [clientInfo]);

  useEffect(() => {
    getCLientInfo();
    // logIn();
  }, []);

  const getCLientInfo = async () => {
    console.log('SEARCHING', clientId);
    const clientInfo = await axios.get(`http://localhost:8000/api/getClient?client=${clientId}`);
    console.log(clientInfo.data);
    if (clientInfo.data.err === 'undefined not found!') {
      return;
    }
    if (clientInfo.data.me) {
      return setClientInfo(clientInfo.data);
    }
  };

  const logIn = async () => {
    setLoading(true);
    const qr = await axios.get(`http://localhost:8000/api/createClient?client=${clientId}`);
    console.log(qr);
    if (qr.data.client) {
      navigate(`/chat`);
    }
    if (qr.data.qr) {
      return setQr(qr.data.qr);
    }
  };

  const logOut = async () => {
    // setShow(false);
    setClientInfo(false);
    await axios.get(`http://localhost:8000/api/logout?client=${clientId}`);
    // return setLogged(false);
  };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div className='flex items-center flex-col w-96 min-h-96 py-4 rounded-lg border bg-gray-50'>
        <h1 className='my-4 font-bold text-4xl'>WhatsApp Client</h1>
        <div className='flex flex-col items-center'>
          {/* {clientInfo !== null && clientInfo === false && ( */}
          {/* <div> */}
          <EnterInstraction />
          <QRCodeSVG value={qr} className='my-[30px]' />

          {/* <button
              onClick={() => getCLientInfo()}
              className='flex items-center space-x-2 px-3 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200'>
              {loading && svg1}
              <p>{loading ? 'Loading...' : 'Scaned!'}</p>
            </button> */}
          {qr ? (
            <button
              onClick={() => getCLientInfo()}
              className='flex items-center space-x-2 px-3 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200'>
              Scaned
            </button>
          ) : (
            <button
              onClick={() => logIn()}
              className='flex items-center space-x-2 px-3 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200'>
              {loading && svgSettings}
              <p>{loading ? 'Loading...' : 'Login'}</p>
            </button>
          )}
          {clientInfo && navigate(`/chat`)}
          {/* </div> */}
          {/* )} */}
          {clientInfo !== null && clientInfo?.phone && (
            <button onClick={() => logOut()}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
}
