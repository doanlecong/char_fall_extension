import * as React from "react";
import {MessageType, EffectMesType, SNOW_CHANGE, GET_EFFECT_ITEM, REQ_SNOW_STATUS} from "../../type";
import "./option.css";


const arrOption = ['♥','😘','💋','🎶','❄','🎄','🎉','👻', '❅','☁','💕','🎼'];

const Options = ({currentItem, handleChangeItemEffect} : 
    {currentItem : string, handleChangeItemEffect: (...args : [any]) => void}) => {    
    
    return (
        <div className="option_selects">
            {
                arrOption.map((item, index) => {
                    return (
                        <button className={`button_option ${(item == currentItem) ? "active" : ''}`} 
                            key={index} 
                            onClick = {(e) => handleChangeItemEffect(item)}>
                            {item}
                        </button>
                    );
                })
            }
        </div>
    );
};

export {Options};