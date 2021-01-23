import * as React from "react";
import {MessageType, REQ_SNOW_STATUS, SNOW_RESPONSE, SNOW_TOGGLE, SNOW_CHANGE} from "../../type";
import "../Button.css";

export const Button = () => {
    const [runningEffect, setRunningEffect] = React.useState(true);
    const [charRender, setCharRender] = React.useState("");
    React.useEffect(() =>{
        chrome.runtime.sendMessage({type : REQ_SNOW_STATUS});
        chrome.runtime.onMessage.addListener((message : MessageType) => {
            console.log(message);
            switch (message.type) {
                case SNOW_RESPONSE:
                    setRunningEffect(()=>message.snowing);
                    if(message.item) {
                        setCharRender(()=>message.item);
                    }
                    break;
                case SNOW_CHANGE:
                    setCharRender(()=>message.item);
                    setRunningEffect(()=>message.snowing);
                default:
                    break;
            }
        });
    },[]);

    const onClick = () => {
        chrome.runtime.sendMessage({type : SNOW_TOGGLE, snowing: !runningEffect});
    }

    return (
        <div className="buttonContainer">
            <button className="effectButton" onClick={onClick}>
                {runningEffect ? `Disable Effect ${charRender}` : `Let is show ! ${charRender}`}
            </button>
        </div>
    )
}