const questionData = nodecg.Replicant('questionData')
const activeQuestion = nodecg.Replicant('activeQuestion')
const status = nodecg.Replicant('status');

NodeCG.waitForReplicants(questionData, activeQuestion, status).then(() => {

    questionData.on('change', () => loadAnswers())
    activeQuestion.on('change', (newVal, oldVal) => {
        loadAnswers();
        if (oldVal !== undefined)
            status.value = { showQuestion: false, showSelected: false, selectedAnswer: '', showAnswer: false, answer: questionData.value[newVal][1] }
    })
    status.on('change', (newVal) => {
        if (newVal.showQuestion)
            document.getElementById('showQuestion').disabled = true;
        else
            document.getElementById('showQuestion').disabled = false;
        if (newVal.showSelected)
            document.getElementById('selectAnswer').disabled = true;
        else
            document.getElementById('selectAnswer').disabled = false;
        if (newVal.showAnswer)
            document.getElementById('showAnswer').disabled = true;
        else
            document.getElementById('showAnswer').disabled = false;
    })
});

function loadAnswers() {
    try {
        const dropdownContent = document.getElementById("answerList");
        dropdownContent.innerHTML = '';
        for (let i = 1; i < 5; i++) {
            let paperItem = document.createElement("paper-item");
            paperItem.innerHTML = questionData.value[activeQuestion.value][i];
            dropdownContent.appendChild(paperItem);
        }
        dropdownContent.selectIndex(null)
    } catch { }
    document.getElementById('showQuestion').disabled = false;
    document.getElementById('showAnswer').disabled = false;
    document.getElementById('selectAnswer').disabled = false;
}

function nextQuestion() {
    let nextQuestionIndex = activeQuestion.value + 1;
    if (nextQuestionIndex >= questionData.value.length)
        nextQuestionIndex = 0;
    activeQuestion.value = nextQuestionIndex;
}

function showQuestion() {
    status.value.showQuestion = true;
}
function updateSelectedAnswer(element) {
    status.value.selectedAnswer = element.selectedItem.innerHTML;
}
function selectAnswer() {
    if (status.value.selectedAnswer !== '')
        status.value.showSelected = true;
}
function showAnswer() {
    status.value.showAnswer = true;
}