import { recordFn } from '/js/recordButton.js';
import { playFn } from '/js/playButton.js';
import { uploadFn } from '/js/uploadButton.js';

class App {
    state = {
        'idle' : 0,
        'playing' : 1,
        'playingEnded' : 2,
        'recording' : 3,
        'recordingEnded' : 4,
        'uploading' : 5,
        'uploadingEnded' : 6,
        'deleting' : 7
    };
    recordStartTime = 0;
    recordMaxTime = 300;
    
    constructor() {
        this.playMode = new URLSearchParams(window.location.search).get("play");

        if (!this.playMode) {
            this.setUpButton('record-button', recordFn(), 'myApp.record();');
            this.setUpButton('upload-button', uploadFn(), 'myApp.upload();');
            this.recordButton = document.querySelector('#record-button > .custom-button');
            this.uploadButton = document.querySelector('#upload-button > .custom-button');
        }

        this.setUpButton('play-button', playFn(), 'myApp.playAudio();');
        this.playButton = document.querySelector('#play-button > .custom-button');

        this.init();

        this.setState({ 'currentState' : this.state.idle });
    }
    
    init() {
        if (!this.playMode) {
            this.isUserLogged().then(async uid => {
                this.uid = uid;
                if (this.uid) {
                    this.listUserAudios();
                    this.buttonToggleDisable(this.recordButton);
                    let stream = await navigator.mediaDevices.getUserMedia({ audio : true });
                    this.initRecord(stream);
                    this.buttonToggleDisable(this.recordButton);
                }
                else {
                    this.buttonDisable(this.recordButton);
                }
            });
        }
        this.initAudio();
    }

