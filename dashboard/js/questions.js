const questionData = nodecg.Replicant('questionData')
const activeQuestion = nodecg.Replicant('activeQuestion')

NodeCG.waitForReplicants(questionData, activeQuestion).then(() => {
    questionData.on('change', (newVal) => {
        let cardDiv = document.getElementById('questionListDiv');
        cardDiv.innerHTML = '';
        if (newVal !== undefined) {
            let cardId = 0;
            newVal.forEach(question => {
                let card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('id', cardId)

                let cardHeaderDiv = document.createElement('div');
                cardHeaderDiv.classList.add('cardHeaderContainer');

                let cardHeaderText = document.createElement('div');
                cardHeaderText.classList.add('cardHeaderText');
                cardHeaderText.innerHTML = question[0];

                let cardHeaderButton = document.createElement('paper-button');
                cardHeaderButton.classList.add('cardHeaderButton');
                cardHeaderButton.setAttribute('toggles');
                cardHeaderButton.setAttribute('noink');
                cardHeaderButton.setAttribute('onClick', 'toggleCard(this)')
                
                let cardHeaderButtonIcon = document.createElement('iron-icon')
                cardHeaderButtonIcon.setAttribute('icon', 'expand-more');
                cardHeaderButton.appendChild(cardHeaderButtonIcon);

                let collapse = document.createElement('iron-collapse');
                collapse.classList.add('collapse');

                let collapseDiv = document.createElement('div');
                collapseDiv.classList.add('collapseDiv');
                
                let collapseText = document.createElement('div');
                collapseText.classList.add('collapseText');
                collapseText.innerHTML = `<b>Correct:</b> ${question[1]}<br><b>Incorrect:</b> ${question[2]}<br><b>Incorrect:</b> ${question[3]}<br><b>Incorrect:</b> ${question[4]}`;

                let collapseButton = document.createElement('paper-icon-button');
                collapseButton.classList.add('collapseButton');
                collapseButton.setAttribute('icon', 'av:play-circle-outline');
                collapseButton.setAttribute('id', cardId)
                collapseButton.setAttribute('noInk')
                collapseButton.setAttribute('onClick', 'playQuestion(this.id)')
                
                let divider = document.createElement('div');
                divider.classList.add('divider')

                cardHeaderDiv.appendChild(cardHeaderText)
                cardHeaderDiv.appendChild(cardHeaderButton)
                card.appendChild(cardHeaderDiv);
                collapseDiv.appendChild(collapseText);
                collapseDiv.appendChild(collapseButton);
                collapse.appendChild(collapseDiv);
                card.appendChild(collapse);
                cardDiv.appendChild(card);
                cardDiv.appendChild(divider);

                cardId++;
            })
        }

        activeQuestion.on('change', (newVal, oldVal) => {
            const cardList = document.getElementById('questionListDiv').childNodes;
            try {
            cardList[newVal * 2].style.backgroundColor = '#535353';
            if (oldVal !== undefined)
            cardList[oldVal * 2].style.backgroundColor = '#1E1E1E';
            } catch {}
        })
    })
})

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
    activeQuestion.value = 0;
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
    let card = element.parentElement.parentElement.childNodes[1];
    let cardList = document.getElementsByClassName("card");
    for (let i = 0; i < cardList.length; i++) {
        if (cardList[i].childNodes[1].opened) {
            cardList[i].childNodes[1].hide();
            closeCard(cardList[i].childNodes[0].childNodes[1])
        }
    }
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

function playQuestion(id) {
    activeQuestion.value = parseInt(id, 10);
}