DB_load(upgrade => {
	if (upgrade) {
		upgradeInit();
	}
	else {
		init();
}
function init() {
	if (ExtensionData.isNewInstall) {
		getYoutuber('UUZgwLCu6tSLEUJ30METhJHg').done(response => {
			ExtensionData.accounts[0].videoTitles = getVideoTitles(response);
		ExtensionData.isNewInstall = false;

	});
	} ;

	let totalNewVideos = 0;
	let newVideosHash = '';
	let oldVideosHash = '';
	let currentAccount = 0;
	let newVideos = [];

	checkNewVideos(currentAccount);

	function checkNewVideos(count) {
		DB_load(() => {
			const account = ExtensionData.accounts[count];
		getYoutuber(account.uploadsPlayListId, true).done(response => {
			const newVideosCount = compareVideos(getVideoTitles(response.items), account.videoTitles);
		let save = false;
		if (newVideosCount) {
			ExtensionData.accounts[count].newVideos = true;
			totalNewVideos += newVideosCount;
			newVideosHash += account.name + totalNewVideos;

			const videos = proccessYoutubeFeed(response.items);
			const _account = {
				"accountName": ExtensionData.accounts[count].name,
				"accountIndex": count,
				"videos": []
			};

			for (let j = 0; j < videos.length; j++) {
				const isNew = isNewVideo(videos[j].title, count);
				if (isNew) {
					save = true;
					videos[j].isNew = true;
					videos[j].videoIndex = j;
					videos[j].cacheIndex = currentAccount;
				} else {
					videos[j].isNew = false;
				}

				_account.videos.push(videos[j]);
			}

			if (save) {
				currentAccount++;
				newVideos.push(_account);
			}

		} else {
			ExtensionData.accounts[count].newVideos = false;
		}
		if (count < ExtensionData.accounts.length - 1) {
			checkNewVideos(++count);
		} else {
			if (totalNewVideos) {
				chrome.browserAction.setBadgeText({
					text: totalNewVideos.toString()
				});
				if (oldVideosHash !== newVideosHash) {
					ExtensionData.newVideosCache = newVideos;
					oldVideosHash = newVideosHash;
				}
				newVideos = [];
				newVideosHash = '';
				totalNewVideos = 0;
				currentAccount = 0;
			}
			DB_save(keepCheking);
		}
	});
	});
	}

	function keepCheking() {
		setTimeout(() => {
			checkNewVideos(currentAccount);
	}, ExtensionData.prefs['check_interval']);
	}

	function getVideoTitles(data) {
		const result = [];
		let snippets;

		for (let i = 0; i < data.length; i++) {
			snippets = data[i];
			for (const key in snippets) {
				if (snippets.hasOwnProperty(key)) {
					const snippet = snippets[key];
					if (snippet.title !== undefined) {
						result.push(snippet.title);
					}
				}
			}

		}
		return result;
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
						"author": snippet.channelTitle,
					});
				}
			}

		}
		return videos;
	}

	function compareVideos(a, b) {
		const length = a.length;
		let diff = 0;
		for (let i = 0; i < length; i++) {
			let add = 1;
			for (let j = 0; j < length; j++) {
				if (a[i] === b[j]) {
					add = 0;
					break;
				}
			}
			diff += add;
		}
		return diff;
	}

	function isNewVideo(title, account) {
		const tit = ExtensionData.accounts[account].videoTitles;
		for (let i = 0; i < tit.length; i++) {
			if (tit[i] === title) {
				return false;
			}
		}
		return true;
	}

	chrome.runtime.onMessage.addListener(
		(request, sender, sendResponse) => {
		switch (request.msg) {
	case "loadData":
		sendResponse({
			channels: ExtensionData.accounts,
			translation: {
				btnAddTxt: translate('YtModBtnAddTxt'),
				btnAddedTxt: translate('YtModBtnAddedTxt'),
				btnAddingTxt: translate('YtModBtnAddingTxt'),
				errMsg: translate('YtModErrMsg')
			}
		});
		break;
	case "addYoutuber":

		addYoutuberFromMod(request.username, sendResponse);
		sendResponse({
			isError: false,
			error: ''
		});

		break;

	case "refresh":
		ExtensionData = request.ExtensionData;
		break;
	default:
		console.log("unkown request");
	}
});

	function translate(string) {
		return chrome.i18n.getMessage(string);
	}

	function addYoutuberFromMod(userName, response) {

		getYoutuber(userName, false).done(res => {

			const channel = res.items[0];
		const uploadsPlayListId = channel.contentDetails.relatedPlaylists.uploads;

		getYoutuber(uploadsPlayListId, true).done(response => {
			ExtensionData.accounts.push({
			'id': channel.id,
			'name': channel.snippet.title,
			'thumbnail': channel.snippet.thumbnails.default.url,
			'videoTitles': getVideoTitles(response.items),
			'newVideos': false,
			'url': `https://www.youtube.com/channel/${channel.id}`,
			'uploadsPlayListId': uploadsPlayListId
		});

		DB_save(() => {
			sendMsg({
				isError: false,
				error: ''
			});
	});

	}).fail(Fail);

	}).fail(Fail);

		function Fail(error) {
			sendMsg({
				isError: true,
				error
			});
		}

		function sendMsg(obj){
			chrome.tabs.query({active: true, currentWindow: true}, tabs => {
				chrome.tabs.sendMessage(tabs[0].id, obj);
		});
		}
	}

}

function upgradeInit() {

	let channel;
	let name;
	let id;

	(function upgradeChannels(iii) {
		id = ExtensionData.accounts[iii].id;
		name = ExtensionData.accounts[iii].name;

		id = (id.substring(0, 2) !== 'UC') ? `UC${id}` : id;

		getYoutuber(id, false).done(response => {

			channel = response.items[0];
		ExtensionData.accounts[iii].uploadsPlayListId = channel.contentDetails.relatedPlaylists.uploads;
		ExtensionData.accounts[iii].id = id;

		if (iii < ExtensionData.accounts.length - 1) {
			return upgradeChannels(++iii);
		} else {
			DB_save();
			init();
			return true;
		}

	}).fail((jqXHR, textStatus, error) => {
			if (jqXHR.status === 404) {
			ExtensionData.accounts[iii].uploadsPlayListId = null;
			ExtensionData.accounts[iii].id = id;
			console.error(`No uploads playlist id found for${ExtensionData.accounts[iii].name}`);
			return true;
		} else if (jqXHR.status === 500) {
			return upgradeChannels(iii);
		} else {
			const err = `Youtube Feed Ext FATAL UPGRADE ERROR:${textStatus}`;
			console.error(err);
			window.alert(err);
		}
	});
	})(0);

}

function getYoutuber(account, getVideos) {
	let url = 'https://www.googleapis.com/youtube/v3/';
	const params = {
		'part': 'snippet',
		'key': 'AIzaSyBbTkdQ5Pl_tszqJqdafAqF0mVWWngv9HU'
	};
	if (getVideos) {
		url += 'playlistItems';
		params.maxResults = 4;
		params.playlistId = account;
		params.fields = 'items(snippet,status)';
	} else {
		params.id = account;
		params.part += ',contentDetails';
		url += 'channels';
	}

	return $.ajax({
		url,
		dataType: 'json',
		cache: false,
		data: params
	});
}

});