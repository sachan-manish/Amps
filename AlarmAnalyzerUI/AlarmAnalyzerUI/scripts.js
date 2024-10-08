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
                createAlrmCountCharts();
            }
        });
    }
});

// Create Trip Alarm Bar Chart
function createTripAlarmChart(data) {
    const chart = echarts.init(document.getElementById('tripChart'), 'dark');
    const tripData = extractTripData(data);

    const chartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['Substation1','Substation2','Substation3','substation4','substation5']
        },
        series: [
          {
            name: 'StatusChange',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: 'Relaytrip',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Alm1stStage',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Alm2ndStage',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: 'Alm3rdStage',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
        ]
      };

    chart.setOption(chartOptions);
}

// Create Cleared Alarms Percentage Chart
function createClearedAlarmsChart(data) {
    const chart = echarts.init(document.getElementById('clearedChart'),'dark');
    const clearedData = extractClearedAlarmsData(data);

    const chartOptions = {
        title: { text: 'Clearing Rate', textStyle: { color: 'white' } },
        series: [{
            type: 'pie',
            radius: '50%',
            data: [
                { value: clearedData.cleared, name: 'CLEAR', itemStyle: { color: '#00FF00' } },
                { value: clearedData.uncleared, name: 'PENDING', itemStyle: { color: '#FF0000' } }
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
    return { cleared: 91, uncleared: 9 };  // Example data
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
    const chart = echarts.init(document.getElementById('heatmapContainer'),'dark');
    const heatmapData = extractHeatmapData(substationName);
    const days = [
        'Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'
    ];
    const hours = [
        '12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a', '10a', '11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'
    ];

    const chartOptions = {
        title: {
            text: `Control Station View`,
            textStyle: { color: 'white' }
        },
        xAxis: {
            type: 'category',
            data: days ,//heatmapData.labels,
            axisLine: { lineStyle: { color: '#005f87' } }
        },
        yAxis: {
            type: 'category',
            data: hours , //heatmapData.values,
            axisLine: { lineStyle: { color: '#005f87' } }
        },
        visualMap: {
            min: 0,
            max: 10,  // Adjust based on your heatmap data values
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [{
            name: 'Alarms',
            type: 'heatmap',
            data: heatmapData.points,
            itemStyle: {
                emphasis: {
                    itemStyle: {
                      shadowBlur: 15,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
            },
            progressive: 1000,
            animation: true
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
        points: [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], 
        [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
    }
}

function createAlrmCountCharts(){
    const myChart = echarts.init(document.getElementById('alrmCount'),'dark');

    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['30%', '50%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Healthy' },
            { value: 530, name: 'Alarms'},
            { value: 59, name: 'Reset' },
            { value: 484, name: 'Trips' },
            { value: 30, name: 'Spare' }
          ]
        }
      ]
    };
    
    option && myChart.setOption(option);

}