
const objects = document.getElementsByTagName('*');
for (let i = 0; i < objects.length; i++) {
	if (objects[i].dataset && objects[i].dataset.message) {
		objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.message);
	}
}
$('#thx a').each(function (i) {
	$(this).attr('title', chrome.i18n.getMessage(`thx${i}b`));
});
$("#logo").css("background-image", `url('./_locales/${chrome.i18n.getMessage('lang')}/logo.png')`);

DB_load(() => {
	const btnSave = $('#btn-save');
const btnDel = $('#btn-del');
const btnClean = $('#btn-clean');
const btnDwnSettings = $('#btn-downloadSettings');
const res = $('#response');
const accountsTable = $('#youtubers');
const modal = $('.modal:first');


btnClean.click(() => {
	ExtensionData.newVideosCache = [];
DB_save(() => {
	err('errMsg8');
});
chrome.runtime.sendMessage({
	msg: "refresh",
	ExtensionData
});
});
btnSave.click(() => {
	$('.pref').each(function(i, value) {
	const self = $(this);
	if (self.attr('type') === 'checkbox') {
		switch (i) {
			case 0:
				ExtensionData.prefs['show_popup'] = self.is(':checked');
				break;
			case 1:
				ExtensionData.prefs['play_popup_sound'] = self.is(':checked');
				break;
			case 2:
				ExtensionData.prefs['open_in_current_tab'] = self.is(':checked');
				break;
			default:
				err('errMsg5');
		}
	} else {
		let interval = self.val();
		if (interval === '' || isNaN(interval) || interval % 1 !== 0) {
			interval = 10;
			alert(chrome.i18n.getMessage('errMsg7'));
		}

		ExtensionData.prefs['check_interval'] = parseInt(interval, 10) * 60000;
	}
});
DB_save(() => {
	err('errMsg6');
btnSave.attr('style', '');
btnSave.attr('disabled', true);
});

chrome.runtime.sendMessage({
	msg: "refresh",
	ExtensionData
});
return false;
});
btnDel.click(() => {
	const account = accountsTable.find('.tbSel').first();
ExtensionData.accounts.splice(parseInt(account.attr('id')), 1);
account.remove();
btnDel.attr('disabled', true);
btnDel.attr('style', '');
activateSaveBtn();
return false;
});
btnDwnSettings.click(() => {
	ExtensionData.newVideosCache = [];
for (let i = ExtensionData.accounts.length - 1; i >= 0; i--) {
	ExtensionData.accounts[i].newVideos = false;
}
saveSettings(JSON.stringify(ExtensionData));
return false;
});

$('.pref').each(function(i) {
	const self = $(this);
	if (self.attr('type') === 'checkbox') {
		switch (i) {
			case 0:
				self.prop('checked', ExtensionData.prefs['show_popup']);
				break;
			case 1:
				self.prop('checked', ExtensionData.prefs['play_popup_sound']);
				break;
			case 2:
				self.prop('checked', ExtensionData.prefs['open_in_current_tab']);
				break;
			default:
				err('errMsg5');
		}
		self.change(activateSaveBtn);
	} else {
		self.val(ExtensionData.prefs['check_interval'] / 60000);
		self.focus(activateSaveBtn);
	}
});

const length = ExtensionData.accounts.length;
const table = $('#youtubers table');
const columns = ['', '', ''];
let row = 0;

for (let j = 0; j < length; j++) {
	columns[row] += `<tr id="${j}"><td>► <a href="${ExtensionData.accounts[j].url}" target="_blank">${ExtensionData.accounts[j].name}</a></td></tr>`;
	row++;
	if (row > 2)
		row = 0;
}
table.eq(0).html(columns[0]);
table.eq(1).html(columns[1]);
table.eq(2).html(columns[2]);

accountsTable.find('tr').click(activateTR);

function activateTR() {
	accountsTable.find('.tbSel').first().removeClass('tbSel');
	$(this).addClass('tbSel');
	if (btnDel.attr('disabled') === 'disabled') {
		btnDel.attr('disabled', false);
		btnDel.css('background-color', 'rgb(28, 62, 151)');
	}
}

function activateSaveBtn() {
	if (btnSave.attr('disabled') === 'disabled') {
		btnSave.attr('disabled', false);
		btnSave.css('background-color', 'rgb(231, 41, 41)');
	}
	return false;
}

function err(msg) {
	res.text(chrome.i18n.getMessage(msg)).fadeOut('fast').fadeIn('fast');
}



});