    initAudio() {
        this.audio = document.createElement('audio');

        const getDuration = event => {
            event.target.currentTime = 0
            event.target.removeEventListener('timeupdate', getDuration)
            console.log(event.target.duration)
        }
        this.audio.addEventListener('loadedmetadata', () => {
            if (this.audio.duration === Infinity || isNaN(Number(this.audio.duration))) {
                this.audio.currentTime = 1e101;
                this.audio.addEventListener('timeupdate', getDuration);
            }
        });
        this.audio.addEventListener('durationchange', () => console.log('durationchange'));
        this.audio.addEventListener('timeupdate', () => this.render());
        this.audio.addEventListener('ended', () => this.stopAudio());

        if (this.playMode) {
            console.log(`Fetching from /api/play/${this.playMode}`);
            fetch(`/api/play/${this.playMode}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP errorea. Egoera honekin: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                this.blob = blob;
                this.loadBlob();
                this.buttonToggleDisable(this.playButton);
            })
            .catch(error => {
                console.error('Ezin izan da audio fitxategia eskuratu:', error);
            });
        }
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
            this.blob = new Blob(audioChunks, { type: 'audio/ogg' });
            this.loadBlob();
            this.setState({ 'currentState' : this.state.recordingEnded });
        });
    }

    render() {
        if (!this.playMode) {
            this.renderNonPlayModeMode();
        }
        else {
            this.renderPlayMode();
        }
    }

    renderNonPlayModeMode() {
        const recordButtonText = this.recordButton.querySelector('.custom-button-text');
        const playButtonText = this.playButton.querySelector('.custom-button-text');
        const uploadButtonText = this.uploadButton.querySelector('.custom-button-text');
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
                uploadButtonText.textContent = 'audioa igotzen';
                break;
            case this.state.uploadingEnded:
                uploadButtonText.textContent = 'gorde';
                break;
            case this.state.deleting:
                break;
            default:
                formattedTime = this.formatFromSeconds(this.recordMaxTime);
                recordButtonText.textContent = `grabatu (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
        }
    }

    renderPlayMode() {
        const playButtonText = this.playButton.querySelector('.custom-button-text');
        let formattedTime;
        switch (this.state.currentState) {
            case this.state.idle:
                break;
            case this.state.playing:
                formattedTime = this.formatFromSeconds(this.audio.currentTime);
                playButtonText.textContent = `gelditu (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
            case this.state.playingEnded:
                formattedTime = this.formatFromSeconds(this.audio.duration);
                playButtonText.textContent = `entzun (${formattedTime.minutes}:${formattedTime.seconds})`;
                break;
            default:
                break;
        }
    }    

    record() {
        this.buttonDisable(this.playButton);
        this.buttonDisable(this.uploadButton);
        this.recordButton.classList.add('active');
        if (this.isAudioRecorded()) {
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
        this.buttonToggleDisable(this.playButton);
        this.buttonToggleDisable(this.uploadButton);
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
        this.stopAudio();
        if (this.blob) {
            this.setState({ 'currentState' : this.state.uploading });
            this.uploadButton.classList.add('active');

            const formData = new FormData();
            formData.append('recording', this.blob);
    
            fetch(`/api/upload/${this.uid}`, {
                "method" : "POST",
                "body" : formData
            })
            .then(response => response.json())
            .then(data => {
                this.createListOfAudiosSection(data.files);
            })
            .catch(error => {
                console.error('Errorea fitxategia igotzean:', error);
            });

            this.uploadButton.classList.remove('active');
            this.setState({ 'currentState' : this.state.uploadingEnded });
            this.setState({ 'currentState' : this.state.idle });
        }
        else {
            console.warn('Ez dago audio blob-ik igotzeko prest.');
        }
    }

    deleteFile(filename) {
        fetch(`/api/delete/${this.uid}/${filename}`, {
            "method" : "POST"
        })
        .then(response => response.json())
        .then(data => {
            this.createListOfAudiosSection(data.files);
        })
        .catch(error => {
            console.error('Errorea fitxategia ezabatzean:', error);
        });
    }

    setState(state) {
        this.state = Object.assign({}, this.state, state);
        this.render();
    }

    buttonDisable(button) {
        button.setAttribute('disabled', true);
    }

    buttonEnable(button) {
        button.removeAttribute('disabled');
    }

    buttonToggleDisable(button) {
        if (button.disabled) {
            this.buttonEnable(button);
        }
        else {
            this.buttonDisable(button);
        }
    }

    createListOfAudiosSection(files) {
        const ahotsListSection = document.createElement('section');
        ahotsListSection.className = 'ahots-list';

        const oldSection = document.querySelector('.ahots-list');
        if (oldSection) {
            oldSection.remove();
        }
        document.querySelector('main').appendChild(ahotsListSection);

        files.forEach(file => this.createSavedAudioElement(file));
    }

    createSavedAudioElement(savedFile) {
        const listItem = document.createElement('div');
        listItem.className = 'ahots-list-item';
        document.querySelector('.ahots-list').appendChild(listItem);
    
        this.createSavedAudioLeftIcon(listItem, savedFile);
        this.createSavedAudioText(listItem, savedFile);
        this.createSavedAudioRightIcon(listItem, savedFile);
    }

    createSavedAudioLeftIcon(listItem, savedFile) {
        const leftIcon = document.createElement('img');
        leftIcon.className = 'ahots-list-item-icon';
        leftIcon.alt = 'Copy';
        leftIcon.src = 'images/copy.svg';
        leftIcon.addEventListener('click', () => {
            navigator.clipboard.writeText(`${window.location.origin}/?play=${savedFile.filename}`);
            Snackbar.show({
                text : 'Esteka arbelean kopiatu da!',
                pos : 'bottom-center',
                showAction : false,
                customClass : 'my-snackbar'
            });
        });
        listItem.appendChild(leftIcon);
    }

    createSavedAudioRightIcon(listItem, savedFile) {
        const rightIcon = document.createElement('img');
        rightIcon.className = 'ahots-list-item-icon';
        rightIcon.alt = 'Remove';
        rightIcon.src = 'images/trash3.svg';
        rightIcon.addEventListener('click', () => this.deleteFile(savedFile.filename));
        listItem.appendChild(rightIcon);
    }

    createSavedAudioText(listItem, savedFile) {
        const itemText = document.createElement('span');
        itemText.className = 'ahots-list-item-text';
        itemText.innerText = moment(savedFile.date).fromNow().toLocaleLowerCase();
        listItem.appendChild(itemText);
    }

    formatFromSeconds(seconds) {
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const m = Math.floor(seconds / 60);
        return {
            'minutes' : m,
            'seconds' : s
        }
    }

    getRecordedElapsedTime() {
        return Math.floor(((new Date).getTime() - this.recordStartTime) / 1000);
    }

    getRecordedRemainingTime() {
        return Math.max(0, this.recordMaxTime - this.getRecordedElapsedTime());
    }

    isAudioRecorded() {
        return this.audio.src !== '';
    }

    async isUserLogged() {
        let userId = null;
        await fetch('/users/check-login-status')
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            if (data.status == 'success') {
                userId = data.userid;
            }
        })
        .catch(error => {
            console.error('Errorea erabiltzailearen kautoketa egiaztatzen:', error);
        });
        return userId;
    }

    listUserAudios() {
        fetch(`/api/list/${this.uid}`)
        .then(response => response.json())
        .then(data => {
            this.createListOfAudiosSection(data.files);
        })
        .catch(error => {
            console.error('Errorea fitxategiak eskuratzean:', error);
        });
    }

    setUpButton(wrapperId, innerHtml, clickFunction) {
        const buttonWrapper = document.getElementById(wrapperId);
        buttonWrapper.innerHTML = innerHtml;
        const button = buttonWrapper.getElementsByClassName('custom-button')[0];
        button.setAttribute('onclick', clickFunction);
    }
}

moment.locale('eu');
window.myApp = new App();
