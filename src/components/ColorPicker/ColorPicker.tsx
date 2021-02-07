import * as React from 'react';
import { throttle } from '../lib/function';
import "./colorpicker.css";

interface Props {
    settings : {
        redCode : number,
        greenCode : number,
        blueCode : number,
    },
    id : string,
    returnColor : (...args : [any]) => any,
}

interface DataColorPicker {
    rgbaColor : string,
    redCode : number,
    greenCode : number,
    blueCode : number,
    tranparent : number,

    widthBlock: number,
    heightBlock: number,

    widthStrip : number,
    heightStrip: number,

    isDrag :boolean,
    isDragStrip: boolean,

    isShow: boolean,
}

class ColorPicker extends React.Component<Props>{
    colorBlock: React.RefObject<HTMLCanvasElement>;
    colorGrid: React.RefObject<HTMLCanvasElement>;
    state : DataColorPicker;
    constructor(props : Props) {
        super(props);
        this.state = {
            rgbaColor : 'rgba(255, 0 , 0, 0.5)',
            redCode : 0,
            greenCode : 0,
            blueCode : 0,
            tranparent : 1,

            widthBlock: 0,
            heightBlock: 0,

            widthStrip : 0,
            heightStrip: 0,

            isDrag :false,
            isDragStrip: false,

            isShow : false,
        };
        if(this.props && this.props.settings) {
            let settings = this.props.settings;
            if(settings.hasOwnProperty('redCode') && settings.redCode) {
                this.state = Object.assign(this.state, {redCode : settings.redCode});
            }
            if(settings.hasOwnProperty('greenCode') && settings.greenCode) {
                this.state = Object.assign(this.state, {greenCode: settings.greenCode});
            }
            if(settings.hasOwnProperty('blueCode') && settings.blueCode) {
                this.state= Object.assign(this.state, {blueCode : settings.blueCode});
            }
        }

        this.colorBlock = React.createRef();
        this.colorGrid  = React.createRef();
    }

    componentDidMount() {
        let colorBlock = this.colorBlock.current; //document.getElementById('color-block');
        let colorStrip = this.colorGrid.current; // document.getElementById('color-strip');
        if(!colorBlock || !colorStrip) return;
    
        let width1  = colorBlock.width;
        let height1 = colorBlock.height;
        let width2  = colorStrip.width;
        let height2 = colorStrip.height;

        this.setState((prevState, props) => {
            return {prevState : Object.assign(prevState, {widthBlock: width1, heightBlock : height1, widthStrip : width2, heightStrip : height2})};
        }, () => {
            console.log(this.state);
            this.setUpCanvasColorPicker();
        });
    }

    setUpCanvasColorPicker = () => {
        console.log('SET UP CANVAS');

        let canvasBlock = this.colorBlock.current;
        let canvasStrip = this.colorGrid.current;

        if(!canvasBlock || !canvasStrip) return ;

        let ctx1 = canvasBlock.getContext('2d');
        let ctx2 = canvasStrip.getContext('2d');
        let width1  = this.state.widthBlock;
        let height1 = this.state.heightBlock;
        let width2  = this.state.widthStrip;
        let height2 = this.state.heightStrip;

        if(!ctx1 || ! ctx2) return;

        ctx1.rect(0, 0, width1, height1);
        this.fillGradient();

        ctx2.rect(0, 0, width2, height2);
        let grd2 = ctx2.createLinearGradient(0, 0, 0, height1);
        grd2.addColorStop(0, 'rgba(255, 0, 0, 1)');
        grd2.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        grd2.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        grd2.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        grd2.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        grd2.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        grd2.addColorStop(1, 'rgba(255, 0, 0, 1)');
        console.log("STRIP ", grd2);
        ctx2.fillStyle = grd2;
        ctx2.fill();
        this.setUpEventHandlerColorPicker();
    };

    setUpEventHandlerColorPicker = () => {
        // this.refs.canvas_color_strip.addEventListener("click", this.click, false);
        this.colorGrid.current?.addEventListener("mousedown", this.mouseDownStrip, false);
        this.colorGrid.current?.addEventListener("mouseup", this.mouseUpStrip, false);
        this.colorGrid.current?.addEventListener("mousemove", this.mouseMoveStrip, false);
        this.colorBlock.current?.addEventListener("mousedown", this.mousedown, false);
        this.colorBlock.current?.addEventListener("mouseup", this.mouseup, false);
        this.colorBlock.current?.addEventListener("mousemove", this.mousemove, false);
    };

