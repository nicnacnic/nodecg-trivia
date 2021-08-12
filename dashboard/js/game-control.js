const questionData = nodecg.Replicant('questionData')
const activeQuestion = nodecg.Replicant('activeQuestion')
const status = nodecg.Replicant('status');

NodeCG.waitForReplicants(questionData, activeQuestion, status).then(() => {
    
    activeQuestion.on('change', (newVal, oldVal) => {
        const dropdownContent = document.getElementById("answerList");
			dropdownContent.innerHTML = '';
			for (let i = 1; i < 5; i++) {
				let paperItem = document.createElement("paper-item");
				paperItem.innerHTML = questionData.value[newVal][i];
                dropdownContent.appendChild(paperItem);
			}
            dropdownContent.selectIndex(null)
    })
});

function nextQuestion() {
    let nextQuestionIndex = activeQuestion.value + 1;
    activeQuestion.value = nextQuestionIndex;
    status.value = { showQuestion: false, showSelected: false, selectedAnswer: '', showAnswer: false, answer: questionData.value[nextQuestionIndex][1] }
    document.getElementById('showQuestion').disabled = false;
    document.getElementById('showAnswer').disabled = false;
    document.getElementById('selectAnswer').disabled = false;
}

function showQuestion(element) {
    status.value.showQuestion = true;
    element.disabled = true;
}
function updateSelectedAnswer(element) {
	status.value.selectedAnswer = element.selectedItem.innerHTML;
}
function selectAnswer(element) {
    if (status.value.selectedAnswer !== '') {
        status.value.showSelected = true;
        element.disabled = true;
    }
}
function showAnswer(element) {
    status.value.showAnswer = true;
    element.disabled = true;
}