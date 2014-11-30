(function() {
    var file_list = null,
        intid = null,
        current_index = - 1,
        duration = 3,
        current_time = 0,

        menu = document.querySelector('#menu'),
        imageView = document.querySelector('#imageView'),
        image = document.querySelector('#image'),
        files = document.querySelector('#files'),
        files_label = document.querySelector('#files_label'),
        files_input = document.querySelector('#files_input'),

        time = document.querySelector('#time'),
        time_form = document.querySelector('#time_form'),
        time_input_label = document.querySelector('#time_input_label'),
        time_input_box_min = document.querySelector('#time_input_box_min'),
        time_input_box_sec = document.querySelector('#time_input_box_sec'),
        time_bubble = document.querySelector('#time_bubble'),
        timer = document.querySelector('#timer'),

        play = document.querySelector('#play'),
        play_label = document.querySelector('#play_label'),
        pause = document.querySelector('#pause'),
        previous = document.querySelector('#previous'),
        next = document.querySelector('#next');

    function init() {
        files_input.addEventListener('change', setFiles);
        time_input.addEventListener('click', showTimeBubble);
        timer.addEventListener('click', showTimeBubble);
        time_form.addEventListener('submit', setTimeValue);
        time_input_box_min.addEventListener('keydown', setTimeValueSanitize);
        time_input_box_sec.addEventListener('keydown', setTimeValueSanitize);
        time_input_box_min.addEventListener('keyup', setTimeValueSanitize);
        time_input_box_sec.addEventListener('keyup', setTimeValueSanitize);
        time_input_box_min.addEventListener('keyup', setTimeValueHelperNavigateMin);
        time_input_box_sec.addEventListener('keydown', setTimeValueHelperNavigateSec);
        // image.addEventListener('mouseenter', showPause);
        // image.addEventListener('mouseleave', hidePause);
        previous.addEventListener('click', previousImage);
        next.addEventListener('click', nextImage);
        play.addEventListener('click', runShow);
    }

    function setFiles(ev) {
        file_list = ev.target.files;
        showFiles();
        playMode();
        ev.preventDefault();
    }

    function playMode() {
        if (file_list && duration) {
            imageView.style.display = "block";
            menu.setAttribute('play', '1');
            previous.style.display = "block";
            next.style.display = "block";
            play.style.display = "flex";
        }
    }

    function showTimeBubble(ev) {
        time_input_label.innerHTML = 'OK';
        time_input_label.style.fontSize = "46px";
        time_input_label.style.display = "table-cell";
        timer.style.display = "none";
        time_bubble.style.display = "block";
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
        if (time_input_box_min.value || time_input_box_sec.value) {
            time_input_box_min.value = time_input_box_min.value ? time_input_box_min.value : "0";
            time_input_box_sec.value = time_input_box_sec.value ? time_input_box_sec.value : "0";
            duration = parseInt(time_input_box_min.value) * 60 + parseInt(time_input_box_sec.value);
            time_form.reset();
            time_bubble.style.display = "none";
            time.removeAttribute('active');
            current_time = duration;
            showTimer();
        } else {
            duration = 0;
        }
        playMode();
        return false;
    }

    function setTimeValueSanitize(ev) {
        ev.target.value = ev.target.value.replace(/[^0-9]/, '');
    }

    function setTimeValueHelperNavigateMin(ev) {
        if (ev.target.value.length == 2 || ev.keyCode == 39) {
            time_input_box_sec.focus();
        }
    }

    function setTimeValueHelperNavigateSec(ev) {
        if ((ev.target.value.length == 0 && ev.keyCode == 8)
            || ev.keyCode == 37
        ) {
            time_input_box_min.focus();
        } 
    }

    function previousImage(ev) {
        if (file_list) {
            resetTimer();
            current_index = (file_list.length + current_index - 1) % file_list.length;
            runShow();
        }
    }

    function nextImage(ev) {
        if (file_list) {
            resetTimer();
            current_index = (current_index + 1) % file_list.length;
            runShow();
        }
    }

    function showFiles() {
        files_label.innerHTML = current_index + 1 + '/' + file_list.length; 
    }

    function showTimer() {
        time.querySelector('label').style.display = "none";
        timer.style.display = "block";

        var context = timer.getContext('2d'),
            centerX = timer.width / 2,
            centerY = timer.height / 2,
            radius = 50,
            min_str = pad_time(Math.floor(current_time / 60)),
            sec_str = pad_time(Math.floor(current_time % 60)),
            completion = 1 - current_time / Math.min(90, duration);

            context.clearRect(0, 0, timer.width, timer.height);

        if (current_time > 90 ) {

            context.beginPath();
            context.arc(centerX, centerY, radius, Math.PI * (-0.5), Math.PI * (1.5), true);
            context.lineWidth = 10;
            context.strokeStyle = 'rgb(241,101,76)';
            context.fillStyle = 'rgb(241,101,76)';

            context.stroke();
            context.fill();

            context.font = 'normal 26px novecento_wide_bookbold';
            context.textAlign = 'center';
            context.fillStyle = '#FFF';
            context.fillText(min_str + ":" + sec_str, centerX, centerY + 10);

        } else {
            // duration = 100;
            context.beginPath();
            context.arc(centerX, centerY, radius, Math.PI * 1.5, Math.PI * (2 * completion - 0.5), false);
            context.lineWidth = 10;
            context.strokeStyle = '#000';
            context.stroke();

            context.beginPath();
            context.arc(centerX, centerY, radius, Math.PI * 1.5, Math.PI * (2 * completion - 0.5), true);
            context.lineWidth = 10;
            context.strokeStyle = 'rgb(241,101,76)';
            context.stroke();

            context.font = 'normal 50px novecento_wide_bookbold';
            context.textAlign = 'center';
            context.fillStyle = '#FFF';
            context.fillText(current_time, centerX, centerY + 10);

            context.fillStyle = 'rgb(241,101,76)';
            context.font = 'normal 18px novecento_widelight';
            context.fillText('SEC', centerX, centerY + 32);

        }
    }

    function runShow() {
        if (current_time == 0) {
            current_time = duration;
        }
        if (current_index < 0) {
            current_index = 0;
        }
        if (file_list && !intid) {
            // play.style.display = "none";
            // play.removeAttribute('pause');
            play.setAttribute('play', '1');
            showTimer();
            showImage();
            showFiles();
            intid = window.setInterval(updateTimer, 1000);
            return;
        }
        if (intid) {
            pauseShow();
        }
    }

    function pauseShow() {
        stopTimer();
        play.removeAttribute('play');
        play.setAttribute('pause', '1');

    }

    function stopTimer() {
        window.clearInterval(intid);
        intid = null;

    }

    function resetTimer() {
        stopTimer();
        current_time = duration;
    }

    function stopShow() {

    }


    function updateTimer() {
        // current_time--;
        if (--current_time <= 0) {
            current_time = duration;
            if (current_index + 1 == file_list.length) {
                play.removeAttribute('play');
                resetTimer();
                // showTimer();            
                imageView.style.backgroundImage = "none";
                return;
            }
            nextImage();
            showImage();
            files_label.innerHTML = current_index + 1 + '/' + file_list.length;
        }
        showTimer();
        if (current_time < 5) {
            document.querySelector('#bip').play();
        }
        // time_display.innerHTML = current_time;
    }

    // function showImage() {
    //     image.onload = function () {
    //         if (image.naturalHeight > image.naturalWidth) {
    //             var computedHeight = Math.min(parseInt(window.getComputedStyle(imageView).height), image.naturalHeight);
    //             var ratio = computedHeight / image.naturalHeight;
    //             image.style.height = computedHeight + "px";
    //             image.style.width = image.naturalWidth * ratio + "px";
    //             play.style.height = computedHeight + "px";
    //             play.style.width = image.naturalWidth * ratio + "px";
    //         } else {
    //             var computedwidth = Math.min(parseInt(window.getComputedStyle(imageView).width), image.naturalWidth);
    //             var ratio = computedwidth / image.naturalWidth;
    //             image.style.width = computedwidth + "px";
    //             image.style.height = image.naturalHeight * ratio + "px";
    //             var ratio = computedwidth / image.naturalWidth;
    //             play.style.width = computedwidth + "px";
    //             play.style.height = image.naturalHeight * ratio + "px";
    //         }
    //     }
    //     image.src = window.URL.createObjectURL(file_list.item(current_index));
    // }


    function showImage() {
        var image = new Image();
        image.onload = function () {
            if (image.naturalHeight > image.naturalWidth) {
                var computedHeight = Math.min(parseInt(window.getComputedStyle(play).height), image.naturalHeight);
                var ratio = computedHeight / image.naturalHeight;
                imageView.style.height = computedHeight + "px";
                imageView.style.width = image.naturalWidth * ratio + "px";
                // play.style.height = computedHeight + "px";
                // play.style.width = image.naturalWidth * ratio + "px";
            } else {
                var computedwidth = Math.min(parseInt(window.getComputedStyle(play).width), image.naturalWidth);
                var ratio = computedwidth / image.naturalWidth;
                imageView.style.width = computedwidth + "px";
                imageView.style.height = image.naturalHeight * ratio + "px";
                var ratio = computedwidth / image.naturalWidth;
                // play.style.width = computedwidth + "px";
                // play.style.height = image.naturalHeight * ratio + "px";
            }
            imageView.style.backgroundImage = 'url(' + this.src + ')';
        }
        image.src = window.URL.createObjectURL(file_list.item(current_index));
    }
    function showPause() {
        // imageView.style.zIndex = 2;
        // play_label.style.backgroundImage = 'url(assets/images/btn_stop.png)';
        play.style.backgroundColor = 'rgba(0,0,0,0.4)';
        play.style.display = "flex";
        // play.style.opacity = '0.9';
        // play.style.backgroundImage = 'url(assets/images/btn_stop.png)';
        // play.style.display = "block";
    }

    function hidePause() {
        // imageView.style.zIndex = 2;
        // play_label.style.backgroundImage = 'url(assets/images/btn_stop.png)';
        // play.style.backgroundColor = 'rgba(0,0,0,0.4)';
        play.style.display = "none";
        // play.style.opacity = '0.9';
        // play.style.backgroundImage = 'url(assets/images/btn_stop.png)';
        // play.style.display = "block";
    }

    init();
})();



