import * as React from "react";
import {GET_CURRENT_NUM_ITEM, SET_NUM_ITEM} from "../../type";
import "./slider.css";
const style =  {
    smallText: {
        fontSize: "10px",
        color : "#c0c5ce",
    },
}

const Slider = ({currentVal, handleChangeSliderVal} : 
    {currentVal : number, handleChangeSliderVal : (...args : [any]) => void}) => {
    const maxItem  = 30;
    const minItem  = 10;

    return (
        <div className="slider-container">
            <div className="slider-box">
                <input type="range" className="slider"
                min={minItem} 
                max={maxItem} 
                value={currentVal} 
                step={1}
                onChange={(e) => handleChangeSliderVal(parseInt(e.target.value))}/>
            </div>
            <div className="slider-info">
                <div className="min-val">
                    <div style={style.smallText}>Min</div>
                    <div>{minItem}</div>
                </div>
                <div className="curr-val">
                    <div style={style.smallText}>Curr</div>
                    <div>{currentVal}</div>
                </div>
                <div className="max-val">
                    <div style={style.smallText}>Max</div>
                    <div>{maxItem}</div>
                </div>
            </div>
        </div>
    )
}

export {Slider} ;