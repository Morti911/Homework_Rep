const ExtensionDataName = 'content';

let ExtensionData = {
    dataVersion: 3.1,
    accounts: [
        {
            id: "PLY4rE9dstrJzrDaSPKOrhNgQ19GhVl19u",
            name: "Loftblog",
            thumbnail: "https://yt3.ggpht.com/-w0z0fiKv614/AAAAAAAAAAI/AAAAAAAAAAA/zbjqOMkdtMg/s900-c-k-no-mo-rj-c0xffffff/photo.jpg",
            videoTitles: [],
            newVideos: false,
            url: "https://www.youtube.com/channel/UCIIt69f5D44s2cdb9vXQNzA",
            uploadsPlayListId: "PLY4rE9dstrJzrDaSPKOrhNgQ19GhVl19u"
        }
    ],
    prefs: {
        "show_popup": true,
        "play_popup_sound": true,
        "check_interval": 600000,
        "open_in_current_tab": true
    },
    isNewInstall: true,
    newVideosCache: []
};

function DB_setValue(name, value, callback) {
    const obj = {};
    obj[name] = value;
    chrome.storage.local.set(obj, () => {
        if(callback) callback();
});
}

function DB_load(callback) {
    let upgrade = false;
    chrome.storage.local.get(ExtensionDataName, r => {
        if (isEmpty(r[ExtensionDataName])) {
        DB_setValue(ExtensionDataName, ExtensionData, callback);
    } else if (r[ExtensionDataName].dataVersion != ExtensionData.dataVersion) {
        upgrade = true;
        r[ExtensionDataName].isNewInstall = false;
        r[ExtensionData].newVideosCache = [];
        r[ExtensionDataName].accounts[0] = ExtensionData.accounts[0];
        DB_setValue(ExtensionDataName, ExtensionData, callback);
    } else {
        ExtensionData = r[ExtensionDataName];
    }
    callback(upgrade);
});
}

function DB_save(callback) {
    DB_setValue(ExtensionDataName, ExtensionData, callback);
}

function DB_clear(callback) {
    chrome.storage.local.remove(ExtensionDataName, () => {
        if(callback) callback();
});
}

function isEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}