import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { SliderTransparent } from "../Slider";
import "./background.css";
import { GradientBackground , Direction} from "./GradientBackground";
import { SolidBackground } from "./SolidBackground";

interface Color {
    redCode: number,
    greenCode : number,
    blueCode : number,
}

interface DataGradient {
    colorRoot : {
        color1 : number,
        color2 : number,
        color3 : number
    },
    direction: Direction,
    dataSet : [Color?]
}

interface DataSolid {
    colorId : string,
    colorData : Color,
}

interface DataReturn {
    tab: string, 
    transparent: number,
    dataColor : any ,//DataGradient | DataSolid | null | undefined,
    active: boolean,
}

interface DataBackground {
    tabSelect : string,
    transNum : number,
    active : boolean,
    dataChosen : DataGradient | DataSolid | null | undefined,
    returnData : ({
        tab ,
        transparent,
        dataColor,
        active
    } : DataReturn) => void,
}

const Background = ({tabSelect, active ,transNum, dataChosen, returnData} : DataBackground) => {
    const [firstRender, setFirstRender] = React.useState(true);
    const [tabActive, setTabActive] = React.useState(tabSelect ?? "solid_tab");
    const [transparent, setTranspanent] = React.useState(transNum ?? 50);
    const [activeBg, setActiveBg] = React.useState(active ?? false);
    const [dataColorChosen, setDataColorChosen] = React.useState<DataGradient | DataSolid | null | undefined>(dataChosen);

    React.useEffect(() => {
        if(firstRender == true) {setFirstRender(false); return;}
        returnData({tab : tabActive, transparent : transparent, dataColor : dataColorChosen, active : activeBg});
    },[tabActive, dataColorChosen, transparent, activeBg]);

    const handleClickTab = (id : string) => {
        unstable_batchedUpdates(() => {
            (tabActive != id) && setDataColorChosen(null);
            if(id === "solid_tab") {setTabActive(() => "solid_tab")}
            if(id === "gradient_tab") {setTabActive(() => "gradient_tab")}
        })
    };

    const handleDataSlider = (val:number = 50) => {
        //console.log("DATA SLIDER : ", val);
        setTranspanent(() => val);
    }

    const handleDataSolid = (dataSolid : DataSolid) => {
        setDataColorChosen(() => dataSolid);
    }

    const handleDataGradient = (dataGradient : DataGradient) => {
        setDataColorChosen(() => dataGradient);
    }
    
    return (
        <div className="background_custom">
            <div className="tab-list">
                <div className={`tab-item ${activeBg ? 'active' : ''}`}
                    id='active_btn' 
                    style={{marginRight : "5px"}}
                    onClick={() => setActiveBg(prev => !prev)}>{activeBg ? 'Active' : 'Disabled'}</div>
                <div className={`tab-item ${tabActive == 'solid_tab' ? "active" : ""}`} id="solid_tab" 
                    style={{marginRight:"5px"}} 
                    onClick={e => handleClickTab("solid_tab")}>Solid</div>
                <div className={`tab-item ${tabActive == 'gradient_tab' ? "active" : ""}`} id="gradient_tab" 
                    onClick={e => handleClickTab('gradient_tab')}>Gradient</div>
            </div>
            <div className="slider-tranparent-box">
                <SliderTransparent min={0} max={100} curr={50} returnData={handleDataSlider}/>
            </div>
            <div className="tab-pane">
                {tabActive == "solid_tab" ? 
                    <SolidBackground dataChosen={dataColorChosen} returnData={handleDataSolid}/> : 
                    <GradientBackground dataChosen={dataColorChosen} returnData={handleDataGradient}/>}
            </div>
        </div>
    );
    
}

export {Background, DataBackground, DataGradient, DataSolid, Color, DataReturn};