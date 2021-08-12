const Papa = require('./papaParse.min.js')

module.exports = function (nodecg) {
    const questionData = nodecg.Replicant('questionData', { defaultValue: [] })
    const activeQuestion = nodecg.Replicant('activeQuestion', { defaultValue: 0 })
    const status = nodecg.Replicant('status', { defaultValue: { showQuestion: false, showSelected: false, selectedAnswer: '', showAnswer: false, answer: '' }})

    nodecg.listenFor('parseCSV', (value) => questionData.value = Papa.parse(value).data);
    nodecg.listenFor('unparseCSV', (value, callback) => callback(null, Papa.unparse(questionData.value)))
};