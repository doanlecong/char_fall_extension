import * as React from "react";
import "./solid_background.css";
import checkBox from "../../check_box.svg";


interface SolidBackgroundInterface {
    returnData : (...args : [any]) => any
}

interface ColorObj {
    r :number,
    g :number,
    b :number
}

const SolidBackground = ({returnData} : SolidBackgroundInterface) => {
    const [color , setColor] = React.useState({r : 0, g : 0, b : 0});
    const [itemBgSelect, setItemBgSelect] = React.useState("");

    React.useEffect(() => {
        //console.log({color, itemBgSelect});
    },[color, itemBgSelect]);


    const handleSelectBackgroundColor = (itemSelect: string,r : number, g:number, b:number) => {
        setColor({r : r, g : g, b : b});
        setItemBgSelect(itemSelect);
        returnData({colorId : itemSelect, colorData : {redCode : r, greenCode : g, blueCode : b}});
    }

    const showCheckBox = (itemBg: string) => {
        let currItemBgSelect = itemBgSelect;
        if(currItemBgSelect !== "" && currItemBgSelect === itemBg) return <img src={checkBox} alt="selected_background" className="img_check_box"/>;
        return null;
    }

    return (
        <div className="tab-detail" id="solid-background">
            <div className="item-background" style={{backgroundColor:"rgb(255, 204, 0)"}}   onClick={() => handleSelectBackgroundColor('a',255, 204,0)}>{showCheckBox('a')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(255, 153, 102)"}} onClick={() => handleSelectBackgroundColor('b',255, 153,102)}>{showCheckBox('b')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(255, 153, 153)"}} onClick={() => handleSelectBackgroundColor('c',255, 153,153)}>{showCheckBox('c')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(255, 102, 0)"}}   onClick={() => handleSelectBackgroundColor('d',255, 102,0)}>{showCheckBox('d')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(255, 102, 102)"}} onClick={() => handleSelectBackgroundColor('f',255, 102,102)}>{showCheckBox('f')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(204, 153, 255)"}} onClick={() => handleSelectBackgroundColor('g',204, 153,255)}>{showCheckBox('g')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(255, 102, 153)"}} onClick={() => handleSelectBackgroundColor('h',255, 102,153)}>{showCheckBox('h')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(68, 204, 0)"}}    onClick={() => handleSelectBackgroundColor('i',68, 204,0)}>{showCheckBox('i')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(51, 153, 255)"}}  onClick={() => handleSelectBackgroundColor('j',51, 153, 255)}>{showCheckBox('j')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(153, 51, 153)"}}  onClick={() => handleSelectBackgroundColor('k',153, 51,153)}>{showCheckBox('k')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(102, 0, 204)"}}   onClick={() => handleSelectBackgroundColor('l',102, 0, 204)}>{showCheckBox('l')}</div>
            <div className="item-background" style={{backgroundColor:"rgb(0, 230, 138)"}}   onClick={() => handleSelectBackgroundColor('q',0, 230,138)}>{showCheckBox('q')}</div>
        </div>
    );
}

export {SolidBackground};