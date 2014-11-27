(function() {
    var file_list = null,
        timer = null,
        current_index = 0,
        duration = 0,
        current_time = 10,
        toggle_play_pause = true,
        menu = document.querySelector('#menu'),
        nav = document.querySelector('#nav'),
        files = document.querySelector('#files'),
        count = document.querySelector('#count'),
        time = document.querySelector('#time'),
        time_input = document.querySelector('#time_input'),
        time_bubble = document.querySelector('#time_bubble'),
        time_input_box_min = document.querySelector('#time_input_box_min'),
        time_input_box_sec = document.querySelector('#time_input_box_sec'),
        time_display = document.querySelector('#timer'),
        play = document.querySelector('#play'),
        pause = document.querySelector('#pause'),
        previous = document.querySelector('#previous'),
        next = document.querySelector('#next');

    function init() {
        // files.addEventListener('change', setFiles);
        files.addEventListener('click', setFiles);
        time.addEventListener('click', setTime);
        time_input.addEventListener('submit', setTimeValue);
        time_input_box_min.addEventListener('keydown', setTimeValueSanitize);
        time_input_box_sec.addEventListener('keydown', setTimeValueSanitize);
        time_input_box_min.addEventListener('keyup', setTimeValueSanitize);
        time_input_box_sec.addEventListener('keyup', setTimeValueSanitize);
        time_input_box_min.addEventListener('keyup', setTimeValueHelperNavigateMin);
        time_input_box_sec.addEventListener('keydown', setTimeValueHelperNavigateSec);
        previous.addEventListener('click', previousImage);
        next.addEventListener('click', nextImage);
        play.addEventListener('click', runShow);
    }

    function setFiles(ev) {
        playMode();
        // file_list = ev.target.files;
        ev.preventDefault();
    }

    function playMode() {
        // nav.style.display = "block";
        // play.style.display = "block";
        menu.setAttribute('play', '1');
        previous.style.display = "block";
        next.style.display = "block";
    }

    function setTime(ev) {
        time_bubble.style.display = "block";
        time_input_box_min.addEventListener('blur', function() {
            if (isNaN(time_input_box_min.value)) {
                time_input_box_min.focus();
                return;
            }
            if (isNaN(time_input_box_sec.value)) {
                time_input_box_sec.focus();
                return;
            }
        });
        time.setAttribute('active', '1');
        time_input_box_min.placeholder = pad_time(Math.floor(duration / 60));
        time_input_box_sec.placeholder = pad_time(Math.floor(duration % 60));
        time_input_box_min.focus();
        time_input_box_min.select();
    }

    function pad_time(str) {
        str += "";
        if (str.length == 1) {
            str = "0" + str; 
        }
        return str;
    }

    function setTimeValue(ev) {
        ev.preventDefault();
        duration = parseInt(time_input_box_min.value) * 60 + parseInt(time_input_box_sec.value);
        if (!isNaN(duration)){
            time_input.reset();
            time_bubble.style.display = "none";
            time.removeAttribute('active');
        } else {
            duration = 0;
        }
        return false;
    }

    function setTimeValueSanitize(ev) {
        ev.target.value = ev.target.value.replace(/[^0-9]/, '');
        return /[0-9]/.test(String.fromCharCode(ev.keyCode));
    }

    function setTimeValueHelperNavigateMin(ev) {
        if (ev.target.value.length == 2) {
            time_input_box_sec.focus();
        }
    }

    function setTimeValueHelperNavigateSec(ev) {
        if (ev.target.value.length == 0 && ev.keyCode == 8) {
            time_input_box_min.focus();
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

    function togglePlayPause() {
        toggle_play_pause = !toggle_play_pause;
        play.style.display = toggle_play_pause ? 'block' : 'none';
        pause.style.display = toggle_play_pause ? 'none' : 'block';
    }

    function showTimer() {
        time_display.innerHTML = current_time;
        time_display.style.display = 'inline';
    }

    function runShow(ev) {
        if (file_list && !timer) {
            togglePlayPause();
            showTimer();
            showImage();
            timer = window.setInterval(updateTimer, 1000);
        }
    }

    function pauseShow(ev) {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
            togglePlayPause();
        }
    }

    function updateTimer() {
        current_time--;
        if (current_time == 0) {
            current_time = duration;
            nextImage();
            showImage();
        }
        time_display.innerHTML = current_time;
    }

    function showImage() {
        count.style.display = 'inline';
        count.innerHTML = current_index + 1 + '/' + file_list.length; 
        img.src = window.URL.createObjectURL(file_list.item(current_index));
    }

    init();
})();



