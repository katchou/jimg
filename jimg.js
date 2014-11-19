(function() {
    var file_list = null,
        current_index = 0,
        duration = 10,
        current_time = 10,
        img = document.querySelector('#img'),
        files = document.querySelector('#files'),
        time = document.querySelector('#time'),
        time_input = document.querySelector('#time_input'),
        time_display = document.querySelector('#timer'),
        play = document.querySelector('#play'),
        previous = document.querySelector('#previous'),
        next = document.querySelector('#next');

    function init() {
        files.addEventListener('change', setFiles);
        time.addEventListener('click', setTime);
        time_input.addEventListener('keypress', setTimeValue);
        time_input.addEventListener('blur', function(ev) {ev.target.focus();});
        previous.addEventListener('click', previousImage);
        next.addEventListener('click', nextImage);
        play.addEventListener('click', runShow);
    }

    function setFiles(ev) {
        file_list = ev.target.files;
        ev.preventDefault();
    }

    function setTime(ev) {
        time_input.style.display = "block";
        time_input.focus();
    }

    function setTimeValue(ev) {
        if (ev.keyCode == 13) {
            if (time_input.value != '' && time_input.validity.valid) {
                duration = time_input.valueAsNumber/60;
                time_input.style.display = "none";
                current_time = duration;
                showTimer();
            }
        }
    }

    function previousImage(ev) {
        if (file_list) {
            current_index = (file_list.length + current_index - 1) % file_list.length;
            showImage();
        }
    }

    function nextImage(ev) {
        if (file_list) {
            current_index = (current_index + 1) % file_list.length;
            showImage();
        }
    }

    function showTimer() {
        time_display.innerHTML = current_time;
        time_display.style.display = 'inline';
    }

    function runShow(ev) {
        if (file_list) {
            showTimer();
            showImage();
            var timer = window.setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        if (current_time == 0) {
            current_time = duration;
            nextImage();
            showImage();
        }
        time_display.innerHTML = current_time;
        current_time--;
    }

    function showImage() {
        img.src = window.URL.createObjectURL(file_list.item(current_index));
    }

    init();
})();



