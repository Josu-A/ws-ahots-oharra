let uploadFn = () => {
    let upBtn = document.createElement("button");
    upBtn.className = 'custom-button';
    upBtn.disabled = true;

    let icon = document.createElement('img');
    icon.src = '../images/download.svg';
    icon.alt = 'Icon';
    icon.className = 'custom-button-icon';
    upBtn.appendChild(icon);

    let buttonText = document.createElement('span');
    buttonText.textContent = 'gorde';
    buttonText.className = 'custom-button-text';
    upBtn.appendChild(buttonText);

    return upBtn.outerHTML;
};

export { uploadFn };
