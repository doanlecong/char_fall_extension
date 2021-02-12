// This file is injected as a content script
import * as React from "react";
import * as ReactDOM from "react-dom";
import {MessageType, REQ_SNOW_STATUS, SNOW_CHANGE, SNOW_RESPONSE, SET_NUM_ITEM, BackgroundData, GET_BACKGROUND_DATA, GET_BACKGROUND_DATA_CONTENT} from "./type";
import "./content.css";
import { DataGradient, DataSolid } from "./components/Background";
import BackgroundContent from "./components/BackgroundContent";
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
  snowing : boolean,
  charRender: string,
  numItem : number,
}

const EffectItems = (numItem = 12,charRender = '💏') => {
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
    snowing : false,
    charRender: "💏",
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
    chrome.runtime.sendMessage({type : REQ_SNOW_STATUS});
    chrome.runtime.sendMessage({type : GET_BACKGROUND_DATA_CONTENT});
    chrome.runtime.onMessage.addListener((message : MessageType) => {
      console.log(message);
      let dataChange = dataEffect;

      switch(message.type) {
        case SNOW_RESPONSE:
          dataChange.snowing = message.snowing;
          //setSnowing(() => message.snowing);
          if(message.item) {
            dataChange.charRender = message.item;
            //setCharRender(() => message.item);
          }
          if(message.num_item) {
            dataChange.numItem = message.num_item;
            //setNumItem(() => message.num_item);
          }
          break;
        case SNOW_CHANGE: 
          if(message.item && dataEffect.charRender != message.item) {
            dataChange.charRender = message.item;
            //setCharRender(() => message.item);
          }

          if(message.snowing) {
            dataChange.snowing = message.snowing;
            //setSnowing(message.snowing);
          }
          break;
        case SET_NUM_ITEM: 
          
        default: 
          break;
      }

      setDataEffect(() => dataChange);
    });

    chrome.runtime.onMessage.addListener((message : BackgroundData) => {
      switch(message.type) {
        case GET_BACKGROUND_DATA_CONTENT:
          const data = message.data;
          setDataReceiveBg(() => data);
          break;
        default: 
          break;
      }
    });
  }, []);
 
  return  (
    <>
      {dataEffect.snowing ? EffectItems(dataEffect.numItem,dataEffect.charRender) : ''}
      {dataReceiveBg.active ? <BackgroundContent tab={dataReceiveBg.tab} 
                    transparent={dataReceiveBg.transparent} 
                    dataColor={dataReceiveBg.dataColor} 
                    active={dataReceiveBg.active} /> : ""}
      {/* {snowing ? <Matrix/> : ""} */}
    </>
  );
};

ReactDOM.render(<EffectContainer/>, effectContainer);


