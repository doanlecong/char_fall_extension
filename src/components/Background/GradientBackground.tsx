import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import ColorPicker from "../ColorPicker/ColorPicker";
import "./gradient.css";

interface Props {
    dataChosen : any,
    returnData : (...args : [any]) => any;
}

interface Direction {
    direct : string,
    mean : string,
}

interface Color {
    redCode: number,
    greenCode : number,
    blueCode : number,
}

const directionArr = [
    {
        direct : "⬅",
        mean   : "to left",
    }, {
        direct : "➡",
        mean   : "to right",
    },{
        direct : "⬆",
        mean   : "to top",
    },{
        direct : "⬇",
        mean   : "to bottom",
    },{
        direct : "↗",
        mean   : "to right top",
    },{
        direct : "↖",
        mean   : "to left top",
    },{
        direct : "↘",
        mean   : "to right bottom",
    },{
        direct : "↙",
        mean   : "to left bottom",
    }
]

const GradientBackground = ({dataChosen, returnData} : Props) => {

    let initDirection = {direct: "", mean : ""};
    let colrInit1 = {redCode : 51, greenCode : 153, blueCode: 255};
    let colrInit2 = {redCode : 51, greenCode : 204, blueCode: 51};
    let colrInit3 = {redCode : 204, greenCode : 102, blueCode: 255};

    if(dataChosen && dataChosen.colorRoot && dataChosen.direction) {
        initDirection = dataChosen.direction;
        colrInit1 = dataChosen.colorRoot.color1;
        colrInit2 = dataChosen.colorRoot.color2;
        colrInit3 = dataChosen.colorRoot.color3;
    }

    const [firstRender, setFirstRender] = React.useState(true);
    const [direction, setDirection] = React.useState(initDirection);
    const [currentSelect, setCurrentSelect] = React.useState(1);


    const [colorInit1, setColor1] = React.useState(colrInit1);
    const [colorInit2, setColor2] = React.useState(colrInit2);
    const [colorInit3, setColor3] = React.useState(colrInit3);

    React.useEffect(() => {
        if(firstRender) {
            unstable_batchedUpdates(() => {
                setFirstRender(false);
            })
            return;
        }
        let dataFromColorSet = generateColorSet(colorInit1, colorInit2, colorInit3);
        // console.log(dataFromColorSet);
        returnData(dataFromColorSet);
    },[colorInit1, colorInit2, colorInit3, direction]);


    const generateColorSet = (color1 : Color, color2 : Color, color3 : Color) => {
        let colorRoot = {
            color1 : color1,
            color2 : color2,
            color3 : color3,
        }
        let dataSet1 = generateColorIntermediate(color1, color2);
        let dataSet2 = generateColorIntermediate(color2, color3);
        
        return {colorRoot, direction : direction, dataSet : [ ...dataSet1, ...dataSet2]};
    }

    const generateColorIntermediate = (colorFirst : Color, colorSecond : Color) => {
        let arrColor: [Color?] = []; 
        for(let i = 0 ; i < 6; i++) {
            let newColor = {
                redCode: Math.floor((colorSecond.redCode*((100 - (5 - i)* 20) / 100) + colorFirst.redCode*((100 - i*20)/100))), 
                greenCode : Math.floor((colorSecond.greenCode * ((100 - (5 - i) * 20) /100 ) + colorFirst.greenCode * ((100 - i*20) / 100))),
                blueCode : Math.floor((colorSecond.blueCode * ((100 -(5 - i) * 20) /100 ) + colorFirst.blueCode * ((100 - i*20) / 100 ))),
            }
            arrColor.push(newColor);
        }
        return arrColor
    }

    const handleSelectDirection = (item: Direction) => {
        setDirection(()=> item);
    }

    const handleSelectColor1 = ({r = 0, g = 0, b = 1}) => {
        setColor1(() => ({redCode : r, greenCode: g, blueCode : b}));
    }

    const handleSelectColor2 = ({r = 0, g = 0, b = 1}) => {
        setColor2(() => ({redCode : r, greenCode: g, blueCode : b}));
    }

    const handleSelectColor3 = ({r = 0, g = 0, b = 1}) => {
        setColor3(() => ({redCode : r, greenCode: g, blueCode : b}));
    }

    const convertRgbToHex = ({redCode , greenCode, blueCode} : Color) => {
        return `#${redCode.toString(16)}${greenCode.toString(16)}${blueCode.toString(16)}`;
    }

    return (
        <div className="tab-detail" id="gradient-background">
            <p className="info-guild">Direction</p>
            <div className="direction">
                {directionArr.map((item, index) => {
                    return  (
                        <button title={item.mean} className={`direct-button ${item.direct == direction.direct ? "active" : ""}`} 
                            onClick={(e) => handleSelectDirection(item)}>{item.direct}</button>);
                })}
            </div>
            <p className="info-guild">Colors</p>
            <div className="color-picker-list">
                <button className="btn_color_picker" 
                        id="btn_color_picker_1" 
                        style={{backgroundColor:`rgb(${colorInit1.redCode}, ${colorInit1.greenCode}, ${colorInit1.blueCode})`}}
                        onClick={() => setCurrentSelect(1)}>
                            {convertRgbToHex(colorInit1)}
                </button>
                <button className="btn_color_picker" 
                        id="btn_color_picker_2" 
                        style={{backgroundColor:`rgb(${colorInit2.redCode}, ${colorInit2.greenCode}, ${colorInit2.blueCode})`}}
                        onClick={() => setCurrentSelect(2)}>
                            {convertRgbToHex(colorInit2)}
                </button>
                <button className="btn_color_picker" 
                        id="btn_color_picker_3" 
                        style={{backgroundColor:`rgb(${colorInit3.redCode}, ${colorInit3.greenCode}, ${colorInit3.blueCode})`}}
                        onClick={() => setCurrentSelect(3)}>
                            {convertRgbToHex(colorInit3)}
                </button>
            </div>
            <p className="info-guild">Preview</p>
            <div className="background-preview">
                <div className="color_picker_container" id="color_picker_1_div" style={{display : `${currentSelect == 1 ? "block":"none"}`}}>
                    <ColorPicker id="color_picker_1" settings={colorInit1} returnColor={handleSelectColor1} />
                </div>
                <div className="color_picker_container" id="color_picker_2_div" style={{display : `${currentSelect == 2 ? "block":"none"}`}}>
                    <ColorPicker id="color_picker_2" settings={colorInit2} returnColor={handleSelectColor2} />
                </div>
                <div className="color_picker_container" id="color_picker_3_div" style={{display : `${currentSelect == 3 ? "block":"none"}`}}>
                    <ColorPicker id="color_picker_3" settings={colorInit3} returnColor={handleSelectColor3} />
                </div>
            </div>
            <div className="button-action">
            
            </div>
        </div>
    );
}

export {GradientBackground, Direction};
export const GradientBackgroundMemoized = React.memo(GradientBackground);