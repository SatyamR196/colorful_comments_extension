//import
function getDefaultColor(key) {
    const defaults = {
        colorDefault: '#32CD32',
        colorImportant: '#FF0000',
        colorQuestion: '#3b82f6',
        colorInfo: '#01BC01',
        colorNote: '#FFD700',
        colorSpecial: '#FF69B4',
        colorMisc: '#BA55D3',
        colorComment: '#808080',
        colorTodo: '#f07705',
        bgHighlight: '#ffee3a',
        bgGrey: '#808080',
    };
    return defaults[key] || '#000000';
}

document.addEventListener('DOMContentLoaded', () => {
    const keys = [
        'colorDefault', 'colorImportant', 'colorQuestion', 'colorInfo', 'colorNote',
        'colorSpecial', 'colorMisc', 'colorComment', 'colorTodo',
        'bgHighlight', 'bgGrey'
    ];


    keys.forEach(key => {
        const input = document.getElementById(key);
        chrome.storage.sync.get([key], (data) => {
            input.value = data[key] || getDefaultColor(key);
        });
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        const newValues = {};
        keys.forEach(key => {
            newValues[key] = document.getElementById(key).value;
        });
        chrome.storage.sync.set(newValues);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'refreshColors' });
        });
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        keys.forEach(key => {
            const input = document.getElementById(key);
            input.value = getDefaultColor(key);
        });
        // document.getElementById('saveBtn').click();
    });
});
