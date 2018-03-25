{
    aJax()
    function aJax() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let token = JSON.parse(xhr.responseText).uptoken;
                    window.eventHub.emit('ajax', JSON.parse(JSON.stringify(token)))
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.open('GET', 'http://47.91.156.35:7843/uploadToken', true);
        xhr.send(null);
    }
}