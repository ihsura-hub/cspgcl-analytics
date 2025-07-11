// --- Global State & Configuration ---
const API_URL = 'http://localhost:3000/api/data';
let fullData = [];
let monthlyData = [];
const charts = {};

// --- DOM Element References ---
const monthSelect = document.getElementById('monthSelect');
const calendarGrid = document.getElementById('calendarGrid');
const calendarHeader = document.getElementById('calendarHeader');
const selectedDataPanel = document.getElementById('selectedDataPanel');
const faqSelect = document.getElementById('faq-select');
const faqAnswer = document.getElementById('faq-answer');

// --- Helper Functions ---
function createHighlightDataset() {
    return {
        label: 'Selected Date', data: [], type: 'line', pointBackgroundColor: 'red',
        pointRadius: 6, borderWidth: 0, showLine: false, order: -1,
    };
}

function showTab(index) {
    document.querySelectorAll('.tab-content').forEach((tab, i) =>
        tab.classList.toggle('active', i === index)
    );
    document.querySelectorAll('.tab-btn').forEach((btn, i) =>
        btn.classList.toggle('active', i === index)
    );
}

function renderCalendar(monthYear) {
    calendarGrid.innerHTML = '';
    calendarHeader.innerHTML = '';
    const [year, month] = monthYear.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        calendarHeader.innerHTML += `<div>${day}</div>`;
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.innerHTML += `<div class="calendar-cell empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.textContent = day;
        cell.dataset.date = dateStr;
        cell.addEventListener('click', () => handleDateClick(cell));
        calendarGrid.appendChild(cell);
    }
}

function clearSelection() {
    document.querySelectorAll('.calendar-cell.selected').forEach(c => c.classList.remove('selected'));
    Object.values(charts).forEach(chart => {
        // Find any highlight dataset by its label
        const highlightDataset = chart.data.datasets.find(ds => ds.label === 'Selected Date' || ds.label === 'Selected Day');
        if (highlightDataset) {
            highlightDataset.data = [];
            chart.update();
        }
    });
    selectedDataPanel.innerHTML = '<em>Select a date to see details.</em>';
}

// --- Main Application Logic ---

function updateChartsForMonth(monthYear) {
    monthlyData = fullData.filter(row => row.Date.startsWith(monthYear));
    
    const labels = monthlyData.map(row => row.Date);
    const generation = monthlyData.map(row => parseFloat(row["Generation (MU)"]));
    const coal = monthlyData.map(row => parseFloat(row["Coal Cons. (MT)"]));
    const heatRate = monthlyData.map(row => parseFloat(row["Heat Rate (kcal/kWh)"]));
    const specCoal = monthlyData.map(row => parseFloat(row["Spec. Coal (kg/kWh)"]));
    
    charts.generation.data.labels = labels;
    charts.generation.data.datasets[0].data = generation;
    
    charts.coal.data.labels = labels;
    charts.coal.data.datasets[0].data = coal;
    
    charts.heatRate.data.labels = labels;
    charts.heatRate.data.datasets[0].data = heatRate;
    
    charts.specCoal.data.labels = labels;
    charts.specCoal.data.datasets[0].data = specCoal;

    // Update scatter plot
    charts.scatter.data.datasets[0].data = monthlyData.map(d => ({
        x: parseFloat(d["Generation (MU)"]),
        y: parseFloat(d["Spec. Coal (kg/kWh)"])
    }));

    Object.values(charts).forEach(chart => chart.update());
    clearSelection();

    faqSelect.value = '';
    displayFaqAnswer('');
}

function handleDateClick(cellElement) {
    if (cellElement.classList.contains('empty')) return;
    clearSelection();
    cellElement.classList.add('selected');
    const selectedDate = cellElement.dataset.date;
    const dataPoint = monthlyData.find(d => d.Date === selectedDate);
    if (!dataPoint) { selectedDataPanel.innerHTML = `<strong>Date:</strong> ${selectedDate}<br/><em>No data.</em>`; return; }
    
    selectedDataPanel.innerHTML = `
        <strong>Date:</strong> ${dataPoint.Date}<br/>
        <strong>Generation:</strong> ${dataPoint["Generation (MU)"]} MU<br/>
        <strong>Coal:</strong> ${dataPoint["Coal Cons. (MT)"]} MT<br/>
        <strong>Heat Rate:</strong> ${dataPoint["Heat Rate (kcal/kWh)"]} kcal/kWh<br/>
        <strong>Specific Coal:</strong> ${dataPoint["Spec. Coal (kg/kWh)"]} kg/kWh
    `;
    
    // Highlight all charts
    Object.values(charts).forEach(chart => {
        const highlightDataset = chart.data.datasets.find(ds => ds.label === 'Selected Date' || ds.label === 'Selected Day');
        if (!highlightDataset) return;
        const mainDataset = chart.data.datasets[0];
        const idx = chart.data.labels.indexOf(selectedDate);
        
        if (chart.config.type === 'scatter') {
            const scatterHighlightData = { 
                x: parseFloat(dataPoint["Generation (MU)"]), 
                y: parseFloat(dataPoint["Spec. Coal (kg/kWh)"]) 
            };
            highlightDataset.data = [scatterHighlightData];
        } else if (idx !== -1) {
            const val = mainDataset.data[idx];
            if (chart.config.type === 'bar') { 
                const highlightData = new Array(mainDataset.data.length).fill(null); 
                highlightData[idx] = val; 
                highlightDataset.data = highlightData; 
            } else { 
                highlightDataset.data = chart.data.labels.map((_, i) => (i === idx ? val : null)); 
            }
        }
        chart.update();
    });
}

function displayFaqAnswer(question) {
    if (!question) {
        faqAnswer.innerHTML = '<em>Your answer will appear here.</em>';
        return;
    }

    let answer = '';

    // Suggestive Measures (Static Answers)
    if (question === 'improve_heat_rate') {
        answer = `<strong>To improve a high Heat Rate (lower is better):</strong><ul><li>Optimize soot blowing to clean boiler tubes.</li><li>Check and seal leaks in the Air Pre-Heater (APH).</li><li>Ensure condenser is clean and maintaining optimal vacuum.</li><li>Fine-tune the air-to-fuel ratio to control excess air.</li></ul>`;
    } else if (question === 'diagnose_low_gen') {
        answer = `<strong>Common causes for consistently low generation include:</strong><ul><li>Boiler tube leaks forcing a load reduction.</li><li>Poor performance or choke-ups in coal mills.</li><li>High vibrations in the turbine or generator.</li><li>Low grid demand as per State Load Dispatch Centre (SLDC).</li></ul>`;
    } else if (question === 'investigate_high_coal') {
        answer = `<strong>High Specific Coal Consumption is linked to two main factors:</strong><ol><li><strong>Poor Plant Efficiency:</strong> First, address all points for improving the Heat Rate.</li><li><strong>Poor Coal Quality:</strong> Check lab reports for low Gross Calorific Value (GCV) and review coal blending strategies.</li></ol>`;
    } else if (question === 'understand_trip') {
        answer = `A large, sudden generation drop almost always signifies a <strong>Unit Trip</strong> (an automatic protective shutdown). Review the station's event logs for that date to find the root cause (e.g., boiler, turbine, or generator fault).`;
    
    // Data Analysis (Dynamic Answers)
    } else if (monthlyData.length > 0) {
        switch (question) {
            case 'highest_generation': {
                const bestDay = monthlyData.reduce((p, c) => (parseFloat(p["Generation (MU)"]) > parseFloat(c["Generation (MU)"])) ? p : c);
                answer = `The highest generation was <strong>${bestDay["Generation (MU)"]} MU</strong> on <strong>${bestDay.Date}</strong>.`;
                break;
            }
            case 'lowest_spec_coal': {
                const bestDay = monthlyData.reduce((p, c) => (parseFloat(p["Spec. Coal (kg/kWh)"]) < parseFloat(c["Spec. Coal (kg/kWh)"])) ? p : c);
                answer = `The most fuel-efficient day was <strong>${bestDay.Date}</strong> with <strong>${bestDay["Spec. Coal (kg/kWh)"]} kg/kWh</strong>.`;
                break;
            }
            case 'avg_heat_rate': {
                const total = monthlyData.reduce((sum, day) => sum + parseFloat(day["Heat Rate (kcal/kWh)"]), 0);
                answer = `The average heat rate was <strong>${(total / monthlyData.length).toFixed(2)} kcal/kWh</strong>.`;
                break;
            }
            case 'total_coal': {
                const total = monthlyData.reduce((sum, day) => sum + parseFloat(day["Coal Cons. (MT)"]), 0);
                answer = `The total coal consumed this month was <strong>${total.toFixed(2)} MT</strong>.`;
                break;
            }
        }
    } else {
        answer = 'No data available to answer this question for the selected month.';
    }
    
    faqAnswer.innerHTML = answer;
}

