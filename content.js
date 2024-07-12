(function() {
    'use strict';

    function extractAndDisplayData() {
        // 找到表格
        var table = document.querySelector('.table'); // 根据实际情况修改选择器

        if (table) {
            console.log('找到表格:', table);

            // 找到表头中订单金额、已回款和未回款列的索引
            var huikuanjineIndex = -1, orderAmountIndex = -1, yihuiKuanIndex = -1, weiHuiKuanIndex = -1;
            var headers = table.querySelectorAll('thead th');
            headers.forEach(function(header, index) {
                var text = header.innerText.trim();
                if (text === '回款金额') {
                    huikuanjineIndex = index;
                } else if (text === '订单金额') {
                    orderAmountIndex = index;
                } else if (text === '已回款') {
                    yihuiKuanIndex = index;
                } else if (text === '未回款') {
                    weiHuiKuanIndex = index;
                }
            });

            if (huikuanjineIndex !== -1 && orderAmountIndex !== -1 && yihuiKuanIndex !== -1 && weiHuiKuanIndex !== -1) {
                console.log('回款金额列索引:', huikuanjineIndex);
                console.log('订单金额列索引:', orderAmountIndex);
                console.log('已回款列索引:', yihuiKuanIndex);
                console.log('未回款列索引:', weiHuiKuanIndex);

                // 找到所有行中订单金额、已回款和未回款列的数据
                var rows = table.querySelectorAll('tbody tr');
                var totalhuikuanjine = 0, totalOrderAmount = 0, totalYiHuiKuan = 0, totalWeiHuiKuan = 0;

                rows.forEach(function(row, rowIndex) {
                    var cells = row.querySelectorAll('td');

                    // 提取回款金额并计算总和
                    var huikuanjine = parseFloat(cells[huikuanjineIndex].innerText.trim().replace(/[^\d.-]/g, ''));
                    totalhuikuanjine += huikuanjine;

                    // 提取订单金额并计算总和
                    var orderAmount = parseFloat(cells[orderAmountIndex].innerText.trim().replace(/[^\d.-]/g, ''));
                    totalOrderAmount += orderAmount;

                    // 提取已回款并计算总和
                    var yiHuiKuan = parseFloat(cells[yihuiKuanIndex].innerText.trim().replace(/[^\d.-]/g, ''));
                    totalYiHuiKuan += yiHuiKuan;

                    // 提取未回款并计算总和
                    var weiHuiKuan = parseFloat(cells[weiHuiKuanIndex].innerText.trim().replace(/[^\d.-]/g, ''));
                    totalWeiHuiKuan += weiHuiKuan;
                });

                // 创建显示总和的文本元素
                let sumText = `
                    <span style="margin-right: 20px;">总回款金额: <span style="color: #4CAF50;">¥ ${totalhuikuanjine.toFixed(2)}</span></span>
                    <span style="margin-right: 20px;">总订单金额: <span style="color: #2196F3;">¥ ${totalOrderAmount.toFixed(2)}</span></span>
                    <span style="margin-right: 20px;">总已回款: <span style="color: #8BC34A;">¥ ${totalYiHuiKuan.toFixed(2)}</span></span>
                    <span>总未回款: <span style="color: #F44336;">¥ ${totalWeiHuiKuan.toFixed(2)}</span></span>
                `;

                // 检查并移除已存在的 sumDiv
                let existingSumDiv = document.querySelector('.sum-div');
                if (existingSumDiv) {
                    existingSumDiv.remove();
                }

                // 创建一个新的 div 元素并设置样式
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
                sumDiv.style.zIndex = '9999'; // 确保在最上层显示
                sumDiv.style.fontFamily = 'Arial, sans-serif';
                sumDiv.style.fontSize = '14px';
                sumDiv.style.display = 'flex';
                sumDiv.style.alignItems = 'center';
                sumDiv.style.justifyContent = 'flex-start';

                // 将 sumDiv 添加到文档中
                document.body.appendChild(sumDiv);
            } else {
                console.log('未找到回款金额、订单金额、已回款或未回款列');
            }
        } else {
            console.log('未找到表格');
        }
    }

    // 使用 MutationObserver 监听 .table 的变化
    function observeTableChanges() {
        var targetNode = document.querySelector('.table');
        if (targetNode) {
            var config = { childList: true, subtree: true };
            var callback = function(mutationsList, observer) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        extractAndDisplayData();
                    }
                }
            };
            var observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        } else {
            console.log('未找到 .table 元素以进行观察');
        }
    }

    // 等待页面加载完成再执行
    window.addEventListener('load', function() {
        setTimeout(function() {
            extractAndDisplayData();
            observeTableChanges();
        }, 1000); // 延迟执行，适当调整时间
    });

})();
