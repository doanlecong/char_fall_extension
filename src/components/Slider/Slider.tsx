import * as React from "react";
import {GET_CURRENT_NUM_ITEM, SET_NUM_ITEM} from "../../type";
import "./slider.css";
const style =  {
    smallText: {
        fontSize: "10px",
        color : "#c0c5ce",
    },
}

const Slider = () => {
    const [currNumItem, setCurrNumItem] = React.useState(10);
    const maxItem  = 30;
    const minItem  = 10;

    React.useEffect(()=> {
        chrome.runtime.sendMessage({type : GET_CURRENT_NUM_ITEM});
        chrome.runtime.onMessage.addListener((message) => {
            console.log({from : "Slider Console Log", data : message});
            switch(message.type) {
                case GET_CURRENT_NUM_ITEM: 
                    if(message.num_item) {
                        setCurrNumItem(message.num_item);
                    }
                    break;

                case SET_NUM_ITEM:
                    if(message.num_item) {
                        setCurrNumItem(message.num_item);
                    }
                    break;
                default: 
                    break;
            };
        });
    }, []);

    const setNewNumItem = (numItem : number = 10) => {
        chrome.runtime.sendMessage({
            type : SET_NUM_ITEM,
            num_item : numItem
        });
    }

    return (
        <div className="slider-container">
            <div className="slider-box">
                <input type="range" className="slider"
                min={minItem} 
                max={maxItem} 
                value={currNumItem} 
                step={1}
                onChange={(e) => setNewNumItem(parseInt(e.target.value))}/>
            </div>
            <div className="slider-info">
                <div className="min-val">
                    <div style={style.smallText}>Min</div>
                    <div>{minItem}</div>
                </div>
                <div className="curr-val">
                    <div style={style.smallText}>Curr</div>
                    <div>{currNumItem}</div>
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