async function initializeDashboard() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network error');
        fullData = await response.json();
        
        const availableMonths = [...new Set(fullData.map(d => d.Date.substring(0, 7)))];
        monthSelect.innerHTML = availableMonths.map(month => {
            const date = new Date(`${month}-02`);
            const monthName = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return `<option value="${month}">${monthName} ${year}</option>`;
        }).join('');
        
        initializeCharts();
        
        if (availableMonths.length > 0) {
            const currentMonth = availableMonths[0];
            monthSelect.value = currentMonth;
            renderCalendar(currentMonth);
            updateChartsForMonth(currentMonth);
        }
        
        monthSelect.addEventListener('change', (e) => {
            renderCalendar(e.target.value);
            updateChartsForMonth(e.target.value);
        });
        
        faqSelect.addEventListener('change', () => displayFaqAnswer(faqSelect.value));

    } catch (error) {
        console.error("Failed to initialize dashboard:", error);
        alert("Failed to load data from API.");
    }
}

function initializeCharts() {
    const commonOptions = { responsive: true, maintainAspectRatio: false };

    charts.generation = new Chart(document.getElementById('generationChart'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Generation (MU)', data: [], borderColor: '#36A2EB' }, createHighlightDataset()] },
        options: commonOptions
    });
    
    const barHighlight = createHighlightDataset();
    barHighlight.type = 'bar';
    barHighlight.backgroundColor = 'red';
    delete barHighlight.pointBackgroundColor;

    charts.coal = new Chart(document.getElementById('coalChart'), {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Coal Consumption (MT)', data: [], backgroundColor: 'rgba(75, 192, 192, 0.6)' }, barHighlight] },
        options: commonOptions
    });

    charts.heatRate = new Chart(document.getElementById('heatRateChart'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Heat Rate (kcal/kWh)', data: [], borderColor: 'orange' }, createHighlightDataset()] },
        options: commonOptions
    });

    charts.specCoal = new Chart(document.getElementById('specCoalChart'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Specific Coal (kg/kWh)', data: [], borderColor: 'purple' }, createHighlightDataset()] },
        options: commonOptions
    });

    // Initialize Scatter Plot
    charts.scatter = new Chart(document.getElementById('scatterChart'), {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Daily Data',
                    data: [],
                    backgroundColor: 'teal'
                },
                {
                    label: 'Selected Day',
                    data: [],
                    backgroundColor: 'red',
                    pointRadius: 8,
                    radius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { title: { display: true, text: 'Generation (MU)' } },
              y: { title: { display: true, text: 'Spec. Coal (kg/kWh)' } }
            }
        }
    });
}

// Start the whole application
initializeDashboard();