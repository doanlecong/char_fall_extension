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

const EffectItems = (numItem = 12,charRender = '💏') => {
  let content : any = [];

  for(let i = 0; i < numItem; i++) {
    content.push(<div className="snowflake">{charRender}</div>)
  }

  return content;
}

const effectContainer = document.getElementById("effect_container");
const EffectContainer = () => {
  const [snowing, setSnowing]       = React.useState(false); 
  const [charRender, setCharRender] = React.useState("");
  const [numItem, setNumItem]       = React.useState(12);
  const [activeBg, setActiveBg]     = React.useState(false);
  const [dataColorBg, setDataColorBg] = React.useState<DataGradient | DataSolid | null| undefined>(null);
  const [typeBg, setTypeBg] = React.useState('solid_tab');
  const [transparentIndex, setTransparent] = React.useState(50);

  React.useEffect(() => {
    console.log("CONTENT RUNNING !");
    chrome.runtime.sendMessage({type : REQ_SNOW_STATUS});
    chrome.runtime.sendMessage({type : GET_BACKGROUND_DATA_CONTENT});
    chrome.runtime.onMessage.addListener((message : MessageType) => {
      console.log(message);
      switch(message.type) {
          case SNOW_RESPONSE:
              setSnowing(() => message.snowing);
              if(message.item) {
                setCharRender(() => message.item);
              }
              if(message.num_item) {
                setNumItem(() => message.num_item);
              }
              break;
          case SNOW_CHANGE: 
            if(message.item && charRender != message.item) {
              setCharRender(() => message.item);
            }

            if(message.snowing) {
              setSnowing(message.snowing);
            }
            break;
          case SET_NUM_ITEM: 
            
          default: 
            break;
      }
    });

    chrome.runtime.onMessage.addListener((message : BackgroundData) => {
      switch(message.type) {
        case GET_BACKGROUND_DATA_CONTENT:
          const data = message.data;
          if(data.active) {
            console.log(data.active);
            setActiveBg(() => data.active);
          }

          if(data.dataColor) {
            setDataColorBg(() => data.dataColor);
          }

          if(data.transNum) {
            setTransparent(() => data.transNum);
          }

          if(data.tab) {
            setTypeBg(() => data.tab);
          }
          break;
        default: 
          break;
      }
    });
  }, []);
 
  return  (
    <>
      {snowing ? EffectItems(numItem,charRender) : ''}
      {activeBg ? <BackgroundContent tab={typeBg} transparent={transparentIndex} dataColor={dataColorBg} active={activeBg} /> : ""}
      {/* {snowing ? <Matrix/> : ""} */}
    </>
  );
};

ReactDOM.render(<EffectContainer/>, effectContainer);


