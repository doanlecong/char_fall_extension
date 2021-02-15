import * as React from "react";
import {MessageType, REQ_SNOW_STATUS, SNOW_RESPONSE, SNOW_TOGGLE, SNOW_CHANGE} from "../../type";
import "../Button.css";

export const Button = ({activeEffect,currentItem, handleChangeActiveEffect} : 
    {activeEffect: boolean, currentItem : string, handleChangeActiveEffect: (...args: [any]) => void}) => {

    return (
        <div className="buttonContainer">
            <button className="effectButton" onClick={handleChangeActiveEffect}>
                {activeEffect ? `Disable Effect ${currentItem}` : `Let is show ! ${currentItem}`}
            </button>
        </div>
    )
}