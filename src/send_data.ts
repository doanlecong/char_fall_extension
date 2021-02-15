import {MessageType, REQ_SNOW_STATUS, SNOW_RESPONSE,
    SNOW_TOGGLE, SNOW_CHANGE, GET_CURRENT_NUM_ITEM, SET_NUM_ITEM, 
    GET_BACKGROUND_DATA} from "./type";

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


const sendDataBackgroundToPopup = (type : string, data : any) => {
    let message = {
        type : type,
        data : data,
    };

    chrome.runtime.sendMessage(message);
}

const sendDataBackgroundChangeToContent = (type : string, data : any) => {
    let message = {
        type : type,
        data : data,
    };
    
    sendMessageToTab(message);
}



const sendInitialDataTopPopup = (type : string, data : any) => {
    let message = {
        type : type,
        data : data,
    }
    chrome.runtime.sendMessage(message);
}

const sendInitialDataToContent = (type : string, data : any) => {
    let message = {
        type : type,
        data : data,
    }
    sendMessageToTab(message);
} 

const sendChangeEffectToContent = (type : string, data : any) => {
    let message = {
        type : type,
        data : data,
    }
    sendMessageToTab(message);
}

const sendChangeBackgroundToContent = (type : string, data : any) => {
    let message = {
        type : type,
        data : data,
    }
    sendMessageToTab(message);
}

export {
    sendSnowStatus , 
    sendSnowChange, 
    sendCurrentNumItem, 
    sendDataBackgroundToPopup, 
    sendDataBackgroundChangeToContent,
    sendInitialDataTopPopup,
    sendChangeEffectToContent,
    sendChangeBackgroundToContent,
    sendInitialDataToContent}