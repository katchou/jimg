(function() {
    var file_list = null,
        current_index = 0,
        duration = 10000,
        img = document.querySelector('#img'),
        files = document.querySelector('#files'),
        time = document.querySelector('#time'),
        play = document.querySelector('#play'),
        previous = document.querySelector('#previous'),
        next = document.querySelector('#next');

    function init() {
        files.addEventListener('change', setFiles);
        time.addEventListener('click', setTime);
        previous.addEventListener('click', previousImage);
        next.addEventListener('click', nextImage);
        play.addEventListener('click', runShow);
    }

    function setFiles(ev) {
        file_list = ev.target.files;
        ev.preventDefault();
    }

    function setTime(ev) {
        time_input = document.createElement('input');
        time_input.setAttribute('type', 'time');
        time_input.setAttribute('id', 'time_input');
        time_input.addEventListener(
            'keypress', 
            function(ev) {
                if (ev.keyCode == 13) {
                    if (time_input.value != '' && time_input.validity.valid) {
                        duration = time_input.valueAsNumber/60;
                        time_input.parentNode.removeChild(time_input);
                    }
                }
            },
            true);
        time.parentNode.insertBefore(time_input, time);
        time_input.focus();
    }

    function previousImage(ev) {
        current_index = (file_list.length+current_index-1)%file_list.length;
        showImage(current_index);
    }

    function nextImage(ev) {
        current_index = (current_index+1)%file_list.length;
        showImage(current_index);
    }

    function runShow(ev) {
        if (file_list) {
            showImage(current_index);
            window.setInterval(nextImage, duration);
        }
    }

    function showImage(index) {
        img.src = window.URL.createObjectURL(file_list.item(index));
    }

    init();
})();



