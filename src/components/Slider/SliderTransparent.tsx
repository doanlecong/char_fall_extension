import * as React from "react";
import "./slider.css";
import {throttle, debounce} from "../lib/function"; 

interface SliderTransparentInterface  {
    min : number,
    max : number,
    curr : number, 
    returnData : (value : number) => void 
}

const style =  {
    smallText: {
        fontSize: "10px",
        color : "#c0c5ce",
    },
}



const SliderTransparent = ({min = 10, max = 100, curr= 50, returnData} : SliderTransparentInterface) => {
    const [value, setValue] = React.useState(curr);
    let currSliderVal = 0;
    React.useEffect(() => {
        returnData(value);
    }, [value])

    const handleChange = debounce(() => { // debouce or throttle or mouse up !
        setValue(() => currSliderVal);
    }, 100);

    return (
        <div className="slider-container">
            <div className="slider-box">
                <input type="range" className="slider"
                    min={min} 
                    max={max} 
                    value={value} 
                    step={1}
                    onChange={(e) => {currSliderVal = parseInt(e.target.value); handleChange();}}/>
            </div>
            <div className="slider-info">
                <div className="min-val">
                    <div style={style.smallText}>Min</div>
                    <div>{min}</div>
                </div>
                <div className="curr-val">
                    <div style={style.smallText}>Curr</div>
                    <div>{value}</div>
                </div>
                <div className="max-val">
                    <div style={style.smallText}>Max</div>
                    <div>{max}</div>
                </div>
            </div>
        </div>
    )
}

export {SliderTransparent};