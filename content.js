(function() {
    'use strict';

    function extractAndDisplayData(columnNames) {
        var table = document.querySelector('.table'); // 根据实际情况修改选择器

        if (table) {
            console.log('找到表格:', table);

            var columnIndices = {};
            var headers = table.querySelectorAll('thead th');
            headers.forEach(function(header, index) {
                var text = header.innerText.trim();
                if (columnNames.includes(text)) {
                    columnIndices[text] = index;
                }
            });

            console.log('列索引:', columnIndices);

            var rows = table.querySelectorAll('tbody tr');
            var totals = {};

            columnNames.forEach(function(name) {
                totals[name] = 0;
            });

            rows.forEach(function(row) {
                var cells = row.querySelectorAll('td');
                columnNames.forEach(function(name) {
                    if (columnIndices[name] !== undefined) {
                        var value = parseFloat(cells[columnIndices[name]].innerText.trim().replace(/[^\d.-]/g, ''));
                        totals[name] += value;
                    }
                });
            });

            let sumText = '';
            columnNames.forEach(function(name) {
                if (columnIndices[name] !== undefined) {
                    sumText += `<span style="margin-right: 10px;">总${name}: <span style="color: #4CAF50;">¥ ${totals[name].toFixed(2)}</span></span>`;
                }
            });

            let existingSumDiv = document.querySelector('.sum-div');
            if (existingSumDiv) {
                existingSumDiv.remove();
            }

            let sumDiv = document.createElement('div');
            sumDiv.innerHTML = sumText;
            sumDiv.classList.add('sum-div');
            sumDiv.style.position = 'fixed';
            sumDiv.style.bottom = '10px';
            sumDiv.style.left = '450px';
            sumDiv.style.backgroundColor = '#fff';
            sumDiv.style.padding = '10px 20px';
            sumDiv.style.border = '1px solid #ccc';
            sumDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            sumDiv.style.borderRadius = '8px';
            sumDiv.style.zIndex = '9999';
            sumDiv.style.fontFamily = 'Arial, sans-serif';
            sumDiv.style.fontSize = '14px';
            sumDiv.style.display = 'flex';
            sumDiv.style.alignItems = 'center';
            sumDiv.style.justifyContent = 'flex-start';

            document.body.appendChild(sumDiv);
        } else {
            console.log('未找到表格');
        }
    }

    function observeTableChanges(columnNames) {
        var targetNode = document.querySelector('.table');
        if (targetNode) {
            var config = { childList: true, subtree: true };
            var callback = function(mutationsList, observer) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        extractAndDisplayData(columnNames);
                    }
                }
            };
            var observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        } else {
            console.log('未找到 .table 元素以进行观察');
        }
    }

    window.addEventListener('load', function() {
        setTimeout(function() {
            chrome.storage.sync.get(['columnNames', 'url'], function(result) {
                if (result.url && window.location.href.includes(result.url)) {
                    if (result.columnNames) {
                        extractAndDisplayData(result.columnNames);
                        observeTableChanges(result.columnNames);
                    }
                }
            });
        }, 1000); // 延迟执行，适当调整时间
    });

})();