    private mouseDownStrip : {(e : any) : any } = (e : React.MouseEvent) => {
        this.setState((prevState, props) => {
            return {prevState : Object.assign(prevState,{isDragStrip : true})};
        } , () => {
            let x = e.clientX;
            let y = e.clientY;
            let ctx2 = this.colorGrid.current?.getContext('2d');
            let canvas = this.colorGrid.current;
            let parent = canvas?.parentElement;
            let xClick = x - ((parent?.offsetLeft ?? 0) + (canvas?.offsetLeft ?? 0));
            let yClick = y - ((parent?.offsetTop ?? 0) + (canvas?.offsetTop ??0)); 
            let imageData = ctx2?.getImageData(xClick, yClick, 1, 1).data ?? [];
            //console.log("DATA PARENT",{parentTop : parent?.offsetTop, parentLeft : parent?.offsetLeft});
            let data = {offsetParent : canvas?.offsetParent,offsetLeft : canvas?.offsetLeft, offsetTop : canvas?.offsetTop, x, y};
            console.log("MOUSE DOWN STRIP ", imageData);
            this.setColorChoosen(imageData[0] ?? 0, imageData[1] ?? 0, imageData[2] ?? 0, this.fillGradient);
        });
    };

    mouseUpStrip : {(e : any) : any} = (e : React.MouseEvent<Element, React.MouseEvent>) => {
        this.setState((prevState, props) => {
            return {prevState : Object.assign(prevState, {isDragStrip : false})};
        });
    };

    mouseMoveStrip : {(e : any) : any} = (e : React.MouseEvent) => {
        let isDrag = this.state.isDragStrip;
        if (isDrag) {
            let x = e.clientX;
            let y = e.clientY;
            let ctx2 = this.colorGrid.current?.getContext('2d');
            let imageData = ctx2?.getImageData(x, y, 1, 1).data ?? [];
            this.setColorChoosen(imageData[0], imageData[1], imageData[2], this.fillGradient);
        }
    };


    // click = (e : React.MouseEvent) => {
    //     let x = e.clientX;
    //     let y = e.clientY;
    //     let ctx2 = this.colorGrid.current?.getContext('2d');
    //     let imageData = ctx2?.getImageData(x, y, 1, 1).data ?? [];
    //     this.setColorChoosen(imageData[0], imageData[1], imageData[2], this.fillGradient);
    // };

