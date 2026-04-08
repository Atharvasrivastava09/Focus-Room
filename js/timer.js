const countdown_display = document.getElementById('timer-countdown');
const circle = document.querySelector('.progress-ring-circle');
const start_button = document.getElementById('start-btn');
const reset_button = document.getElementById('reset-btn');
const timer_mode = document.getElementById('timer-mode');
const timer_label = document.getElementById('timer-label');

let total_time = parseInt(localStorage.getItem('total_time')) || 5; //time in seconds
let time_left = parseInt(localStorage.getItem('time_left')) || total_time;
let timerId = null;
const circumference = 2*Math.PI*140;
let short_breaks=0;
let session =0;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = 0;

function updateUI(){
    const minutes = Math.floor(time_left/60);
    const seconds = time_left%60;

    countdown_display.textContent = `${minutes}:${seconds <10 ? '0':''}${seconds}`;

    const offset = circumference - (time_left/total_time) * circumference;
    circle.style.strokeDashoffset = offset;

    localStorage.setItem('time_left',time_left);
    localStorage.setItem('total_time',total_time);
}

function beginCountdown(){
    start_button.textContent = 'PAUSE';
    timerId = setInterval(()=>{
            if(time_left > 0){
                time_left--;
                updateUI();
            }else{
                clearInterval(timerId);
                timerId = null;
                autoTransition();
            }
        },1000);
}

function startTimer(){
    if(timerId!==null){
        clearInterval(timerId);
        timerId = null;
        start_button.textContent = 'START';
        localStorage.setItem('time_running','false');
    } else{
        localStorage.setItem('time_running','true');
        beginCountdown();
    }
}

function resetTimer(){
    clearInterval(timerId);
    timerId=null;
    start_button.textContent = 'START';
    localStorage.removeItem('time_left');
    changeMode();
    localStorage.setItem('time_running','false');
}

function changeMode(){
    const mode = timer_mode.value;
    if(mode === 'Pomodoro'){
        total_time = 5;
        timer_label.textContent = 'Focus';
    } else if(mode === 'Short Break'){
        total_time = 2;
        short_breaks ++;
        timer_label.textContent = 'Short Break';
    } else if(mode === 'Long Break'){
        total_time = 3;
        timer_label.textContent = 'Long Break';
    }
    time_left = total_time;
    localStorage.setItem('time_left',time_left);
    localStorage.setItem('total_time',total_time);
    updateUI();
}

function autoTransition(){
    const current_mode=timer_mode.value;
    if(current_mode === 'Pomodoro' && short_breaks<3) timer_mode.value = 'Short Break';
    else if(current_mode === 'Pomodoro' && short_breaks>=3){ 
        timer_mode.value = 'Long Break'; 
        short_breaks=0;
    }
    else if(current_mode === 'Short Break') timer_mode.value = 'Pomodoro';
    else if(current_mode === 'Long Break'){
        timer_mode.value = 'Pomodoro';
        session ++;
    }
    changeMode();
    alert(`Session completed! Switched to: ${timer_label.textContent}`);
    if(session<1){
    beginCountdown();
    }
    else{
        alert(`${session*4} Session of Pomodoro completed!!! \n ${session} cycle is completed successfully.`);
        clearInterval(timerId);
        start_button.textContent = 'START';
    }
}

start_button.addEventListener('click',startTimer);
reset_button.addEventListener('click',resetTimer);
timer_mode.addEventListener('change',() => {
    clearInterval(timerId);
    timerId = null;
    start_button.textContent = 'START';
    changeMode();
});

if(localStorage.getItem('time_running') === 'true'){
    beginCountdown();
}

updateUI();

