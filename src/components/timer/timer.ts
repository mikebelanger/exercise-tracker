import './timer.css';

export const secondsToMilliseconds = (seconds: number) => 1000 * seconds;
export const minutesToMilliseconds = (minutes: number) => 60 * 1000 * minutes;
export const hoursToMilliseconds = (hours: number) => 60 * 60 * 1000 * hours;

export interface IDuration {
  hours: number;
  minutes: number;
  seconds: number;
};

export class Timer extends HTMLElement {
  private startTime: number | null;
  private endTime: number | null;
  private currentTime: number | null;
  private remainingTime: number | null;
  countdown: number | null;
  mode: 'RUNNING' | 'PAUSED' | 'NEW';
  private _onTimerEnd: () => void;
  constructor() {
    super();
    this.startTime = null;
    this.endTime = null;
    this.currentTime = null;
    this.remainingTime = null;
    this.countdown = null;
    this.mode = 'NEW';
    this.render();
    this._onTimerEnd = () => { };
  }

  render() {
    const { hours, minutes, seconds } = this.remainingDuration();
    this.innerHTML = `
        <div class="clock">
          <fieldset class="time-number-container">
            <legend>Hours</legend>
            <input type='number'
              id='hours'
              placeholder="HH"
              ${this.mode === 'RUNNING' ? 'disabled' : ''}
              min="00"
              max="24"
              step="1"
              value=${hours.toFixed(0).padStart(2, "0")}
            />
          </fieldset>
          <fieldset class="time-number-container">
            <legend>Minutes</legend>
            <input type='number'
              id='minutes'
              placeholder="MM"
              ${this.mode === 'RUNNING' ? 'disabled' : ''}
              min="00"
              max="60"
              step="1"
              value=${minutes.toFixed(0).padStart(2, "0")}
            />
          </fieldset>
          <fieldset class="time-number-container">
            <legend>Seconds</legend>
            <input type='number'
              id='seconds'
              placeholder="SS"
              ${this.mode === 'RUNNING' ? 'disabled' : ''}
              min="00"
              max="60"
              step="1"
              value=${seconds.toFixed(0).padStart(2, "0")}
            />
          </fieldset>
          `;
  }

  new = (duration: IDuration) => {
    this.mode = 'NEW';
    this.startTime = Date.now();
    const { hours, minutes, seconds } = duration;
    this.remainingTime = hoursToMilliseconds(hours) +
      minutesToMilliseconds(minutes) +
      secondsToMilliseconds(seconds);

    this.render();
  }

  start = () => {
    const everySecond = secondsToMilliseconds(1);
    this.startTime = Date.now();
    if (this.remainingTime) this.endTime = this.startTime + this.remainingTime;
    this.mode = 'RUNNING';
    this.countdown = window.setInterval(() => {
      if (this.startTime && this.endTime) {
        this.currentTime = Date.now();
        this.remainingTime = this.endTime - this.currentTime;
        this.render();

        if (this.remainingTime <= 0) {
          this.clear();
          this._onTimerEnd();
        }
      } else {
        this.clear();
      }
    }, everySecond);
  }

  pause = () => {
    this.mode = 'PAUSED';
    this.stopCountdown();
    this.render();
  }

  stopCountdown = () => {
    if (this.countdown) clearInterval(this.countdown);
  }

  clear = () => {
    this.remainingTime = null;
    this.endTime = null;
    this.startTime = null;
    this.mode = 'NEW';
    this.render();
  }

  remainingDuration = (): IDuration => {
    const totalSecondsRemaining = this.remainingTime ? this.remainingTime / 1000 : 0;
    const seconds = Math.floor(totalSecondsRemaining % 60);
    const minutes = Math.floor(totalSecondsRemaining / 60) % 60;
    const hours = Math.floor(totalSecondsRemaining / 3600);

    return {
      hours,
      minutes,
      seconds,
    };
  }

  set onTimerEnd(callback: () => void) {
    this._onTimerEnd = callback;
  }
}

customElements.define('timer-element', Timer);
