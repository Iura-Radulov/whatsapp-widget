import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings({clientId}) {
  const [qr, setQr] = useState(0);
  const [show, setShow] = useState(false);
  const [logged, setLogged] = useState(false);
  const [clientInfo, setClientInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  console.log('clientInfo', clientInfo)
  useEffect(() => {
    console.log('qr', qr)
    if (qr.length > 0) {
      setShow(true);
      setLoading(false);
    }
  }, [qr]);

  useEffect(() => {
    if (!clientInfo) {
      getCLientInfo()
    }
    if (clientInfo) navigate(`/chat`)
  }, [clientInfo, ])

  useEffect(() => {
    getCLientInfo();
  }, []);

  const getCLientInfo = async () => {
    console.log('SEARCHING', clientId)
    const clientInfo = await axios.get(`http://localhost:8000/api/getClient?client=${clientId}`);
    console.log(clientInfo.data)
    if (clientInfo.data.err === 'undefined not found!') {
      return
    }
    if (clientInfo.data.me) {
      return setClientInfo(clientInfo.data);
    }
  };

  const logIn = async () => {
    setLoading(true);
    const qr = await axios.get(`http://localhost:8000/api/createClient?client=${clientId}`);
    if (qr.data.client) {
      navigate(`/chat`)
    }
    if (qr.data.qr) {
      return setQr(qr.data.qr)
    }
  };

  const logOut = async () => {
    setShow(false);
    setClientInfo(false);
    await axios.get(`http://localhost:8000/api/logout?client=${clientId}`);
    return setLogged(false);
  };

  return (
    <div 
    className="flex justify-center items-center w-full h-screen"
    >
      <div className="flex items-center flex-col w-96 h-96 rounded-lg border bg-gray-50">
        <h1 className="mt-4 font-bold text-4xl">WhatsApp Client</h1>
        <div className="my-auto">
          {clientInfo !== null && clientInfo === false && (
            <div>
              {show ? (
                <>
                  <QRCodeSVG value={qr} />
                  <button
                  onClick={() => getCLientInfo()}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <p>{loading ? "Loading..." : "Scaned!"}</p>
                </button>
                </>
              ) : (
                <button
                  onClick={() => logIn()}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-400 font-bold rounded-lg hover:bg-green-200"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <p>{loading ? "Loading..." : "Login"}</p>
                </button>
              )}
            </div>
          )}
          {clientInfo !== null && clientInfo?.phone && (
            <button onClick={() => logOut()}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
}
