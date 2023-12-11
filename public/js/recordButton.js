let recordFn = () => {
    let recBtn = document.createElement('button');
    recBtn.className = 'custom-button';

    let icon = document.createElement('img');
    icon.src = '../images/record.svg';
    icon.alt = 'Icon';
    icon.className = 'custom-button-icon';
    recBtn.appendChild(icon);

    let buttonText = document.createElement('span');
    buttonText.textContent = 'grabatu';
    buttonText.className = 'custom-button-text';
    recBtn.appendChild(buttonText);
    
    return recBtn.outerHTML;
};

export { recordFn };
