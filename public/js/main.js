import { recordFn } from '/js/recordButton.js';
import { playFn } from '/js/playButton.js';
import { uploadFn } from '/js/uploadButton.js';
import uuidv4 from '/utils/uuid/v4.js';

class App {
    state = {
        'idle' : 0,
        'playing' : 1,
        'playingEnded' : 2,
        'recording' : 3,
        'recordingEnded' : 4,
        'uploading' : 5,
        'deleting' : 6
    };
    recordStartTime = 0;
    recordMaxTime = 300;
    
    constructor() {
        this.init();
        this.setUpButton('record-button', recordFn(), 'myApp.record();');
        this.setUpButton('play-button', playFn(), 'myApp.playAudio();');
        this.setUpButton('upload-button', uploadFn(), 'myApp.upload()');

        this.recordButton = document.querySelector('#record-button > .custom-button');
        this.playButton = document.querySelector('#play-button > .custom-button');
        this.uploadButton = document.querySelector('#upload-button > .custom-button');

        this.setState({ 'currentState' : this.state.idle });

        if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', uuidv4());
        }
        this.uuid = localStorage.getItem('uuid');
    }

    setUpButton(wrapperId, innerHtml, clickFunction) {
        const buttonWrapper = document.getElementById(wrapperId);
        buttonWrapper.innerHTML = innerHtml;
        const button = buttonWrapper.getElementsByClassName('custom-button')[0];
        button.setAttribute('onclick', clickFunction);
    }
    
    async init() {
        let stream = await navigator.mediaDevices.getUserMedia({ audio : true });
        this.initAudio();
        this.initRecord(stream);
    }

    initAudio() {
        this.audio = document.createElement('audio');
        this.audio.addEventListener('loadedmetadata', () => console.log('loadedmetadata'));
        this.audio.addEventListener('durationchange', () => console.log('durationchange'));
        this.audio.addEventListener('timeupdate', () => this.render());
        this.audio.addEventListener('ended', () => this.stopAudio());
    }

    loadBlob() {
        let audioUrl = URL.createObjectURL(this.blob);
        this.audio.src = audioUrl;
    }

    initRecord(stream) {
        let audioChunks;
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.addEventListener('start', () => {
            this.recordStartTime = (new Date()).getTime();
            this.setState({ 'currentState' : this.state.recording });
            audioChunks = [];
        });

        this.mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener('stop', () => {
            this.blob = new Blob(audioChunks, { type: 'audio/vorbis' });
            this.loadBlob();
            this.setState({ 'currentState' : this.state.recordingEnded });
        });
    }

    render() {
        const recordButtonText = this.recordButton.querySelector('.custom-button-text');
        const playButtonText = this.playButton.querySelector('.custom-button-text');
        let formattedTime;
        switch (this.state.currentState) {
            case this.state.idle:
                formattedTime = this.formatFromSeconds(this.recordMaxTime);
                recordButtonText.textContent = `grabatu (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
            case this.state.playing:
                formattedTime = this.formatFromSeconds(this.audio.currentTime);
                playButtonText.textContent = `gelditu (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
            case this.state.recording:
                formattedTime = this.formatFromSeconds(this.getRecordedRemainingTime());
                recordButtonText.textContent = `gelditu (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
            case this.state.recordingEnded:
            case this.state.playingEnded:
                formattedTime = this.formatFromSeconds(this.audio.duration);
                playButtonText.textContent = `entzun (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
            case this.state.uploading:
                break;
            case this.state.deleting:
                break;
            default:
                formattedTime = this.formatFromSeconds(this.recordMaxTime);
                recordButtonText.textContent = `grabatu (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
        }
    }

    record() {
        this.playButton.setAttribute('disabled', true);
        this.recordButton.classList.add('active');
        if (this.audioHasBeenRecorded()) {
            this.stopAudio();
        }
        this.mediaRecorder.start();
        this.recordButton.setAttribute('onclick', 'myApp.stopRecording();');
        this.recordTimer = setInterval(() => {
            this.render();
            if (this.getRecordedRemainingTime() <= 0) {
                this.stopRecording();
            }
        }, 1000);
    }

    stopRecording() {
        this.recordButton.classList.remove('active');
        this.mediaRecorder.stop();
        this.setState({ 'currentState' : this.state.idle });
        clearInterval(this.recordTimer);

        this.recordButton.setAttribute('onclick', 'myApp.record();');
        this.playButton.removeAttribute('disabled');
    }

    playAudio() {
        this.audio.play();
        this.playButton.classList.add('active');
        this.setState({ 'currentState' : this.state.playing });
        this.playButton.setAttribute('onclick', 'myApp.stopAudio();');
    }
    
    stopAudio() {
        this.playButton.classList.remove('active');
        this.setState({ 'currentState' : this.state.playingEnded })
        this.audio.pause();
        this.audio.currentTime = 0;
        this.playButton.setAttribute('onclick', 'myApp.playAudio();');
        this.setState({ 'currentState' : this.state.idle });
    }

    upload() {
        // TODO
    }

    deleteFile() {
        // TODO
    }

    setState(state) {
        this.state = Object.assign({}, this.state, state);
        this.render();
    }

    getRecordedElapsedTime() {
        return Math.floor(((new Date).getTime() - this.recordStartTime) / 1000);
    }

    getRecordedRemainingTime() {
        return Math.max(0, this.recordMaxTime - this.getRecordedElapsedTime());
    }

    formatFromSeconds(seconds) {
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const m = Math.floor(seconds / 60);
        return {
            'minutes' : m,
            'seconds' : s
        }
    }

    audioHasBeenRecorded() {
        return this.audio.src !== '';
    }
}

window.myApp = new App();
