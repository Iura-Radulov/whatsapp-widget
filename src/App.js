import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./components/chat";
import Settings from "./components/settings";

export function App(props) {

  console.log(props)

  if (props.show === 'show' && props.clientid) {

    return (
      <div className="whatsappwidget">
          <div className="flex flex-col justify-center items-center">
              <Router>
                  <Routes>
                    <Route path="/chat" element={<Chat chatWindow={props.chat} clientId={props.clientid} />} />
                    <Route exact path="/" element={<Settings clientId={props.clientid} />} />
                  </Routes>
              </Router>
          </div>
      </div>
    )
  } else return <div className="whatsappwidget"></div>
}

export default App;
