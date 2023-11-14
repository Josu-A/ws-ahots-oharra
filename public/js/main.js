import { recordFn } from "/js/recordButton.js";
import { playFn } from "/js/playButton.js";
import { uploadFn } from "/js/uploadButton.js";

class App {
    audio;
    blob;
    state;
    
    constructor() {
        window.onload = () => {
            const liRecordButton = document.getElementById("liRecordButton");
            liRecordButton.innerHTML = recordFn();

            const liPlayButton = document.getElementById('liPlayButton');
            liPlayButton.innerHTML = playFn();

            const liUploadButton = document.getElementById('liUploadButton');
            liUploadButton = uploadFn();
        }
    }
    
    async init() {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        this.initAudio();
        this.initRecord(stream);
    }

    initAudio() {
        this.audio = document.createElement('audio');
        this.audio.addEventListener('loadedmetadata', () => console.log('loadedmetadata'));
        this.audio.addEventListener('durationchange', () => console.log('durationchange'));
        this.audio.addEventListener('timeupdate', () => console.log('timeupdate'));
        this.audio.addEventListener('ended', () => console.log('ended'));
    }

    loadBlob() {
        // TODO
    }

    initRecord(stream) {
    }

    record() {
        // TODO
    }

    stopRecording() {
        // TODO
    }

    playAudio() {
        // TODO
    }
    
    stopAudio() {
        // TODO
    }

    upload() {
        // TODO
    }

    deleteFile() {
        // TODO
    }
}
