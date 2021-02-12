// This file is ran as a background script
import {MessageType, REQ_SNOW_STATUS, SNOW_RESPONSE,
        SNOW_TOGGLE, SNOW_CHANGE, GET_CURRENT_NUM_ITEM, SET_NUM_ITEM, 
        GET_BACKGROUND_DATA,
        CHANGE_BACKGROUND_DATA, BackgroundData, GET_BACKGROUND_DATA_CONTENT} from "./type";

import {sendSnowStatus, sendSnowChange, sendCurrentNumItem, sendDataBackgroundToPopup, sendDataBackgroundChangeToContent} from "./send_data";

let snowing = false;
let itemEffect = '';
let numberItem = 10;
let dataBackground = {};


// Get locally stored value
chrome.storage.local.get("snowing", (res) => {
    if(res['snowing']) {
        snowing = true;
    } else {
        snowing = false;
    }
});

chrome.storage.local.get('item_effect', (res) => {
    if(res['item_effect']) {
        itemEffect = res['item_effect'];
    } else {
        itemEffect = "♥";
    }
});

chrome.storage.local.get("num_item", (res) => {
    if(res['num_item']) {
        numberItem = res['num_item'];
    }
});

chrome.storage.local.get('data_background', (res) => {
    if(res['data_background']) {
        dataBackground = res['data_background'];
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


chrome.runtime.onMessage.addListener((message : MessageType) => {
    console.log(message); 
    switch(message.type) {
        case REQ_SNOW_STATUS : 
            sendSnowChange(snowing, itemEffect, SNOW_RESPONSE, numberItem);
            break;
        case SNOW_TOGGLE : 
            snowing = message.snowing;
            chrome.storage.local.set({snowing: snowing});
            sendSnowStatus(snowing);
            break;

        case SNOW_CHANGE : 
            itemEffect = message.item;
            snowing = message.snowing;
            chrome.storage.local.set({item_effect : itemEffect, snowing: snowing});
            snowing = message.snowing;
            sendSnowChange(snowing, itemEffect)
            break;
        case GET_CURRENT_NUM_ITEM: 
            sendCurrentNumItem(numberItem, GET_CURRENT_NUM_ITEM, false);
            break;

        case SET_NUM_ITEM : 
            numberItem = message.num_item;
            chrome.storage.local.set({num_item : numberItem});
            sendCurrentNumItem(numberItem, SET_NUM_ITEM, true);
            break;
        default : 
            break;
    }
});


chrome.runtime.onMessage.addListener((message : BackgroundData) => {
    console.log(message); 
    switch(message.type) {
        case GET_BACKGROUND_DATA : 
            sendDataBackgroundToPopup(GET_BACKGROUND_DATA, dataBackground);
            break;

        case CHANGE_BACKGROUND_DATA: 
            let dataBgChange = message.data;
            chrome.storage.local.set({data_background : dataBgChange});
            sendDataBackgroundChangeToContent(GET_BACKGROUND_DATA_CONTENT,dataBgChange);
            break;

        case GET_BACKGROUND_DATA_CONTENT: 
            sendDataBackgroundChangeToContent(GET_BACKGROUND_DATA_CONTENT, dataBackground);
            break;
        default : 
            break;
    }
})