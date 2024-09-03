document.addEventListener("DOMContentLoaded", () => {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1j92sZraPFCeKvJDrWO7VYn0PzxGNGVxydfm2Tvwf3WY/pub?gid=0&single=true&output=csv';
    const dataList = document.getElementById('data-list');
    const detailView = document.getElementById('detail-view');
    const detailContent = document.getElementById('detail-content');
    const closeDetailBtn = document.getElementById('close-detail');

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            const rows = parseCSV(data);
            let listHtml = '';

            rows.slice(1).forEach(row => {
                listHtml += `<div class="data-item" data-row='${JSON.stringify(row)}'>${row[0]}</div>`;
            });

            dataList.innerHTML = listHtml;

            dataList.addEventListener('click', event => {
                if (event.target.classList.contains('data-item')) {
                    const row = JSON.parse(event.target.getAttribute('data-row'));
                    const headers = ['Descripción', 'Sueldo básico mensual', 'Sueldo básico jornal', 'Hora extra 50%', 'Hora extra 100%'];
                    detailContent.innerHTML = headers.map((header, index) =>
                        `<p class="label">${header} : ${row[index] || ''}</p>`
                    ).join('');
                    detailView.classList.remove('hidden');
                    detailView.style.transform = 'scale(1)'; // Restablece el efecto de acercamiento
                }
            });

            closeDetailBtn.addEventListener('click', () => {
                detailView.classList.add('hidden');
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            dataList.innerHTML = '<div>No se pudieron cargar los datos.</div>';
        });
});

function parseCSV(data) {
    const rows = [];
    let row = [];
    let cell = '';
    let insideQuote = false;

    for (const char of data) {
        if (char === '"') {
            insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
            row.push(cell.trim());
            cell = '';
        } else if (char === '\n' && !insideQuote) {
            row.push(cell.trim());
            rows.push(row);
            row = [];
            cell = '';
        } else {
            cell += char;
        }
    }

    if (cell) {
        row.push(cell.trim());
    }
    if (row.length) {
        rows.push(row);
    }

    return rows;
}
