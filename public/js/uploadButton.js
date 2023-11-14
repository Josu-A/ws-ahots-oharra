function uploadFn () {
    let upBtn = document.createElement("button");

    upBtn.textContent = "Upload";
    upBtn.onclick = () => alert("Clicked");

    return upBtn;
}

export { uploadFn };
