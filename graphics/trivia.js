const questionData = nodecg.Replicant('questionData')
const activeQuestion = nodecg.Replicant('activeQuestion')
const status = nodecg.Replicant('status')
const elementList = ['question', 'ans1', 'ans2', 'ans3', 'ans4'];

NodeCG.waitForReplicants(questionData, activeQuestion, status).then(() => {
    questionData.on('change', (newVal, oldVal) => loadQuestion())
    activeQuestion.on('change', (newVal, oldVal) => loadQuestion())

    status.on('change', (newVal, oldVal) => {
        if (oldVal !== undefined) {
            if (newVal.showQuestion && !oldVal.showQuestion) {
                document.getElementById('question').style.opacity = 0;
                document.getElementById('question').style.visibility = 'visible';
                fadeIn('question', 1000, () => { })
            }
            if (newVal.showSelected && !oldVal.showSelected) {
                for (let i = 1; i < elementList.length; i++) {
                    if (document.getElementById(elementList[i]).innerHTML === newVal.selectedAnswer)
                        document.getElementById(elementList[i]).style.borderColor = '#34CAFF';
                }
            }
            if (newVal.showAnswer && !oldVal.showAnswer) {
                for (let i = 1; i < elementList.length; i++) {
                    if (document.getElementById(elementList[i]).innerHTML === newVal.answer) {
                        document.getElementById(elementList[i]).style.borderColor = '#F9E433';
                        document.getElementById(elementList[i]).style.backgroundImage = 'linear-gradient(to right, #F85C90 , #F9E433)'
                    }
                }
            }
        }
    })
})

function loadQuestion() {
    try {
        fadeHtml(elementList[0], questionData.value[activeQuestion.value][0], 32);

        let randNumArray = [1, 2, 3, 4];
        for (let i = randNumArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = randNumArray[i];
            randNumArray[i] = randNumArray[j];
            randNumArray[j] = temp;
        }
        for (let i = 1; i < elementList.length; i++) {
            fadeHtml(elementList[i], questionData.value[activeQuestion.value][randNumArray[i - 1]], 32);
            document.getElementById(elementList[i]).style.borderColor = 'transparent';
            document.getElementById(elementList[i]).style.backgroundImage = ''
        }
    } catch { }
}

function fadeOut(element, time, callback) {
    let opacity = 1;
    const interval = setInterval(() => {
        opacity -= 0.01;
        document.getElementById(element).style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(interval);
            callback();
        }
    }, time / 100)
}

function fadeIn(element, time, callback) {
    let opacity = 0;
    const interval = setInterval(() => {
        opacity += 0.01;
        document.getElementById(element).style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(interval);
            callback()
        }
    }, time / 100);
}

function fitText(element, text, maxSize, callback) {
    let testDiv = document.getElementById('testDiv');
    let elementDiv = document.getElementById(element);
    let divWidth = parseInt(getComputedStyle(elementDiv).getPropertyValue('width'), 10);
    let divHeight = parseInt(getComputedStyle(elementDiv).getPropertyValue('height'), 10);
    testDiv.style.fontSize = maxSize + 'pt';
    testDiv.innerHTML = text;
    while (testDiv.offsetWidth > divWidth || testDiv.offsetHeight > divHeight) {
        maxSize--;
        testDiv.style.fontSize = maxSize + 'pt';
        if (maxSize <= 4)
            break;
    }
    elementDiv.style.fontSize = maxSize + 'pt';
    elementDiv.innerHTML = text;
    callback(maxSize + 'pt');
    return;
}

function fitTextQuestion(element, text, maxSize, callback) {
    let testDiv = document.getElementById('questionTestDiv');
    let elementDiv = document.getElementById(element);
    testDiv.style.fontSize = maxSize + 'pt';
    testDiv.innerHTML = text;
    while (testDiv.offsetHeight > 411) {
        maxSize--;
        testDiv.style.fontSize = maxSize + 'pt';
        if (maxSize <= 4)
            break;
    }
    elementDiv.style.fontSize = maxSize + 'pt';
    elementDiv.innerHTML = text;
    callback(maxSize + 'pt');
    return;
}

function fadeHtml(element, text, fontSize) {
    fadeOut(element, 500, () => {
        if (element === 'question') {
            document.getElementById('question').style.visibility = 'hidden';
            fitTextQuestion(element, text, fontSize, () => { })
        }
        else {
            fitText(element, text, fontSize, () => {
                fadeIn(element, 1000, () => { })
            })
        }
    })
}