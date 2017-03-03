const objects = document.getElementsByTagName('*');
for (let i = 0; i < objects.length; i++) {
    if (objects[i].dataset && objects[i].dataset.message) {
        objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.message);
    }
}

DB_load(() => {
    $('#options').click(() => {
    openTab("options.html");
});

if (ExtensionData.accounts.length === 0) {
    $('.modal:first').remove();
    $('#novids').show();
}

let selectedAccount;
const vidContainer = $('#videos');
const userData = $('#user_data');
const updateMsg = $('.modal span');

generateSidebar();
initialize();

function initialize() {
    const length = ExtensionData.accounts.length - 1;
    const newVideos = [];
    let newVideosHTML = '';

    let currentAccount = 0;
    userData.text(chrome.i18n.getMessage('popuph2'));

    if (ExtensionData.newVideosCache.length > 0) {
        loadCache();
    } else {
        updateMsg.eq(0).text(chrome.i18n.getMessage('popupMsg1'));
        loadNewVideos(currentAccount);
    }

    function loadCache() {
        for (const cache of ExtensionData.newVideosCache) {
            if (cache) {
                newVideosHTML += generateNewVideosHTML(cache.videos, cache.accountIndex, cache.videoIndex, cache.cacheIndex);
            }
        }

        if (newVideosHTML !== '') {
            displayVideos(newVideosHTML);
        } else {
            error(3);
        }
    }

    function loadNewVideos(i) {
        updateMsg.eq(1).text(ExtensionData.accounts[i].name);
        loadVideos(ExtensionData.accounts[i].uploadsPlayListId).done(response => {
            const videos = proccessYoutubeFeed(response.items);
        let save = false;
        if (videos) {
            const account = {
                "accountName": ExtensionData.accounts[i].name,
                "accountIndex": i,
                "videos": []
            };
            for (let j = 0; j < videos.length; j++) {
                const isNew = isNewVideo(videos[j].title, i, true);
                if (isNew) {
                    save = true;
                    videos[j].isNew = true;
                    videos[j].videoIndex = j;
                    videos[j].cacheIndex = currentAccount;
                    newVideosHTML += generateNewVideosHTML([videos[j]], i, j, currentAccount);
                } else {
                    videos[j].isNew = false;
                }
                account.videos.push(videos[j]);
            }
            if (save) {
                currentAccount++;
                newVideos.push(account);
            }
        }
        if (i < length) {
            loadNewVideos(++i);
        } else {
            if (newVideos.length) {
                ExtensionData.newVideosCache = newVideos;
                DB_save(() => {
                    displayVideos(newVideosHTML);
            });
            } else {
                error(3);
            }
        }
    });
    }
}

function generateSidebar() {
    const sidebar = $('#sidebar');
    let sidebarHTML = '';
    for (let i = 0; i < ExtensionData.accounts.length; i++) {
        const account = ExtensionData.accounts[i];
        sidebarHTML += `<div class="ss" data-id="${i}"><a href="#" id="${account.uploadsPlayListId}"><img src="${account.thumbnail}"alt="${account.name}" width="60" title="${account.name}"></a></div>`;
    }
    sidebar.html(sidebarHTML);

    sidebar.find('a').each(function() {
        const self = $(this);
        const accountName = self.find('img:first').attr('title');
        const accountPlayListId = self.attr('id');
        const accountID = self.parent().data('id');

        self.off("click").click(event => {
            selectedAccount = accountID;
        $('.selected:first').removeClass('selected');
        self.parent().addClass('selected');
        loadVideos(accountPlayListId).done(response => {
            const videos = proccessYoutubeFeed(response.items);
        if (videos) {
            const html = generateSideBarVideosHTML(videos);
            userData.text(accountName);
            displayVideos(html);
        } else {
            error(1);
        }
    }).fail(() => {
            error(2);
    });
    });
    });
}

function loadVideos(uploadsPlayListId) {
    return $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        dataType: 'json',
        cache: false,
        data: {
            'part': 'snippet',
            'key': 'AIzaSyBbTkdQ5Pl_tszqJqdafAqF0mVWWngv9HU',
            'maxResults': 4,
            'playlistId': uploadsPlayListId,
            'fields': 'items(snippet,status)'
        }
    });
}


