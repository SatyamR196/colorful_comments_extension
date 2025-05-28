



function colorComments() {
    document.querySelectorAll('.ace_comment').forEach(el => {
        const text = el.textContent.trim();
        const parent = el.parentElement;

        //! Basic styles
        el.style.fontFamily = 'monospace';
        el.style.fontWeight = '900';

        //^ Reset styles first
        el.style.color = '';
        if (parent) parent.style.backgroundColor = '';

        //& Apply based on prefix
        if (text.startsWith('//_')) {
            if (parent) parent.style.backgroundColor = '#ffee3a';
        } else if (text.startsWith('//#')) {
            if (parent) parent.style.backgroundColor = 'grey';
        }
        // if (text.startsWith('//')) {
        //     if (el.parentElement) {
        //         el.parentElement.style.backgroundColor = '';
        //     }
        // }
        console.log("HELLO WOLRD");
        if (text.startsWith('//-') && !el.dataset.decorated) {
            el.innerText = '//- ---------------------------------------------------------------------';
            el.dataset.decorated = "true"; // mark it processed
        }


        if (text.startsWith('//!')) el.style.color = 'red';
        else if (text.startsWith('//?')) el.style.color = '#3b82f6';
        else if (text.startsWith('//*')) el.style.color = 'green';
        else if (text.startsWith('//^')) el.style.color = 'gold';
        else if (text.startsWith('//&')) el.style.color = 'hotpink';
        else if (text.startsWith('//~')) el.style.color = 'mediumorchid';
        else if (text.startsWith('///')) el.style.color = 'grey';
        else if (text.toUpperCase().includes('TODO')) el.style.color = '#f07705';
        else el.style.color = 'limegreen';
    });
}

const observer = new MutationObserver(() => {
    colorComments();
});

// Wait for the editor to be available
function startObserving() {
    const target = document.querySelector('.ace_layer.ace_text-layer');
    if (target) {
        observer.observe(target, { childList: true, subtree: true, characterData: true });
        colorComments(); // initial pass
    } else {
        // Retry after a short delay until the editor is ready
        setTimeout(startObserving, 500);
    }
}

startObserving();
