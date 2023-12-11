let playFn = () => {
    let playBtn = document.createElement("button");
    playBtn.className = 'custom-button';
    playBtn.disabled = true;

    let icon = document.createElement('img');
    icon.src = '../images/play.svg';
    icon.alt = 'Icon';
    icon.className = 'custom-button-icon';
    playBtn.appendChild(icon);

    let buttonText = document.createElement('span');
    buttonText.textContent = 'entzun (0:00)';
    buttonText.className = 'custom-button-text';
    playBtn.appendChild(buttonText);

    return playBtn.outerHTML;
};

export { playFn };
