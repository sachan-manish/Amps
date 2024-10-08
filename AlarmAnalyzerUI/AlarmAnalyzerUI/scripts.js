document.getElementById('csvFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function (results) {
                const data = results.data;

                // Populate charts using data
                createTripAlarmChart(data);
                createClearedAlarmsChart(data);
                createSubstationCharts(data);
            }
        });
    }
});

// Create Trip Alarm Bar Chart
function createTripAlarmChart(data) {
    const chart = echarts.init(document.getElementById('tripChart'));
    const tripData = extractTripData(data);

    const chartOptions = {
        title: { text: 'Trip Alarms', textStyle: { color: '#005f87' } },
        xAxis: { type: 'category', data: tripData.labels, axisLine: { lineStyle: { color: '#005f87' } } },
        yAxis: { type: 'value', axisLine: { lineStyle: { color: '#005f87' } } },
        series: [{ data: tripData.values, type: 'bar', itemStyle: { color: '#009999' } }]
    };

    chart.setOption(chartOptions);
}

// Create Cleared Alarms Percentage Chart
function createClearedAlarmsChart(data) {
    const chart = echarts.init(document.getElementById('clearedChart'));
    const clearedData = extractClearedAlarmsData(data);

    const chartOptions = {
        title: { text: 'Cleared Alarms', textStyle: { color: '#005f87' } },
        series: [{
            type: 'pie',
            radius: '60%',
            data: [
                { value: clearedData.cleared, name: 'Cleared', itemStyle: { color: '#009999' } },
                { value: clearedData.uncleared, name: 'Uncleared', itemStyle: { color: '#ff6600' } }
            ]
        }]
    };

    chart.setOption(chartOptions);
}

// Extract Trip Alarm Data from CSV
function extractTripData(data) {
    // Logic to extract Trip Alarm data
    return { labels: ['Jan', 'Feb', 'Mar'], values: [10, 15, 20] };  // Example data
}

// Extract Cleared Alarms Data from CSV
function extractClearedAlarmsData(data) {
    // Logic to extract Cleared Alarms data
    return { cleared: 60, uncleared: 40 };  // Example data
}

// Extract Substation Data from CSV
function extractSubstationData(data, substation) {
    // Logic to extract data for a particular substation
    return { name: substation, labels: ['Label1', 'Label2'], values: [5, 10] };  // Example data
}

// Create Substation Charts
function createSubstationCharts(data) {
    var substations = ['substation1', 'substation2', 'substation3', 'substation4', 'substation5', 'substation6', 'substation7', 'substation8']
    substations.forEach(substation => {
        const substationData = extractSubstationData(data, substation);
        createSubstationChart(substation, substationData);

        document.getElementById(substation).addEventListener('click', () => {
            showHeatmap(substation); // Show heatmap on the same page
        });
    });

    showHeatmap(substations[0]);
}

function goBack() {
    document.getElementById('mainContainer').style.display = 'block';  // Show main charts
    document.querySelector('.slideshow-container').style.display = 'block'; // Show slideshow
    document.querySelector('.navbar').style.display = 'flex';  // Show navbar
    document.getElementById('heatmapContainer').style.display = 'none';  // Hide heatmap
}


function createSubstationChart(id, substationData) {
    const chart = echarts.init(document.getElementById(id));

    const chartOptions = {
        title: { text: substationData.name, textStyle: { color: '#005f87' } },
        xAxis: { type: 'category', data: substationData.labels, axisLine: { lineStyle: { color: '#005f87' } } },
        yAxis: { type: 'value', axisLine: { lineStyle: { color: '#005f87' } } },
        series: [{ data: substationData.values, type: 'line', itemStyle: { color: '#009999' } }]
    };

    chart.setOption(chartOptions);
}

// Handle Slideshow Navigation
let currentSlide = 0;
function changeSlide(n) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Show Heatmap when substation is clicked
// Show Heatmap when substation is clicked
function showHeatmap(substationName) {
    // Hide main charts, slideshow, and the navbar
    // document.getElementById('mainContainer').style.display = 'none';  
    // document.querySelector('.slideshow-container').style.display = 'none'; 
    // document.querySelector('.navbar').style.display = 'none';  // Hide navbar
    document.getElementById('heatmapContainer').style.display = 'block';  // Show heatmap
    createHeatmap(substationName);
}


// Create Heatmap for Substation
// Create Heatmap for Substation
function createHeatmap(substationName) {
    const chart = echarts.init(document.getElementById('heatmapContainer'));
    const heatmapData = extractHeatmapData(substationName);

    const chartOptions = {
        title: {
            text: `${substationName} Heatmap`,
            textStyle: { color: '#005f87' }
        },
        xAxis: {
            type: 'category',
            data: heatmapData.labels,
            axisLine: { lineStyle: { color: '#005f87' } }
        },
        yAxis: {
            type: 'category',
            data: heatmapData.values,
            axisLine: { lineStyle: { color: '#005f87' } }
        },
        visualMap: {
            min: 0,
            max: 100,  // Adjust based on your heatmap data values
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            inRange: {
                //color: ['#FFFF00', '#FFA500', '#FF4500'] 
                color: ['#FFFF00', '#FFA500', '#FF0000'] // Yellow to Orange gradient
            }
        },
        series: [{
            name: 'Heatmap',
            type: 'heatmap',
            data: heatmapData.points,
            itemStyle: {
                emphasis: { borderColor: '#333', borderWidth: 1 }
            },
            progressive: 1000,
            animation: false
        }]
    };

    chart.setOption(chartOptions);
}


// Extract Heatmap Data
function extractHeatmapData(substationName) {
    // Logic to extract heatmap data for the given substation
    return {
        labels: ['Time1', 'Time2', 'Time3'],
        values: ['Area1', 'Area2', 'Area3'],
        points: [
            [0, 0, 20],  // Example: (x, y, value) format
            [0, 1, 60],
            [0, 2, 90],
            [1, 0, 40],
            [1, 1, 80],
            [1, 2, 100],
            [2, 0, 70],
            [2, 1, 30],
            [2, 2, 50]
        ]
    };
}