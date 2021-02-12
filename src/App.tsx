import * as React from "react";
import logo from "./logo.svg";
import night_icon from "./night_icon.svg";
import "./App.css";
import {Button} from "./components/Button/Button";
import Options from "./components/OptionItem";
import Slider from "./components/Slider";
import {BackgroundData, GET_BACKGROUND_DATA, CHANGE_BACKGROUND_DATA} from "./type";
import Background, {DataBackground, DataGradient, DataSolid, Color, DataReturn} from "./components/Background";

interface DataReceive {
  tab : string,
  active : boolean,
  transparent : number,
  dataColor : DataGradient | DataSolid | null | undefined,
}

const App = () => {

  const [dataReceive, setDataReceive] = React.useState<DataReceive>({
    tab : "solid_tab",
    active : false,
    transparent: 50,
    dataColor: null,
  });
  
  const sendDataToBAckgroundProcess = () => {
    // Tong hop data can thiet de gui lai background 
    chrome.runtime.sendMessage({
      type : CHANGE_BACKGROUND_DATA,
      data : dataReceive,
    });

    console.log('Data Change');
  };

  React.useEffect(() => {
    chrome.runtime.sendMessage({type : GET_BACKGROUND_DATA});
    chrome.runtime.onMessage.addListener((message : BackgroundData) => {
      console.log(message);
      switch(message.type) {
        case GET_BACKGROUND_DATA : 
          let data = message.data;
          setDataReceive(() => data);
          break;
        default:
          break;
      }
    });
  }, []);


  React.useMemo(() => {sendDataToBAckgroundProcess()}, [dataReceive]);

  const handleReceiveData = ({tab, active, transparent, dataColor} : DataReturn) => {
    //console.log(tab, transparent, dataColor, active);
    const dataReceive = {
      tab: tab,
      transparent : transparent,
      active: active,
      dataColor : dataColor,

    };
    setDataReceive(() => dataReceive);
  }

  return (
    
    <>
      <div className="Main">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Button/>
            <Slider/>
            <Options/>
          </header>
        </div>
        <div className="App">
          <header className="App-header">
            <img src={night_icon} className="App-night-icon" alt="logo" />
          </header>
          <Background tabSelect={dataReceive.tab} active={dataReceive.active} dataChosen={dataReceive.dataColor} transNum={dataReceive.transparent} returnData={handleReceiveData}/>
        </div>
      </div>
      <p className="author_p">Author : <b><a className="author" href="https://doanlee.com" target="_blank">Doan Le</a></b></p>
    </>
  );
};

export default App;
