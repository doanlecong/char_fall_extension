// Popup or content  script requesting the current status
const REQ_SNOW_STATUS : string = "REQ_SNOW_STATUS";
const SNOW_RESPONSE : string = "SNOW_STATUS";
const SNOW_TOGGLE : string = "TOGGLE_SNOW";
const SNOW_CHANGE : string = "SNOW_CHANGE";
const GET_EFFECT_ITEM : string = "GET_ITEM_EFFECT";

// Const about get current effect item to render 
const GET_CURRENT_NUM_ITEM: string = "GET_CURRENT_NUM_ITEM";
const SET_NUM_ITEM: string = "SET_NUM_ITEM";


interface SnowRequest {
    type : "REQ_SNOW_STATUS";
    snowing: boolean;
    item : string;
    num_item : number,
}

// Background script broadcasting current status
interface SnowResponse {
    type : "SNOW_STATUS";
    snowing : boolean;
    item : string;
    num_item : number,
}

// Popup requesting background script for status change
interface SnowToggle {
    type : "TOGGLE_SNOW";
    snowing : boolean;
    item: string;
    num_item : number,
}

interface SnowChange {
    type : "SNOW_CHANGE";
    snowing : boolean;
    item : string,
    num_item : number,
}

interface GetItemEffect {
    item : string,
    type : "GET_ITEM_EFFECT",
    snowing : boolean,
    num_item : number,
}

interface GetNumberItem {
    item: string,
    type: "GET_CURRENT_NUM_ITEM";
    snowing : boolean,
    num_item : number,

}



export type MessageType = SnowRequest | SnowResponse | SnowToggle | SnowChange | GetNumberItem;
export {REQ_SNOW_STATUS, SNOW_RESPONSE, SNOW_TOGGLE, SNOW_CHANGE, GET_EFFECT_ITEM, GET_CURRENT_NUM_ITEM, SET_NUM_ITEM };
export type EffectMesType = GetItemEffect | SnowChange;


