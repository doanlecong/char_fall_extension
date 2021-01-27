import * as React from "react";
import { SliderTransparent } from "../Slider";
import "./background.css";
import { GradientBackground } from "./GradientBackground";
import { SolidBackground } from "./SolidBackground";

const Background = () => {

    const [tabActive, setTabActive] = React.useState('solid_tab');

    const handleClickTab = (id : string) => {
        if(id === "solid_tab") {setTabActive(() => "solid_tab")}
        if(id === "gradient_tab") {setTabActive(() => "gradient_tab")}
    };

    const handleDataSlider = (val:number = 50) => {

    }
    
    return (
        <div className="background_custom">
            <div className="tab-list">
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
                    <SolidBackground/> : 
                    <GradientBackground/>}
            </div>
        </div>
    );
    
}

export {Background};