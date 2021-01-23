// This file is ran as a background script
import {MessageType, REQ_SNOW_STATUS, SNOW_RESPONSE, SNOW_TOGGLE, SNOW_CHANGE, GET_CURRENT_NUM_ITEM, SET_NUM_ITEM} from "./type";


const sendMessageToTab = (message : any) => {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if(tab.id) {
                chrome.tabs.sendMessage(tab.id, message);
            }
        })
    });
};

const sendSnowStatus = (snowing : boolean)  => {
    const message = {type : SNOW_RESPONSE, snowing};
    
    // send message to popup
    chrome.runtime.sendMessage({type : SNOW_RESPONSE, snowing: snowing});

    // send message to every active tab
    sendMessageToTab(message);
};


const sendSnowChange = (snowing : boolean, itemEffect :string, type ? : string, num_item ?: number) => {
    let message = {
        type : type || SNOW_CHANGE, 
        snowing: snowing,
        item: itemEffect
    };

    if(num_item) {
       Object.assign(message, {num_item : num_item}); 
    }

    chrome.runtime.sendMessage(message);
    sendMessageToTab(message);
}

const sendCurrentNumItem = (numberItem : number, type : string ,sendTab : boolean = false) => {
    let message = {
        type : type,
        num_item: numberItem,
    }
    chrome.runtime.sendMessage(message);

    if(sendTab) {
        sendMessageToTab(message);
    }
}



let snowing = false;
let itemEffect = '';
let numberItem = 10;

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
        default : 
            break;
    }
});