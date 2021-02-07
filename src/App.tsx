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

  const [tab, setTab] = React.useState("solid_tab");
  const [transNum, setTransNum] = React.useState(50);
  const [activeBg, setActiveBg] = React.useState(false);
  const [dataColor, setDataColor] = React.useState<DataGradient | DataSolid | null | undefined>(null);
  
  const sendDataToBAckgroundProcess = () => {
    // Tong hop data can thiet de gui lai background 
    const dataBackgroundChange = {
      tab : tab,
      transNum : transNum,
      active : activeBg,
      dataColor : dataColor,
    }

    chrome.runtime.sendMessage({
      type : CHANGE_BACKGROUND_DATA,
      data : dataBackgroundChange,
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
          if(data.tab) {
            setTab(() => data.tab);
          }
          if(data.transNum) {
            setTransNum(() => data.transNum);
          }

          if(data.active) {
            setActiveBg(() => data.active);
          }

          if(data.color) {
            setDataColor(() => data.dataColor);
          }
          break;
        default:
          break;
      }
    });
  }, []);


  React.useMemo(() => {sendDataToBAckgroundProcess()}, [{tab, transNum, dataColor, activeBg}]);

  const handleReceiveData = ({tab, active, transparent, dataColor} : DataReturn) => {
    //console.log(tab, transparent, dataColor, active);
    setTab(() => tab);
    setTransNum(() => transparent);
    setDataColor(() => dataColor);
    setActiveBg(() => active);
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
          <Background tabSelect={tab} active={activeBg} dataChosen={dataColor} transNum={transNum} returnData={handleReceiveData}/>
        </div>
      </div>
      <p className="author_p">Author : <b><a className="author" href="https://doanlee.com" target="_blank">Doan Le</a></b></p>
    </>
  );
};

export default App;
