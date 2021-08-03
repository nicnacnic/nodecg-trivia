function printFile(file, button) {
    button.disabled = true;
    button.innerHTML = `&nbsp;Uploading...`;
    setTimeout(() => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            nodecg.sendMessage('parseCSV', reader.result)
            button.disabled = false;
            button.innerHTML = `<iron-icon icon="file-upload"></iron-icon>
            &nbsp; Upload .csv`;
        };
    }, 500)
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