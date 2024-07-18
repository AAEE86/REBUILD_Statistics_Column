(async function() {
	'use strict';

	async function extractAndDisplayData(columnNames, calculateDuplicates, colors, uniqueColumn) {
		const table = document.querySelector('.table'); // 根据实际情况修改选择器

		if (!table) {
			console.log('未找到表格');
			return;
		}

		console.log('找到表格:', table);

		const columnIndices = getColumnIndices(table, columnNames, uniqueColumn);
		console.log('列索引:', columnIndices);

		const totals = calculateTotals(table, columnNames, columnIndices, calculateDuplicates, uniqueColumn);
		displayTotals(totals, columnIndices, columnNames, colors);
	}

	function getColumnIndices(table, columnNames, uniqueColumn) {
		const headers = table.querySelectorAll('thead th');
		const indices = Array.from(headers)
			.reduce((indices, header, index) => {
				const text = header.innerText.trim();
				if (columnNames.includes(text) || text === uniqueColumn) {
					indices[text] = index;
				}
				return indices;
			}, {});
		return indices;
	}

	function calculateTotals(table, columnNames, columnIndices, calculateDuplicates, uniqueColumn) {
		const rows = table.querySelectorAll('tbody tr');
		const totals = {};
		const selectedRows = table.querySelectorAll('tbody tr.active');

		columnNames.forEach(name => {
			if (columnIndices[name] !== undefined) {
				totals[name] = 0;
			}
		});

		// 检查唯一列是否存在
		if (columnIndices[uniqueColumn] === undefined) {
			// 如果唯一列不存在，正常计算所有行
			const targetRows = selectedRows.length > 0 ? selectedRows : rows;
			targetRows.forEach(row => {
				const cells = row.querySelectorAll('td');
				columnNames.forEach((name, index) => {
					if (columnIndices[name] !== undefined) {
						const cell = cells[columnIndices[name]];
						if (cell) {
							const value = parseFloat(cell.innerText.trim()
								.replace(/[^\d.-]/g, '')) || 0;
							totals[name] += value;
						}
					}
				});
			});
		} else {
			// 如果唯一列存在，根据唯一列计算
			const seen = new Set();
			const targetRows = selectedRows.length > 0 ? selectedRows : rows;
			targetRows.forEach(row => {
				const cells = row.querySelectorAll('td');
				const uniqueCell = cells[columnIndices[uniqueColumn]];
				const uniqueValue = uniqueCell ? uniqueCell.innerText.trim() : null;

				columnNames.forEach((name, index) => {
					if (columnIndices[name] !== undefined) {
						const cell = cells[columnIndices[name]];
						if (cell) {
							const value = parseFloat(cell.innerText.trim()
								.replace(/[^\d.-]/g, '')) || 0;
							if (calculateDuplicates[index] || !seen.has(uniqueValue)) {
								totals[name] += value;
							}
						}
					}
				});

				seen.add(uniqueValue);
			});
		}

		return totals;
	}

	function displayTotals(totals, columnIndices, columnNames, colors) {
		const sumText = columnNames.map((name, index) => {
				if (columnIndices[name] !== undefined) {
					return `<span class="stat-item">${name}: <span style="color: ${colors[index]};">¥ ${totals[name].toFixed(2)}</span></span>`;
				}
				return '';
			})
			.join('');

		// 插入到目标元素内部
		const targetElement = document.querySelector('.list-stats-settings');
		if (targetElement) {
			targetElement.innerHTML = sumText;
			targetElement.style.display = 'unset';
			targetElement.style.fontSize = '13.5px';
			targetElement.style.fontWeight = 'bold';
			targetElement.style.opacity = 'unset';
			targetElement.style.padding = '11px 0px'
		} else {
			console.log('未找到 .dataTables_info 元素');
		}
	}

	function observeTableChanges(columnNames, calculateDuplicates, colors, uniqueColumn) {
		const targetNode = document.querySelector('.table');
		if (!targetNode) {
			console.log('未找到 .table 元素以进行观察');
			return;
		}

		const config = {
			childList: true,
			subtree: true
		};
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					extractAndDisplayData(columnNames, calculateDuplicates, colors, uniqueColumn);
				}
			}
		});

		observer.observe(targetNode, config);

		// 添加对选项框状态变化的监听
		targetNode.addEventListener('change', (event) => {
			if (event.target.matches('.custom-control-input')) {
				const row = event.target.closest('tr');
				if (row) {
					row.classList.toggle('active', event.target.checked);
					extractAndDisplayData(columnNames, calculateDuplicates, colors, uniqueColumn);
				}
			}
		});
	}

	window.onload = async () => {
		const result = await new Promise((resolve) => {
			chrome.storage.sync.get(['columnNames', 'calculateDuplicates', 'colors', 'url', 'uniqueColumn'], resolve);
		});
		const currentUrl = window.location.href;
		if (result.url && currentUrl.startsWith(result.url)) {
			if (result.columnNames) {
				extractAndDisplayData(result.columnNames, result.calculateDuplicates, result.colors, result.uniqueColumn);
				observeTableChanges(result.columnNames, result.calculateDuplicates, result.colors, result.uniqueColumn);
			}
		}
	};

})();