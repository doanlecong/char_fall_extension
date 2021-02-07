import * as React from "react";
import { Color } from "../Background";
import { DataReturn } from "../Background/Background";

import "./background_content.css";

const BackgroundContent = ({tab, 
                            transparent,
                            dataColor,
                            active} : DataReturn) => {

    if(!active || !dataColor) return <div className="background_content"></div>;
    
    let style = {};
    
    if(tab == 'solid_tab') {
        if(dataColor.colorId && dataColor.colorData) {
            const color = dataColor.colorData;
            style = { 
                backgroundColor : `rgb(${color.redCode} ${color.greenCode} ${color.blueCode} / ${transparent ?? 50}%)`,
            }
        }
    } else if(tab == 'gradient_tab') {
        if(dataColor.dataSet && dataColor.dataSet.length && dataColor.direction) {
            
            let colorStr = '';
            
            dataColor.dataSet.map((color : Color, index : number) => {
                colorStr += `rgb(${color.redCode} ${color.greenCode} ${color.blueCode} / ${transparent ?? 50}%),`;
            })
            
            console.log('Color String',colorStr);

            if(colorStr.length) {
                let index = colorStr.lastIndexOf(',');
                colorStr = colorStr.substring(0, index);
            }

            style = {
                backgroundImage : `linear-gradient(${dataColor.direction.mean}, ${colorStr})`,
            }
        }
    }

    return  (
        <div className="background_content" style={style}></div>
    )
}

export {BackgroundContent};