function proccessYoutubeFeed(data) {
    const videos = [];
    if (data === undefined) {
        return false;
    }

    let snippets;
    const youtubeVideoUrl = 'https://www.youtube.com/watch?v=';

    for (let i = 0; i < data.length; i++) {

        snippets = data[i];
        for (const key in snippets) {
            if (snippets.hasOwnProperty(key)) {
                const snippet = snippets[key];

                videos.push({
                    "id": i,
                    "title": snippet.title,
                    "url": youtubeVideoUrl + snippet.resourceId.videoId,
                    "thumbnail": snippet.thumbnails.medium.url,
                    "description": snippet.description,
                    "author": snippet.channelTitle
                });
            }
        }

    }
    return videos;
}

function displayVideos(videos) {
    vidContainer.fadeOut('fast', () => {
        vidContainer.html(videos).promise().done(() => {
        activateVideos();
    activateRightClick();
    vidContainer.fadeIn('fast');
});
});
}

function activateRightClick() {
    $('.vid').each(function(i) {
        $(this).off('mousedown').on('mousedown', e => {
            if (e.which === 3) {
            triggerClick(e.target, {
                markingVideoAsWatched: false,
                rightClick: true
            });
        }
    });
    });
}

function triggerClick(el, params) {
    let elem = $(el);
    if (params.markingVideoAsWatched)//quick fix
        elem = elem.siblings('div');

    elem.trigger('click', params);
}

function generateNewVideosHTML(videos, onlyNew) {
    let html = '';
    for (let i = 0; i < videos.length; i++) {
        if (!videos[i].isNew) {
            continue;
        }
        html += `<div class="container"><div class="vid" data-videourl="${videos[i].url}" data-videoindex="${videos[i].videoIndex}" data-cacheindex="${videos[i].cacheIndex}" data-accountindex="${onlyNew}" title="${chrome.i18n.getMessage('popup_tooltip')} ${videos[i].author}" ><a href="#"><img src="${videos[i].thumbnail}" alt="${videos[i].title}" class="wrap thumb"><span class="t">${videos[i].title}</span><span class="description">${videos[i].description.substring(0, 120)}</span></a></div><span class="details">${chrome.i18n.getMessage('uploadedBy')} <i>${videos[i].author}</i></span><button class="details">${chrome.i18n.getMessage('contextMenu')}</button></div>`;
    }
    return html;
}

function generateSideBarVideosHTML(videos) {
    let html = '';
    for (let i = 0; i < videos.length; i++) {
        html += `<div class="container"><div class="vid" data-videourl="${videos[i].url}" data-videoid="${videos[i].id}" ><a href="#"><img src="${videos[i].thumbnail}" alt="${videos[i].title}" class="wrap thumb"><span class="t">${isNewVideo(videos[i].title)}</span><span class="description">${videos[i].description.substring(0, 120)}</span></a></div></div>`;
    }
    return html;
}

function activateVideos() {
    $('.vid').each(function(i) {
        if (selectedAccount !== undefined) {
            activateSideBarVideos(this, i);
        } else {
            activateNewVideos(this);
        }
    });
}

function activateNewVideos(_this) {
    const self = $(_this);

    self.off('click').click({markingVideoAsWatched: false, rightClick: false}, (event, params) => {
        params = params || event.data;

    const title = self.find('.t:first').text();
    const url = self.data("videourl");
    const videoIndex = self.data('videoindex');
    const accountIndex = self.data('accountindex');
    const cacheIndex = self.data('cacheindex');
    const currentVideos = ExtensionData.accounts[accountIndex].videoTitles;
    const freshVideos = ExtensionData.newVideosCache[cacheIndex].videos;

    for (let i = 0; i < currentVideos.length; i++) {
        for (let k = 0; k < freshVideos.length; k++) {
            if (currentVideos[i] === freshVideos[k].title && i !== k) {
                const temp = currentVideos[k];
                currentVideos[k] = currentVideos[i];
                currentVideos[i] = temp;
            }
        }
    }
    currentVideos[videoIndex] = title;
    ExtensionData.accounts[accountIndex].videoTitles = currentVideos;
    ExtensionData.newVideosCache[cacheIndex].videos[videoIndex].isNew = false;
    chrome.browserAction.getBadgeText({}, result => {
        const update = parseInt(result) - 1;
    chrome.browserAction.setBadgeText({
        text: update > 0 ? update.toString() : ''
    });
});
    DB_save(() => {
        if (!params.markingVideoAsWatched) {
        openTab(url, params.rightClick);
    } else {
        self.parent().fadeOut('fast');
    }
});
});
    $('button.details').each(function() {
        $(this).off('click').click(e => {
            triggerClick(e.target, {
            markingVideoAsWatched: true,
            rightClick: false
        });
    });
    });
}

