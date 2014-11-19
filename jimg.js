(function() {
    var files = [],
        img = document.querySelector('#img'),
        files = document.querySelector('#files'),
        time = document.querySelector('#time'),
        play = document.querySelector('#play'),
        previous = document.querySelector('#previous'),
        next = document.querySelector('#next');

    function init() {
        files.addEventListener('change', getFiles);
        time.addEventListener('click', getTime);
        previous.addEventListener('click', previousImage);
        next.addEventListener('click', nextImage);
        play.addEventListener('click', runShow);
    }

    function getFiles(ev) {
        files = ev.target.files;
        ev.preventDefault();
        runShow();
    }

    function getTime(ev) {
    }

    function previousImage(ev) {
    }

    function nextImage(ev) {
    }

    function runShow( ev ) {
        window.URL = window.URL || window.webkitURL;
        var file = files.shift();
        var blob = window.URL.createObjectURL(file);
        showImage(blob);
    }

    function showImage(blob) {
        img.src = blob;
    }

    init();
})();



