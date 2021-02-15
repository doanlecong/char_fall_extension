// This file is injected as a content script
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./content.css";
import { DataGradient, DataSolid } from "./components/Background";
import BackgroundContent from "./components/BackgroundContent";
import {
  MessageType,
  REQ_SNOW_STATUS,
  SNOW_CHANGE,
  SNOW_RESPONSE,
  SET_NUM_ITEM, 
  BackgroundData, 
  GET_BACKGROUND_DATA, 
  GET_BACKGROUND_DATA_CONTENT, 
  GET_INITIAL_DATA_CONTENT,
  CHANGE_EFFECT_DATA,
  CHANGE_BACKGROUND_DATA
} from "./type";

// import Matrix from "./components/Matrix";

const body = document.getElementsByTagName("body");
const snowflakesContainer = document.createElement('div');
snowflakesContainer.id = "effect_container";
snowflakesContainer.className = "snowflakes";
snowflakesContainer.setAttribute('aria-hidden',"true");
body[0]?.prepend(snowflakesContainer);

interface DataReceive {
  tab : string,
  active : boolean,
  transparent : number,
  dataColor : DataGradient | DataSolid | null | undefined,
}

interface DataEffect {
  activeEffect : boolean,
  currentItem: string,
  numItem : number,
}

const EffectItems = (numItem = 12, charRender = '💏') => {
  let content : any = [];

  for(let i = 0; i < numItem; i++) {
    content.push(<div className="snowflake">{charRender}</div>)
  }

  return content;
}

const effectContainer = document.getElementById("effect_container");

const EffectContainer = () => {
  //const [snowing, setSnowing]       = React.useState(false); 
  //const [charRender, setCharRender] = React.useState("");
  //const [numItem, setNumItem]       = React.useState(12);
  const [dataEffect, setDataEffect] = React.useState<DataEffect>({
    activeEffect : false,
    currentItem: "💏",
    numItem : 12,
  });
  
  const [dataReceiveBg, setDataReceiveBg] = React.useState<DataReceive>({
    tab : "solid_tab",
    active : false,
    transparent: 50,
    dataColor: null,
  });

  React.useEffect(() => {
    console.log("CONTENT RUNNING !");
    chrome.runtime.sendMessage({type : GET_INITIAL_DATA_CONTENT});
    chrome.runtime.onMessage.addListener((message : {type : string, data :any}) => {
      console.log(message);
      switch(message.type) {
        case GET_INITIAL_DATA_CONTENT : 
          let dataRe = message.data;
          ReactDOM.unstable_batchedUpdates(() => {
            if(dataRe.dataEffect) {
              setDataEffect(() => dataRe.dataEffect);
            }

            if(dataRe.dataBackground) {
              setDataReceiveBg(() => dataRe.dataBackground);
            }
          });
          break;
        case CHANGE_EFFECT_DATA :
          setDataEffect(() => message.data);
          break;
        case CHANGE_BACKGROUND_DATA: 
          setDataReceiveBg(() => message.data);
          break;
        default:
          break;
      }
    });
  }, []);
 
  return  (
    <>
      {dataEffect.activeEffect ? EffectItems(dataEffect.numItem,dataEffect.currentItem) : ''}
      {dataReceiveBg.active ? <BackgroundContent tab={dataReceiveBg.tab} 
                    transparent={dataReceiveBg.transparent} 
                    dataColor={dataReceiveBg.dataColor} 
                    active={dataReceiveBg.active} /> : ""}
      {/* {snowing ? <Matrix/> : ""} */}
    </>
  );
};

ReactDOM.render(<EffectContainer/>, effectContainer);


