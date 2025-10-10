document.getElementById('predictForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // --- Prediction history logic ---
    if (!window.predictCount) window.predictCount = 0;
    if (!window.historyCodes) window.historyCodes = [];
    const placementCodes = {
        'Technical Support': 't',
        'Systems Development': 's',
        'Business Operations': 'b',
        'Research': 'r'
    };
    const form = e.target;
    const data = {};
    Array.from(form.elements).forEach(el => {
        if (el.name) data[el.name] = el.value;
    });
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        window.predictCount++;
        let code = placementCodes[result.placement] || '?';
        window.historyCodes.push(code);
        let historyStr = window.historyCodes.map((c, i) => `${i+1}-${c}`).join(', ');
        let html = `<b>Predicted OJT Placement:</b> ${result.placement}<br><br>`;
        html += `<b>Prediction count:</b> ${window.predictCount}<br>`;
        html += `<b>History:</b> ${historyStr}<br><br>`;
        if (result.reasoning) {
            html += `<b>Reasoning:</b> ${result.reasoning}<br><br>`;
        }
        if (result.prob_explanation) {
            html += `<b>Probability Explanation:</b> ${result.prob_explanation}<br><br>`;
        }
        if (result.probabilities) {
            html += `<b>Probabilities:</b><ul>`;
            for (const [field, prob] of Object.entries(result.probabilities)) {
                html += `<li>${field}: ${prob}%</li>`;
            }
            html += `</ul>`;
        }
        document.getElementById('result').innerHTML = html;
    })
    .catch(error => {
        document.getElementById('result').innerHTML = 'Error: Unable to get prediction.';
        console.error(error);
    });
});
