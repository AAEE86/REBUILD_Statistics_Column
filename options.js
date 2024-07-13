document.getElementById('add-column').addEventListener('click', function() {
    addColumn();
});

document.getElementById('save-options').addEventListener('click', function() {
    saveOptions();
});

document.addEventListener('DOMContentLoaded', function() {
    loadOptions();
});

function addColumn(name = '', calculateDuplicates = true, color = '#000000') {
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

    var checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = '计算重复:';
    container.appendChild(checkboxLabel);

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'calculate-duplicates';
    checkbox.checked = calculateDuplicates;
    container.appendChild(checkbox);

    var colorLabel = document.createElement('label');
    colorLabel.textContent = '颜色:';
    container.appendChild(colorLabel);

    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'column-color';
    colorInput.value = color;
    container.appendChild(colorInput);

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
    var calculateDuplicates = [];
    var colors = [];
    var inputs = document.getElementsByClassName('column-name');
    var checkboxes = document.getElementsByClassName('calculate-duplicates');
    var colorInputs = document.getElementsByClassName('column-color');
    for (var i = 0; i < inputs.length; i++) {
        columnNames.push(inputs[i].value);
        calculateDuplicates.push(checkboxes[i].checked);
        colors.push(colorInputs[i].value);
    }

    var url = document.getElementById('url').value;
    var uniqueColumn = document.getElementById('unique-column').value;

    chrome.storage.sync.set({ columnNames: columnNames, calculateDuplicates: calculateDuplicates, colors: colors, url: url, uniqueColumn: uniqueColumn }, function() {
        alert('选项已保存');
    });
}

function loadOptions() {
    chrome.storage.sync.get(['columnNames', 'calculateDuplicates', 'colors', 'url', 'uniqueColumn'], function(result) {
        if (result.url) {
            document.getElementById('url').value = result.url;
        }
        if (result.uniqueColumn) {
            document.getElementById('unique-column').value = result.uniqueColumn;
        }
        if (result.columnNames && result.calculateDuplicates && result.colors) {
            for (var i = 0; i < result.columnNames.length; i++) {
                addColumn(result.columnNames[i], result.calculateDuplicates[i], result.colors[i]);
            }
        }
    });
}
