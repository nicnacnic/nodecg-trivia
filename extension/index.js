const Papa = require('./papaParse.min.js')

module.exports = function (nodecg) {
    const questionData = nodecg.Replicant('questionData', { defaultValue: [] })

    nodecg.listenFor('parseCSV', (value) => questionData.value = Papa.parse(value).data);
    nodecg.listenFor('unparseCSV', (value, callback) => callback(null, Papa.unparse(questionData.value)))
};