    fillGradient = () => {
        let canvasBlock = this.colorBlock.current;
        let canvasStrip = this.colorGrid.current;
        let ctx1 = canvasBlock?.getContext('2d');
        let ctx2 = canvasStrip?.getContext('2d');
        let width1 = this.state.widthBlock;
        let height1 = this.state.heightBlock;
        if(!ctx1 || !ctx2 ) return;
        //console.log(ctx1, ctx2);
        //console.log("INIT COLOR ", {r : this.state.redCode, g : this.state.greenCode, b : this.state.blueCode});
        //console.log('WIDTH AND HEIGTH' , {width1, height1});

        ctx1.fillStyle = "rgba(" + this.state.redCode + ',' + this.state.greenCode+',' + this.state.blueCode + ',' + this.state.tranparent+')';
        ctx1.fillRect(0, 0, width1, height1);

        let grdWhite = ctx2.createLinearGradient(0, 0, width1, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        ctx1.fillStyle = grdWhite;
        ctx1.fillRect(0, 0, width1, height1);

        let grdBlack = ctx2.createLinearGradient(0, 0, 0, height1);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        ctx1.fillStyle = grdBlack;
        ctx1.fillRect(0, 0, width1, height1);
    };

    mousedown : {(e : any) : any} = (e : React.MouseEvent) => {
        console.log("mouse down");
        this.setState((prevState, props) => {
            return {prevState : Object.assign(prevState, {isDrag :true})};
        } , () => {
            this.changeColor(e);
        });
    };

    mousemove : {(e : any) : any} = (e: React.MouseEvent) => {
        let isDrag = this.state.isDrag;
        if (isDrag) {
            this.changeColor(e);
        }
    };

    mouseup : {(e : any) : any}= (e : React.MouseEvent) => {
        this.setState((prevState, props) => {
            return {prevState : Object.assign(prevState, {isDrag : false})};
        });
    };

    handleChangeTransparent = (value : number) => {
        this.setState((prevState, props) => {
            return {prevState : Object.assign(prevState, {tranparent : Math.round((value/100)*100)/ 100})};
        }, () => {
            this.returnDataParent();
        })
    };

    setColorChoosen(red : number, green : number, blue : number, callback : () => void) {
        this.setState((prevState, props) =>{
            return {prevState : Object.assign(prevState, {redCode : red, greenCode : green, blueCode : blue})};
        }, () => {
            if("function" === typeof callback ) {
                callback();
            }
            this.returnDataParent();
        }) ;
    }

    changeColorDebounce = (e : React.MouseEvent) => {
        let x = e.clientX;
        let y = e.clientY;
        let ctx1 = this.colorBlock.current?.getContext('2d');
        let canvas = this.colorBlock.current;
        let parent = canvas?.parentElement;
        let xClick = x - ((parent?.offsetLeft ?? 0) + (canvas?.offsetLeft ?? 0));
        let yClick = y - ((parent?.offsetTop ?? 0) + (canvas?.offsetTop ??0)); 
        let imageData = ctx1?.getImageData(xClick, yClick, 1, 1).data ?? [];

        //console.log(imageData);
        //console.log("DATA PARENT",{parentTop : parent?.offsetTop, parentLeft : parent?.offsetLeft});
        //let data = {offsetParent : canvas?.offsetParent,offsetLeft : canvas?.offsetLeft, offsetTop : canvas?.offsetTop, x, y};
        //console.log("MOUSE DOWN BLOCK",data,imageData);
        //console.log("CORORDINATE : " , {xClick, yClick});
        this.setColorChoosen(imageData[0], imageData[1], imageData[2], () => {});
        /*this.setState((prevState, props) => {
            prevState.rgbaColor  =  'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
        });*/
    };

    changeColor : {(e :any) : any} = throttle(this.changeColorDebounce, 100);

    returnDataParent = throttle(() => {
        this.props.returnColor({r : this.state.redCode, g : this.state.greenCode, b : this.state.blueCode});
    }, 100);

    toggleShowHideColorPicker = (val : boolean) => {
        this.setState((prevState, props) => {
            return {prevState :Object.assign(prevState, {isShow :val})};
        });
    };

    hideColorPicker = () => {
        console.log("dasdasd");
        let isShow = this.state.isShow;
        this.setState((prevState, props) => { return {prevState : Object.assign(prevState,{isShow : !isShow})}});
    };


    render() {
        return (
            <div className="color_picker" style={{width:"100%"}} onBlur={e => this.hideColorPicker()}>
                {/* <div style={{
                    backgroundColor:"white",
                    width: "175px",
                    border: "1px solid #fff",
                    padding : "5px",
                    textAlign: "center",
                }}>
                    <label htmlFor={this.props.id + "_color-input"}
                           className="cursor-pointer p-5px"
                           id="color-label"
                           style={{backgroundColor: `rgba(${this.state.redCode}, ${this.state.greenCode}, ${this.state.blueCode}, ${this.state.tranparent})`,
                                marginBottom: "0",width:"161px"
                            }}
                    >
                        {`rgba(${this.state.redCode}, ${this.state.greenCode}, ${this.state.blueCode}, ${this.state.tranparent})`}
                    </label>
                    <input type="checkbox" id={this.props.id + "_color-input"} value={this.state.isShow.toString()} onChange={e => this.toggleShowHideColorPicker(e.target.checked)}
                        style={{display :"none"}}
                    />
                </div> */}

                <div  className={"canvas-container expandInDown "} // + (!this.state.isShow ? 'hidden' : '')
                    style={{
                        padding: "5px",
                        backgroundColor: "white",
                        border: "1px solid grey",
                        zIndex : 1000,
                        height: "88px",
                        background:"#13171f",
                    }}>
                    <canvas ref={this.colorBlock}
                            className="color-picker-canvas" height="85"
                            style={{
                                marginRight:"5px",
                                cursor: "crosshair",
                                width:"200px",
                                height:"85px",
                                outline:"1px solid grey",
                            }}
                    >
                    </canvas>
                    <canvas ref={this.colorGrid}
                            className="color-picker-canvas" height="85" width="30"
                            style={{
                                cursor:"crosshair",
                                height:"85px",
                                width:"30px",
                                outline:"1px solid grey",
                            }}
                    >
                    </canvas>

                    {/* <div className="range_tranparent">
                        <label htmlFor={this.props.id + "slider_transparent"} className="control-label text-black pl-10px">
                            Transparent Value : {this.state.tranparent}</label>
                        <input type="range" min="0" id={this.props.id + "slider_transparent"} className="range_slider" max="100"
                               value={ Math.round(this.state.tranparent*100)} onChange={e => this.handleChangeTransparent(parseInt(e.target.value))}/>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default (ColorPicker);