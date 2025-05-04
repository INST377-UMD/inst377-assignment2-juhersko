// Quote

function getQuote() {
    fetch(`https://zenquotes.io/api/random`)
        .then((resp) => resp.json())
        .then((data) => {
            const quote = data[0].q;
            const author = data[0].a;
            document.getElementById('quote').textContent = `"${quote}" - ${author}`;
        })
};


