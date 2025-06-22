import { Timer } from './components/timer/timer.ts';
import './styles/pico.min.css';

const TOGGLE = document.getElementById('toggle');
const CLOCK = document.getElementById('clock') as Timer;
const CLEAR = document.getElementById('clear');
const ALARM = document.getElementById('alarm') as HTMLAudioElement;

const getInputTimeValues = () => {
  return {
    hours: parseInt(
      (document.getElementById('hours') as HTMLInputElement)?.value
    ) || 0,
    minutes: parseInt(
      (document.getElementById('minutes') as HTMLInputElement)?.value
    ) || 0,
    seconds: parseInt(
      (document.getElementById('seconds') as HTMLInputElement)?.value
    ) || 0
  }
}

if (TOGGLE && CLOCK && CLEAR) {

  // Handle cases for click on the Start/Pause button
  TOGGLE.addEventListener('click', () => {
    switch (CLOCK.mode) {
      case 'NEW':
      case 'PAUSED':
        CLOCK.new(getInputTimeValues());
        CLOCK.start();
        TOGGLE.textContent = "Pause";
        break;
      case 'RUNNING':
        CLOCK.pause();
        TOGGLE.textContent = "Start";
        break;
    }
  });

  // Reset the clock
  CLEAR.addEventListener('click', () => {
    CLOCK.clear();
    CLOCK.stopCountdown();
    TOGGLE.textContent = "Start";
  });

  // When the alarm fires
  CLOCK.onTimerEnd = () => {
    CLOCK.clear();
    CLOCK.stopCountdown();
    TOGGLE.textContent = "Start";

    if (ALARM) {
      ALARM.play();
    }
  };
}

// It's easier to start/pause workouts with the space key
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Space') {
    if (CLOCK.mode === 'RUNNING') {
      CLOCK.pause();
    } else if (CLOCK.mode === 'PAUSED') {
      CLOCK.start();
    }
  }
});
