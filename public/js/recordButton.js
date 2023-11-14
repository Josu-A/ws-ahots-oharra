function recordFn () {
    let recBtn = document.createElement("button");

    recBtn.textContent = "Record";
    recBtn.onclick = () => alert("Clicked");

    return recBtn;
}

export { recordFn };
