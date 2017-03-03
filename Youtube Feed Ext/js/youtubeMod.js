chrome.runtime.sendMessage({
    msg: "loadData"
}, response => {
    init(response);
});

function init(response) {
    const channels = response.channels;
    const translation = response.translation;
    let isNewYoutuber = true;
    let onWatchPage = true;
    let userName = null;

    if (window.location.href.includes('watch?v=')) {
        userName = document.getElementsByClassName('yt-user-info')[0];
        userName = userName.getElementsByTagName('a')[0];
        userName = userName.getAttribute('data-ytid');
        userName = userName.trim();
    } else {
        onWatchPage = false;
        userName = document.getElementsByClassName('yt-uix-subscription-button')[0];
        userName = userName.getAttribute('data-channel-external-id');
        userName = userName.trim();
    }
    if (userName === null || userName === undefined) {
        console.log("Youtube Feed Ext Mod Error: Could not find username");
        return;
    }

    for (let i = channels.length - 1; i >= 0; i--) {
        if (userName === channels[i].id) {
            isNewYoutuber = false;
            break;
        }
    }

    const addBtn = document.createElement('button');
    addBtn.setAttribute('class', 'yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon yt-uix-button-subscribe-branded');
    addBtn.setAttribute('style', 'background-image: linear-gradient(to top, rgba(199, 26, 166, 1) 0px, rgba(230, 34, 200, 1) 100%); margin-right: 12px;');

    const addBtnSpanEl = document.createElement('span');
    addBtnSpanEl.setAttribute('style', 'margin-left:5px;');
    let addBtnTxt;

    if (isNewYoutuber) {
        addBtnTxt = document.createTextNode(translation.btnAddTxt);
        addBtn.addEventListener('click', addYoutuber);
    } else {
        addBtnTxt = document.createTextNode(translation.btnAddedTxt);
        addBtn.setAttribute('disabled', 'disabled');
    }
    addBtnSpanEl.appendChild(addBtnTxt);
    addBtn.appendChild(addBtnSpanEl);

    const containerClass = onWatchPage ? '' : ' with-preferences';
    const container = document.getElementsByClassName(`yt-uix-button-subscription-container${containerClass}`)[0];
    const susBtn = container.getElementsByTagName('button')[0];
    container.insertBefore(addBtn, susBtn);

    function addYoutuber() {
        let modal = document.getElementById('myY-modal');
        if (modal) {
            modal.setAttribute('style', '');
        } else {
            modal = document.createElement('div');
            modal.setAttribute('class', 'modal');
            modal.setAttribute('id', 'myY-modal');

            const modalContent = document.createElement('div');
            modalContent.setAttribute('style', 'font-weight: bolder');
            modalContent.textContent = translation.btnAddingTxt;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        }

        chrome.runtime.sendMessage({
            msg: "addYoutuber",
            username: userName
        });

        chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
            if (response.isError === false) {
            addBtn.setAttribute('disabled', 'disabled');
            addBtn.removeEventListener('click', addYoutuber, false);
            addBtnSpanEl.textContent = translation.btnAddedTxt;
        } else {
            window.alert(translation.errMsg);
            console.log(`Youtube Feed Ext Error: ${response.error}`);
        }
        document.getElementById('myY-modal').setAttribute('style', 'display:none');
    });
    }

}