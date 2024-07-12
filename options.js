document.getElementById('add-column').addEventListener('click', function() {
    addColumn();
});

document.getElementById('save-options').addEventListener('click', function() {
    saveOptions();
});

document.addEventListener('DOMContentLoaded', function() {
    loadOptions();
});

function addColumn(name = '') {
    var container = document.createElement('div');
    container.className = 'form-group';

    var label = document.createElement('label');
    label.textContent = '列名称:';
    container.appendChild(label);

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'column-name';
    input.value = name;
    input.placeholder = '请输入列名称';
    container.appendChild(input);

    var removeButton = document.createElement('button');
    removeButton.className = 'remove-column';
    removeButton.textContent = '删除';
    removeButton.addEventListener('click', function() {
        container.remove();
    });
    container.appendChild(removeButton);

    document.getElementById('options-container').appendChild(container);
}

function saveOptions() {
    var columnNames = [];
    var inputs = document.getElementsByClassName('column-name');
    for (var i = 0; i < inputs.length; i++) {
        columnNames.push(inputs[i].value);
    }

    var url = document.getElementById('url').value;

    chrome.storage.sync.set({ columnNames: columnNames, url: url }, function() {
        alert('选项已保存');
    });
}

function loadOptions() {
    chrome.storage.sync.get(['columnNames', 'url'], function(result) {
        if (result.url) {
            document.getElementById('url').value = result.url;
        }
        if (result.columnNames) {
            result.columnNames.forEach(function(name) {
                addColumn(name);
            });
        }
    });
}
