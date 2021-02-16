// This file is ran as a background script
import {
    CHANGE_BACKGROUND_DATA,
    GET_INITIAL_DATA, 
    CHANGE_EFFECT_DATA, 
    GET_INITIAL_DATA_CONTENT} from "./type";

import {
    sendInitialDataTopPopup,
    sendChangeEffectToContent,
    sendChangeBackgroundToContent,
    sendInitialDataToContent} from "./send_data";

let snowing = false;
let itemEffect = '';
let numberItem = 10;
let dataBackground = {};


// Get locally stored value 
const getSimpleVar = (nameVar : string) => {
    if(nameVar == 'num_item') {
        chrome.storage.sync.get("num_item", (res) => {
            if(res['num_item']) {
                numberItem = res['num_item'];
            } else {
                numberItem = 12;
            }
        });
        return numberItem;
    }
    
    if(nameVar == 'item_effect') {
        chrome.storage.sync.get('item_effect', (res) => {
            if(res['item_effect']) {
                itemEffect = res['item_effect'];
            } else {
                itemEffect = "♥";
            }
        });
        return itemEffect;
    }

    if(nameVar == 'snowing') {
        chrome.storage.sync.get("snowing", (res) => {
            if(res['snowing']) {
                snowing = true;
            } else {
                snowing = false;
            }
        });
        return snowing;
    }

    return null;
}


const getDataBg = () => {
    chrome.storage.sync.get('data_background', (res) => {
        if(res['data_background']) {
            dataBackground = res['data_background'] && Object.keys(res['data_background']).length === 0 && res['data_background'].constructor === Object ? {} : JSON.parse(res['data_background']);
        } else {
            // set default data background
            dataBackground = {
                tab : "solid_tab",
                transparent : 50,
                active : false,
                dataColor : null,
            }    
        }
    });
    return dataBackground;
}


chrome.runtime.onMessage.addListener((message : {type : string, data: any}) => {
    console.log("Listen for initial data of popup",message);
    switch(message.type) {
        case GET_INITIAL_DATA : 
            let objDataSend = {
                dataEffect : {
                    activeEffect : getSimpleVar('snowing'),
                    currentItem  : getSimpleVar('item_effect'),
                    numItem      : getSimpleVar('num_item'), 
                },
                dataBackground   : getDataBg()
            }
            //console.log("DATA INIT POPUP", objDataSend);
            sendInitialDataTopPopup(message.type, objDataSend);
            break;

        case CHANGE_EFFECT_DATA : 
            let data = message.data;
            chrome.storage.sync.set({
                snowing : data.activeEffect,
                item_effect : data.currentItem,
                num_item : data.numItem
            });

            sendChangeEffectToContent(message.type ,data);
            break;

        case CHANGE_BACKGROUND_DATA : 
            //console.log("CHANGE BG ", message.data);
            chrome.storage.sync.set({data_background : JSON.stringify(message.data)});
            sendChangeBackgroundToContent(message.type ,message.data);
            break;
        
        case GET_INITIAL_DATA_CONTENT: 
            // chuan bi tong hop data can thiet cho content chay
            let objDataSet = {
                dataEffect : {
                    activeEffect : getSimpleVar('snowing'),
                    currentItem  : getSimpleVar('item_effect'),
                    numItem      : getSimpleVar('num_item'), 
                },
                dataBackground   : getDataBg()
            }
            //console.log(GET_INITIAL_DATA_CONTENT , objDataSet);

            sendInitialDataToContent(message.type, objDataSet);

            break;
        default: 
            break;
    }
});