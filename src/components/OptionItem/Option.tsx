import * as React from "react";
import {MessageType, EffectMesType, SNOW_CHANGE, GET_EFFECT_ITEM, REQ_SNOW_STATUS} from "../../type";
import "./option.css";


const arrOption = ['♥','😘','💋','🎶','❄','🎄','🎉','👻', '❅','☁','💕','🎼'];

const EffectPayload = (item = '') => {
    return {
        item : item,
        type : SNOW_CHANGE,
        snowing : true,
    }
}

const Options = () => {    
    const [currSelect, setCurrSelect] = React.useState('');

    React.useEffect(() => {
        //chrome.runtime.sendMessage({type : REQ_SNOW_STATUS});
        chrome.runtime.onMessage.addListener((message : EffectMesType) => {
            console.log(message);
            if(message.item) {
                setCurrSelect(message.item);
            }
        })
    }, [])

    const handleSelectOption = (item = '') => {
        chrome.runtime.sendMessage(EffectPayload(item));
        // chrome.runtime.onMessage.addListener((message: EffectMesType) => {
        //     setCurrSelect(message.item);
        // })
    };


    return (
        <div className="option_selects">
            {
                arrOption.map((item, index) => {
                    return (
                        <button className={`button_option ${(item == currSelect) ? "active" : ''}`} 
                            key={index} 
                            onClick = {(e) => handleSelectOption(item)}>
                            {item}
                        </button>
                    );
                })
            }
        </div>
    );
};

export {Options};