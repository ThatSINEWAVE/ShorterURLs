function selectService(service) {
    document.getElementById('service-buttons').style.display = 'none';
    document.getElementById('shorten-url-container').style.display = 'block';
    localStorage.setItem('selectedService', service);
}

function shortenUrl() {
    const longUrl = document.getElementById('long-url').value;
    const selectedService = localStorage.getItem('selectedService');

    if (selectedService === 'ulvis') {
        shortenWithUlvis(longUrl);
    } else if (selectedService === '1pt') {
        shortenWith1pt(longUrl);
    } else if (selectedService === 'cleanuri') {
        shortenWithCleanURI(longUrl);
    } else if (selectedService === 'owo') {
        shortenWithOwo(longUrl);
    }
}

function copyToClipboard() {
    const shortUrlInput = document.getElementById('shortened-url');
    shortUrlInput.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
}

function reset() {
    document.getElementById('long-url').value = '';
    document.getElementById('service-buttons').style.display = 'block';
    document.getElementById('shorten-url-container').style.display = 'none';
    document.getElementById('shortened-url-container').style.display = 'none';
}

function shortenWithUlvis(longUrl) {
    const customText = generateRandomString(8);
    const apiUrl = `https://corsproxy.io/?https://ulvis.net/api.php?url=${encodeURIComponent(longUrl)}&custom=${customText}&private=1`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(shortUrl => {
            displayShortUrl(shortUrl);
        })
        .catch(error => console.error('Error:', error));
}

function shortenWith1pt(longUrl) {
    const apiUrl = 'https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php';
    const customUrlInput = document.getElementById('custom-url');
    const customUrl = customUrlInput ? remove(customUrlInput.value, ['1pt.co/', '/', '\\?']) : '';

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            const data = JSON.parse(this.responseText);
            const returnedShortUrl = `1pt.co/${data.short}`;
            const showWarning = customUrl !== '' && data.short !== customUrl;
            displayShortUrl(returnedShortUrl);
        }
    };

    const requestUrl = `${apiUrl}?url=${encodeURIComponent(longUrl)}&cu=${encodeURI(customUrl)}`;
    xhttp.open('GET', requestUrl, true);
    xhttp.send();
}

function shortenWithCleanURI(longUrl) {
    const apiUrl = 'https://corsproxy.io/?https://cleanuri.com/api/v1/shorten';
    const data = { url: longUrl };

    fetch(apiUrl, {
        method: 'POST',
        body: new URLSearchParams(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.result_url) {
            displayShortUrl(data.result_url);
        } else {
            console.error('Error:', data);
        }
    })
    .catch(error => console.error('Error:', error));
}

function shortenWithOwo(longUrl) {
    const apiUrl = 'https://corsproxy.io/?https://owo.vc/api/v2/link';
    const data = {
        link: longUrl,
        generator: 'owo',
        metadata: 'IGNORE'
    };

    fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ShorterURLs'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { throw new Error(JSON.stringify(data)) });
        }
        return response.json();
    })
    .then(data => {
        if (data.id) {
            const shortUrl = `https://${data.id}`;
            displayShortUrl(shortUrl);
        } else {
            console.error('Error:', data);
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayShortUrl(shortUrl) {
    document.getElementById('shortened-url').value = shortUrl;
    document.getElementById('shorten-url-container').style.display = 'none';
    document.getElementById('shortened-url-container').style.display = 'block';
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}