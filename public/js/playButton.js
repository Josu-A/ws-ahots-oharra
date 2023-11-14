function playFn () {
    let playBtn = document.createElement("button");

    playBtn.textContent = "Play";
    playBtn.onclick = () => alert("Clicked");

    return playBtn;
}

export { playFn };
