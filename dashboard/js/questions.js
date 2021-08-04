function uploadFile(file, button) {
    if (!file.name.includes('.csv'))
        return;
    button.disabled = true;
    let rotation = 360;
    const updateText = setInterval(() => {
        button.innerHTML = `<iron-icon icon="cached" style="transform: rotate(-${rotation}deg);"></iron-icon>&nbsp;Uploading...`;
        rotation++;
        if (rotation >= 360)
            rotation = 0;
    }, 1)
    setTimeout(() => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            clearInterval(updateText)
            nodecg.sendMessage('parseCSV', reader.result)
            button.disabled = false;
            button.innerHTML = `<iron-icon icon="file-upload"></iron-icon>
            &nbsp; Upload`;
        };
    }, 1000)
}

function downloadData() {
    nodecg.sendMessage('unparseCSV').then(result => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(result));
        element.setAttribute('download', 'data.csv');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    })
}

function toggleCard(element) {
    let card = element.parentElement.parentElement.childNodes[3];
    let cardList = document.getElementsByClassName("card");
    for (let i = 0; i < cardList.length; i++) {
        if (cardList[i].childNodes[3].opened) {
            cardList[i].childNodes[3].hide();
            closeCard(cardList[i].childNodes[1].childNodes[3])
        }
    }
    console.log(element.active)
    if (element.active) {
        card.show();
        openCard(element);
    }
}

function openCard(element) {
    let rotation = 0;
    const flipArrow = setInterval(() => {
        element.style.transform = `rotate(${rotation}deg)`
        rotation -= 3.5;
        if (rotation <= -180) {
            element.style.transform = `rotate(-180deg)`;
            clearInterval(flipArrow)
        }
    }, 1)
}

function closeCard(element) {
    element.active = false;
    let rotation = 180;
    const flipArrow = setInterval(() => {
        element.style.transform = `rotate(${rotation}deg)`
        rotation += 3.5;
        if (rotation >= 360) {
            element.style.transform = `rotate(360deg)`;
            clearInterval(flipArrow)
        }
    }, 1)
}