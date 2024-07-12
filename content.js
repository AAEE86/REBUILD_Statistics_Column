(async function() {
    'use strict';

    // 主函数，提取并显示数据
    async function extractAndDisplayData(columnNames) {
        const table = document.querySelector('.table'); // 根据实际情况修改选择器

        if (!table) {
            console.log('未找到表格');
            return;
        }

        console.log('找到表格:', table);

        const columnIndices = getColumnIndices(table, columnNames);
        console.log('列索引:', columnIndices);

        const totals = calculateTotals(table, columnNames, columnIndices);
        displayTotals(totals, columnIndices);
    }

    // 获取列索引
    function getColumnIndices(table, columnNames) {
        const headers = table.querySelectorAll('thead th');
        return Array.from(headers).reduce((indices, header, index) => {
            const text = header.innerText.trim();
            if (columnNames.includes(text)) {
                indices[text] = index;
            }
            return indices;
        }, {});
    }

    // 计算每列的总和
    function calculateTotals(table, columnNames, columnIndices) {
        const rows = table.querySelectorAll('tbody tr');
        const totals = {};

        columnNames.forEach(name => {
            if (columnIndices[name] !== undefined) {
                totals[name] = 0;
            }
        });

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            columnNames.forEach(name => {
                if (columnIndices[name] !== undefined) {
                    const value = parseFloat(cells[columnIndices[name]].innerText.trim().replace(/[^\d.-]/g, '')) || 0;
                    totals[name] += value;
                }
            });
        });

        return totals;
    }

    // 显示总和
    function displayTotals(totals, columnIndices) {
        const sumText = Object.entries(totals).map(([name, total]) => {
            if (columnIndices[name] !== undefined) {
                return `<span style="margin-right: 20px;">总${name}: <span style="color: #4CAF50;">¥ ${total.toFixed(2)}</span></span>`;
            }
            return '';
        }).join('');

        // 检查并移除已存在的 sumDiv
        const existingSumDiv = document.querySelector('.sum-div');
        if (existingSumDiv) {
            existingSumDiv.remove();
        }

        // 创建一个新的 div 元素并设置样式
        const sumDiv = document.createElement('div');
        sumDiv.innerHTML = sumText;
        sumDiv.classList.add('sum-div');
        sumDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 450px;
            background-color: #fff;
            padding: 10px 20px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        `;

        document.body.appendChild(sumDiv);
    }

    // 监听表格变化
    function observeTableChanges(columnNames) {
        const targetNode = document.querySelector('.table');
        if (!targetNode) {
            console.log('未找到 .table 元素以进行观察');
            return;
        }

        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    extractAndDisplayData(columnNames);
                }
            }
        });

        observer.observe(targetNode, config);
    }

    // 等待页面加载完成再执行
    window.addEventListener('load', async () => {
        setTimeout(async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.sync.get(['columnNames', 'url'], resolve);
            });
            const currentUrl = window.location.href;
            if (result.url && currentUrl.startsWith(result.url)) {
                if (result.columnNames) {
                    extractAndDisplayData(result.columnNames);
                    observeTableChanges(result.columnNames);
                }
            }
        }, 1000); // 延迟执行，适当调整时间
    });

})();
