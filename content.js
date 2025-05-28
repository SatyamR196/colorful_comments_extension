function applyStyles(commentClass) {

}

function colorComments(colors) {
    document.querySelectorAll('.ace_comment').forEach(el => {
        const text = el.textContent.trim();
        // const parent = el.parentElement;

        //! Basic styles
        el.style.fontFamily = 'monospace';
        el.style.fontWeight = '900';

        //^ Reset styles first
        el.style.color = '';
        // if (parent) parent.style.backgroundColor = '';

        //& Apply based on prefix
        if (text.startsWith('//_') && parent) {
            // parent.style.backgroundColor = colors.bgHighlight || '#ffee3a';
            el.style.backgroundColor = colors.bgHighlight || '#ffee3a';
        } else if (text.startsWith('//#') && parent) {
            // parent.style.backgroundColor = colors.bgGrey || 'grey';
            el.style.backgroundColor = colors.bgGrey || 'grey';
        }

        console.log("HELLO WOLRD");
        if (text.startsWith('//-') && !el.dataset.decorated) {
            el.innerText = '//- ---------------------------------------------------------------------';
            el.style.backgroundColor = colors.bgHighlight || '#ffee3a';
            el.dataset.decorated = "true"; // mark it processed
        }


        if (text.startsWith('//!')) el.style.color = colors.colorImportant || 'red';
        else if (text.startsWith('//?')) el.style.color = colors.colorQuestion || '#3b82f6';
        else if (text.startsWith('//*')) el.style.color = colors.colorInfo || 'green';
        else if (text.startsWith('//^')) el.style.color = colors.colorNote || 'gold';
        else if (text.startsWith('//&')) el.style.color = colors.colorSpecial || 'hotpink';
        else if (text.startsWith('//~')) el.style.color = colors.colorMisc || 'mediumorchid';
        else if (text.startsWith('///')) el.style.color = colors.colorComment || 'grey';
        else if (text.toUpperCase().includes('TODO')) el.style.color = colors.colorTodo || '#f07705';
        else el.style.color =  colors.colorDefault || 'limegreen';
    });
}

const observer = new MutationObserver(() => {
    chrome.storage.sync.get(null, colorComments);
});

// Wait for the editor to be available
function startObserving() {
    const target = document.querySelector('.ace_layer.ace_text-layer');
    if (target) {
        observer.observe(target, { childList: true, subtree: true, characterData: true });
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