function activateSideBarVideos(_this, number) {
    const self = $(_this);
    const title = self.find('.title:first').text();
    const url = self.data("videourl");
    if (self.find('.newVid').length > 0) {
        self.off('click').click({markingVideoAsWatched: false, rightClick: false}, (event, params) => {
            params = params || event.data;

        const currentVideos = ExtensionData.accounts[selectedAccount].videoTitles;
        const freshVideos = document.getElementsByClassName('title');
        for (var i = 0; i < currentVideos.length; i++) {
            for (let k = 0; k < freshVideos.length; k++) {
                if (currentVideos[i] === freshVideos[k].innerHTML && i !== k) {
                    const temp = currentVideos[k];
                    currentVideos[k] = currentVideos[i];
                    currentVideos[i] = temp;
                }
            }
        }
        currentVideos[number] = title;
        ExtensionData.accounts[selectedAccount].videoTitles = currentVideos;

        try {
            for (var i = 0; i < ExtensionData.newVideosCache.length; i++) {
                for (const videos of ExtensionData.newVideosCache[i].videos) {
                    if (videos.title === title) {
                        ExtensionData.newVideosCache[i].videos[j].isNew = false;
                        break;
                    }
                }
            }
        } catch (e) {
            console.warn(`Could not update cache. Error: ${e.message}`);
        }

        chrome.browserAction.getBadgeText({}, result => {
            const update = parseInt(result) - 1;
        chrome.browserAction.setBadgeText({
            text: update > 0 ? update.toString() : ''
        })
    });

        DB_save(() => {
            if (!params.markingVideoAsWatched) {
            openTab(url, params.rightClick);
        } else {
            self.parent().fadeOut('fast');
        }
    });
    });

    } else {
        self.off('click').click({markingVideoAsWatched: false, rightClick: false}, (event, params) => {
            params = params || event.data;

        if (!params.markingVideoAsWatched) {
            openTab(url, params.rightClick);
        } else {
            alert(chrome.i18n.getMessage('contextMenuMsg'));
        }
    });
    }
}
function isNewVideo(title, account=selectedAccount, bool) {
    const tit = ExtensionData.accounts[account].videoTitles;
    const newTxt = chrome.i18n.getMessage('newTxt');

    for (let i = 0; i < tit.length; i++) {
        if (tit[i] === title) {
            return bool ? false : `<span class="title">${title}</span>`;
        }
    }
    return bool ? true : `<span class="title">${title}</span> <span class="newVid">(${newTxt})</span>`;
}
function error(errNum) {
    vidContainer.fadeOut('fast', function() {
        $(this).html(

            getErrorTxt({
                header: `popupE${errNum}_H`,
                msg: `popupE${errNum}_B`
            })

        ).fadeIn('fast');
    });
}
function getErrorTxt(msg) {
    return `<div class="error"><h1>${chrome.i18n.getMessage(msg.header)}</h1><p>${chrome.i18n.getMessage(msg.msg)}</p></div>`;
}


function openTab(url, rightClick) {



    const openInNewTab = (rightClick ? ExtensionData.prefs['open_in_current_tab'] : !ExtensionData.prefs['open_in_current_tab']);

    if (openInNewTab) {
        chrome.tabs.query({
            'active': true
        }, tabs => {
            chrome.tabs.update(tabs[0].id, {
            url
        });
        window.close();
    });
    } else {
        chrome.tabs.create({
            url
        });
    }
}
});