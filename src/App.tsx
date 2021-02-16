import * as React from "react";
import logo from "./logo.svg";
import night_icon from "./night_icon.svg";
import "./App.css";
import {Button} from "./components/Button/Button";
import Options from "./components/OptionItem";
import Slider from "./components/Slider";
import {BackgroundData, GET_BACKGROUND_DATA, CHANGE_BACKGROUND_DATA, CHANGE_EFFECT_DATA, GET_INITIAL_DATA} from "./type";
import Background, {DataGradient, DataSolid, DataReturn} from "./components/Background";
import { unstable_batchedUpdates } from "react-dom";

interface DataReceive {
  tab : string,
  active : boolean,
  transparent : number,
  dataColor : DataGradient | DataSolid | null | undefined,
}

const App = () => {

  const [firstFlgEffect, setChangeFirstFlgEffect] = React.useState(0);
  const [firstFlgBg, setFirstFlgBg] = React.useState(0);
  const [dataEffect, setDataEffect] = React.useState({
    activeEffect : false,
    currentItem  : "💏",
    numItem      : 12,
  });

  const [dataReceive, setDataReceive] = React.useState<DataReceive>({
    tab : "solid_tab",
    active : false,
    transparent: 50,
    dataColor: null,
  });
  
  React.useEffect(() => {
    chrome.runtime.sendMessage({type : GET_INITIAL_DATA});
    chrome.runtime.onMessage.addListener((message : BackgroundData) => {
      console.log(message);
      switch(message.type) {
        case GET_INITIAL_DATA: 
					let dataEffectRe = message.data.dataEffect;
					let dataBackgroundColorRe = message.data.dataBackground;
          unstable_batchedUpdates(() => {
            setDataEffect(() => dataEffectRe);
  					setDataReceive(() => dataBackgroundColorRe);
          })				
          break;
        case GET_BACKGROUND_DATA : 
          let data = message.data;
          setDataReceive(() => data);
          break;
        default:
          break;
      }
    });
  }, []);

  const sendDataToBackgroundProcess = () => {
    // Tong hop data can thiet de gui lai background 
    if(firstFlgBg < 3) {
      setFirstFlgBg((pre) => pre + 1);
      return;
    }
    chrome.runtime.sendMessage({
      type : CHANGE_BACKGROUND_DATA,
      data : dataReceive,
    });
    console.log('Data Change BG');
  };

  const sendDataEffectToBackground = () => {
    if(firstFlgEffect <= 1) {
      setChangeFirstFlgEffect((pre) => pre + 1);
      return;
    }
    chrome.runtime.sendMessage({
      type : CHANGE_EFFECT_DATA,
      data : dataEffect,
    });
    console.log("Data Change Effect");
  }

  React.useMemo(() => sendDataEffectToBackground(),[dataEffect]);
  React.useMemo(() => sendDataToBackgroundProcess(),[dataReceive]);

  const handleReceiveData = ({tab, active, transparent, dataColor} : DataReturn) => {
    console.log("UPDATE BG DATA",tab, transparent, dataColor, active);
    const dataRe = {
      tab: tab,
      transparent : transparent,
      active: active,
      dataColor : dataColor,
    };
		
    setDataReceive(() => dataRe);
    //sendDataToBackgroundProcess();
  }

  const handleChangeActiveEffect = () => {
    console.log("UPDATE ACTIVE EFFECT");
    const currentActive = dataEffect.activeEffect;
    const dataEffectChange = {
      activeEffect : !currentActive,
      currentItem  : dataEffect.currentItem,
      numItem      : dataEffect.numItem,
    }
    setDataEffect(() => dataEffectChange);
    //sendDataEffectToBackground();
  }

  const handleChangeSliderVal = (numItem : number) => {
    console.log('UPDATE SLIDER ITEM EFFECT');
    const dataEffectChange = {
      activeEffect : dataEffect.activeEffect,
      currentItem  : dataEffect.currentItem,
      numItem      : numItem,
    }
    setDataEffect(() => dataEffectChange);
    //sendDataEffectToBackground();
  }

  const handleChangeItemEffect = (item : string) => {
    console.log('UPDATE iTEM EFFECT');
    const dataEffectChange = {
      activeEffect : dataEffect.activeEffect,
      currentItem  : item,
      numItem      : dataEffect.numItem,
    }
    setDataEffect(() => dataEffectChange);
    //sendDataEffectToBackground();
  }

  return (
    <>
      <div className="Main">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Button activeEffect={dataEffect.activeEffect} 
                    currentItem={dataEffect.currentItem} 
                    handleChangeActiveEffect={handleChangeActiveEffect}/>
            <Slider currentVal={dataEffect.numItem} 
                    handleChangeSliderVal={handleChangeSliderVal} />
            <Options  currentItem={dataEffect.currentItem} 
                      handleChangeItemEffect={handleChangeItemEffect} />
          </header>
        </div>
        <div className="App">
          <header className="App-header">
            <img src={night_icon} className="App-night-icon" alt="logo" />
          </header>
          <Background tabSelect={dataReceive.tab} 
                    active={dataReceive.active} 
                    dataChosen={dataReceive.dataColor} 
                    transNum={dataReceive.transparent} 
                    returnData={handleReceiveData}/>
        </div>
      </div>
      <p className="author_p">Author : <b><a className="author" href="https://doanlee.com" target="_blank">DL</a></b></p>
    </>
  );
};

export default App;
