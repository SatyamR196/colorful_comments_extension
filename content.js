//* Add the class(.) or id(#) of the container that contains all the code line elements
const commentSelectors = [
    '.ace_comment', // OneCompiler, onlinegdb
    '.mtk9',        // Maang.in (dark mode)
    '.mtk8',        // Maang.in (light mode)
    // Add more selectors here as needed
];

const commentPrefixes = [
  '//',   // C-style
  '#',    // Python-style
  '--',   // SQL, Lua
  '%',    // MATLAB
  ';',    // Lisp, Assembly
  '\'',   // Visual Basic
  'REM',  // Batch
];

function getPrefixMatch(text, prefixes) {
    for (const prefix of prefixes) {
        if (text.startsWith(`${prefix}!`)) return { type: 'important', prefix };
        if (text.startsWith(`${prefix}?`)) return { type: 'question', prefix };
        if (text.startsWith(`${prefix}*`)) return { type: 'info', prefix };
        if (text.startsWith(`${prefix}^`)) return { type: 'note', prefix };
        if (text.startsWith(`${prefix}&`)) return { type: 'special', prefix };
        if (text.startsWith(`${prefix}~`)) return { type: 'misc', prefix };
        if (text.startsWith(`${prefix}-`)) return { type: 'hr', prefix };
        if (text.startsWith(`${prefix}#`)) return { type: 'grey', prefix };
        if (text.startsWith(`${prefix}_`)) return { type: 'highlight', prefix };
        if (text.startsWith(`${prefix}/`)) return { type: 'comment', prefix };
        if (text.startsWith(`${prefix}`)) return { type: 'default', prefix };
    }
    return null;
}

function colorComments(colors) {
    const elements = commentSelectors
        .flatMap(selector => Array.from(document.querySelectorAll(selector)));

    elements.forEach(el => {
        const text = el.textContent.trim();
        // const parent = el.parentElement;
        console.log("COLOR COMMENTS", text, colors);

        //! Basic styles
        // el.style.fontFamily = 'monospace';
        el.style.fontWeight = '900';

        //^ Reset styles first
        el.style.color = '';
        // if (parent) parent.style.backgroundColor = '';

        const match = getPrefixMatch(text, commentPrefixes);
        if (!match) return;

        //& Apply based on prefix
        switch (match.type) {
            case 'default' :
                el.style.color =  colors.colorDefault || 'limegreen';
                break;
            case 'comment' :
                el.style.color = colors.colorComment || 'grey';
                break;
            case 'highlight':
                el.style.backgroundColor = colors.bgHighlight || '#ffee3a';
                break;
            case 'grey':
                el.style.backgroundColor = colors.bgGrey || 'grey';
                break;
            case 'hr':
                if (!el.dataset.decorated) {
                    el.innerText = `${match.prefix}- ---------------------------------------------------------------------`;
                    el.style.backgroundColor = colors.bgHighlight || '#ffee3a';
                    el.dataset.decorated = "true";
                }
                break;
            case 'important':
                el.style.color = colors.colorImportant || 'red';
                break;
            case 'question':
                el.style.color = colors.colorQuestion || '#3b82f6';
                break;
            case 'info':
                el.style.color = colors.colorInfo || 'green';
                break;
            case 'note':
                el.style.color = colors.colorNote || 'gold';
                break;
            case 'special':
                el.style.color = colors.colorSpecial || 'hotpink';
                break;
            case 'misc':
                el.style.color = colors.colorMisc || 'mediumorchid';
                break;
            default:
                el.style.color = colors.colorDefault || 'green';
                break;
        }
        
        if (text.toUpperCase().includes('TODO')) {
            el.style.color = colors.colorTodo || '#f07705';
        }
    });
}

const observer = new MutationObserver(() => {
    chrome.storage.sync.get(null, colorComments);
});

//* Add the class(.) or id(#) of the container that contains all the code line elements
const editorSelectors = [
    '.ace_layer.ace_text-layer', // OneCompiler, OnlineGDB
    '.view-lines',               // Maang.in
    // Add more selectors here as needed
];

// Wait for the editor to be available
function startObserving() {
    const targets = editorSelectors
        .map(selector => document.querySelector(selector))
        .filter(Boolean); // removes null values if selector not found

    if (targets.length > 0) {
        targets.forEach(target => {
            observer.observe(target, { childList: true, subtree: true, characterData: true });
        });
        chrome.storage.sync.get(null, colorComments); 
    } else {
        setTimeout(startObserving, 500);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'refreshColors') {
        chrome.storage.sync.get(null, colorComments);
    }
});

startObserving();
