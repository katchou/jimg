(function() {
    var file_list = null,
        timer = null,
        current_index = - 1,
        duration = 0,
        current_time = 10,
        menu = document.querySelector('#menu'),
        img = document.querySelector('#img'),
        nav = document.querySelector('#nav'),
        files = document.querySelector('#files'),
        files_label = document.querySelector('#files_label'),
        count = document.querySelector('#count'),
        time = document.querySelector('#time'),
        time_input = document.querySelector('#time_input'),
        time_bubble = document.querySelector('#time_bubble'),
        time_input_box_min = document.querySelector('#time_input_box_min'),
        time_input_box_sec = document.querySelector('#time_input_box_sec'),
        play = document.querySelector('#play'),
        pause = document.querySelector('#pause'),
        previous = document.querySelector('#previous'),
        next = document.querySelector('#next');

    function init() {
        files.addEventListener('change', setFiles);
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
        img.addEventListener('load', resizeImage);
    }

    function setFiles(ev) {
        file_list = ev.target.files;
        files_label.innerHTML = current_index + 1 + "/" + file_list.length;
        playMode();
        ev.preventDefault();
    }

    function playMode() {
        play.style.display = "block";
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
            showTimer();
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

    function showTimer() {
        canvas = document.createElement('canvas');
        canvas.height = 112;
        canvas.width = 112;
        time.appendChild(canvas);
        context = canvas.getContext('2d');
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        radius = 51;
        draw();
    // animate();
    }

    // function animate() {
    //   setTimeout(function() {
    //     window.requestAnimationFrame(animate);
    //     duration++;
    //     draw();
    //   }, 1000);
    // }

    function draw() { 
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.arc(centerX, centerY, radius, Math.PI * 1.5, Math.PI * (duration / 50 - 0.5), false);
      context.lineWidth = 8;
      context.strokeStyle = '#000';
      context.stroke();

      context.beginPath();
      context.arc(centerX, centerY, radius, Math.PI * 1.5, Math.PI * (duration / 50 - 0.5), true);
      context.lineWidth = 8;
      context.strokeStyle = 'rgb(241,101,76)';
      context.stroke();

      context.font = 'normal 40pt novecento_wide_bookbold';
      context.textAlign = 'center';
      var width = context.measureText(duration).width;
      context.fillText(duration, centerX, centerY);

      context.font = '20pt Calibri';
      context.fillText('%', centerX , centerY + 30);
    }

    function runShow(ev) {
        if (current_index < 0) {
            current_index = 0;
        }
        if (file_list && !timer) {
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
        // time_display.innerHTML = current_time;
    }

    function showImage() {
        img.src = window.URL.createObjectURL(file_list.item(current_index));
    }

    function resizeImage(ev) {
        img.style.height = ev.target.naturalHeight + "px";
        img.style.width = ev.target.naturalWidth + "px";
        // img.style.boxShadow = "inset 0px 0px 150px 150px #000";
        files_label.innerHTML = current_index + 1 + '/' + file_list.length; 
    }

    init();
})();



