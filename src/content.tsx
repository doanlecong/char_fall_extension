// This file is injected as a content script
import * as React from "react";
import * as ReactDOM from "react-dom";
import {MessageType, REQ_SNOW_STATUS, SNOW_CHANGE, SNOW_RESPONSE, SET_NUM_ITEM} from "./type";
import "./content.css";

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
  const [snowing, setSnowing] = React.useState(false); 
  const [charRender, setCharRender] = React.useState("");
  const [numItem, setNumItem] = React.useState(12);

  React.useEffect(() => {
    console.log("CONTENT RUNNING !");
    chrome.runtime.sendMessage({type : REQ_SNOW_STATUS});
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
  }, [])
 
  return  (
    <>
      {snowing ? EffectItems(numItem,charRender) : ''}
    </>
  );
};

ReactDOM.render(<EffectContainer/>, effectContainer);


