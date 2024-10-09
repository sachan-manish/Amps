document.getElementById('csvFileInput').addEventListener('change', function (event) {
    DisplayDivisions();
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
                createTreeMap();
                CreateTreeChart();
            }
        });
    }
});

function getColor(breakers) {
    return breakers.some(breaker => breaker.open) ? 'red' : 'green';
}

function CreateTreeChart() {
    var myChart = echarts.init(document.getElementById('indiamap'), 'dark');
    const substationData = {
        name: '775KV Substation',
        children: [
            {
                name: 'Bhiwadi Substation (Rajasthan)',
                children: Array.from({ length: 50 }, (_, bayIndex) => ({
                    name: `Bay ${bayIndex + 1}`,
                    children: Array.from({ length: 100 }, (_, breakerIndex) => ({
                        name: `Breaker ${breakerIndex + 1}`,
                        open: Math.random() < 0.5 // Randomly determine if the breaker is open
                    }))
                }))
            },
            {
                name: 'Raigarh Substation (Chhattisgarh)',
                children: Array.from({ length: 50 }, (_, bayIndex) => ({
                    name: `Bay ${bayIndex + 1}`,
                    children: Array.from({ length: 100 }, (_, breakerIndex) => ({
                        name: `Breaker ${breakerIndex + 1}`,
                        open: Math.random() < 0.5
                    }))
                }))
            }
        ]
    };

    myChart.showLoading();

    // Use your own data here

    const data = substationData;

    myChart.hideLoading();

    myChart.setOption(

        {

            tooltip: {

                trigger: 'item',

                triggerOn: 'mousemove'

            },

            series: [

                {

                    type: 'tree',

                    data: [data],

                    top: '1%',

                    left: '7%',

                    bottom: '1%',

                    right: '20%',

                    symbolSize: 7,

                    label: {

                        position: 'left',

                        verticalAlign: 'middle',

                        align: 'right',

                        fontSize: 9

                    },

                    leaves: {

                        label: {

                            position: 'right',

                            verticalAlign: 'middle',

                            align: 'left'

                        }

                    },

                    emphasis: {

                        focus: 'descendant'

                    },

                    expandAndCollapse: true,

                    animationDuration: 550,

                    animationDurationUpdate: 750,

                    itemStyle: {

                        borderColor: function (params) {

                            const node = params.data;

                            if (node.children) {

                                // If the node has children, get the color based on its children (bays)

                                const bays = node.children;

                                const color = getColor(bays.flatMap(bay => bay.children)); // Flatten the array of breakers

                                return color;

                            }

                            if (node.open !== undefined) { // If the node is a breaker

                                return node.open ? 'red' : 'green'; // Red if open, green if closed

                            }

                            return 'black'; // Default color for substations

                        }

                    }

                }

            ]

        }
    );

}

function CheckSubStationSpecificChart(id, substationData) {
    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom, 'dark');
    var option;

    // Function to generate random data for alarms and events over a period of 10 years
    function generateRandomData() {
        const data = [];
        const startYear = 2014; // Starting year
        const endYear = 2023;   // Ending year

        for (let year = startYear; year <= endYear; year++) {
            for (let month = 1; month <= 12; month++) {
                // Generate random counts for alarms and events
                const alarms = Math.floor(Math.random() * 100); // Random alarms count
                const events = Math.floor(Math.random() * 50);  // Random events count
                data.push([`${year}-${month < 10 ? '0' + month : month}-01`, alarms + events]);
            }
        }
        return data;
    }

    const randomData = generateRandomData();

    myChart.setOption(
        (option = {
            title: {
                text: 'Substation Alarms and Events Count - ' + substationData.name,
                left: '1%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%'
            },
            xAxis: {
                type: 'category',
                data: randomData.map(function (item) {
                    return item[0]; // Date
                })
            },
            yAxis: {
                type: 'value',
                name: 'Count'
            },
            toolbox: {
                right: 10,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [
                {
                    startValue: '2014-06-01'
                },
                {
                    type: 'inside'
                }
            ],
            series: {
                name: 'Alarms and Events',
                type: 'line',
                data: randomData.map(function (item) {
                    return item[1]; // Alarms and events count
                }),
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#333'
                    },
                    data: [
                        {
                            yAxis: 50 // Example threshold line
                        },
                        {
                            yAxis: 100 // Example threshold line
                        }
                    ]
                }
            }
        })
    );

    option && myChart.setOption(option);
}

function DisplayDivisions() {
    document.getElementById('mainContainer').style.display = 'grid';  // Show main charts
    document.querySelector('.all-substation-container').style.display = 'inline-flex'; // Show slideshow
    document.querySelector('.all-substation-container').style.justifyContent = 'center'; // Show slideshow
    document.querySelector('.slideshow-container').style.display = 'block'; // Show slideshow
}

function indiaMapCheck(indiaJson, myChart) {
    myChart.hideLoading();
    echarts.registerMap('india', indiaJson);

    const option = {
        title: {
            text: 'India Population Estimates',
            subtext: 'Data source: Census of India',
            left: 'right'
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: '{b}: {c}'
        },
        visualMap: {
            left: 'right',
            min: 500000,
            max: 200000000,
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026'
                ]
            },
            text: ['High', 'Low'],
            calculable: true
        },
        toolbox: {
            show: true,
            left: 'left',
            top: 'top',
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: 'India Population Estimates',
                type: 'map',
                roam: true,
                map: 'india',
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: [
                    { name: 'Uttar Pradesh', value: 199812341 },
                    { name: 'Maharashtra', value: 112374333 },
                    { name: 'Bihar', value: 104099452 },
                    { name: 'West Bengal', value: 91276115 },
                    { name: 'Madhya Pradesh', value: 72626809 },
                    { name: 'Tamil Nadu', value: 72147030 },
                    { name: 'Rajasthan', value: 68548437 },
                    { name: 'Karnataka', value: 61095297 },
                    { name: 'Gujarat', value: 60439692 },
                    { name: 'Andhra Pradesh', value: 49577103 },
                    { name: 'Odisha', value: 41974218 },
                    { name: 'Telangana', value: 35003674 },
                    { name: 'Kerala', value: 33406061 },
                    { name: 'Jharkhand', value: 32988134 },
                    { name: 'Assam', value: 31205576 },
                    { name: 'Punjab', value: 27743338 },
                    { name: 'Chhattisgarh', value: 25545198 },
                    { name: 'Haryana', value: 25351462 },
                    { name: 'Uttarakhand', value: 10086292 },
                    { name: 'Himachal Pradesh', value: 6864602 },
                    { name: 'Tripura', value: 3673917 },
                    { name: 'Meghalaya', value: 2966889 },
                    { name: 'Manipur', value: 2855794 },
                    { name: 'Nagaland', value: 1978502 },
                    { name: 'Goa', value: 1458545 },
                    { name: 'Arunachal Pradesh', value: 1383727 },
                    { name: 'Mizoram', value: 1097206 },
                    { name: 'Sikkim', value: 610577 },
                    { name: 'Delhi', value: 16787941 },
                    { name: 'Puducherry', value: 1247953 },
                    { name: 'Chandigarh', value: 1055450 },
                    { name: 'Andaman and Nicobar Islands', value: 380581 },
                    { name: 'Dadra and Nagar Haveli and Daman and Diu', value: 586956 },
                    { name: 'Lakshadweep', value: 64429 }
                ]
            }
        ]
    };
    myChart.setOption(option);
}
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
            data: ['Substation1', 'Substation2', 'Substation3', 'Substation4', 'Substation5']
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
    const chart = echarts.init(document.getElementById('clearedChart'), 'dark');
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
    var substations = ['substation1', 'substation2', 'substation3', 'substation4', 'substation5'];
    var substationNames = ['Bhiwadi Substation (Rajasthan)', 'Raigarh Substation (Chhattisgarh)', 'Pavagada Substation (Karnataka)', 'Mundra Substation (Gujarat)', 'Alipurduar Substation (West Bengal)'];

    substations.forEach((substation, index) => {
        const substationData = extractSubstationData(data, substationNames[index]);

        // Use the corresponding name from substationNames for the chart
        createSubstationChart(substation, substationData);
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
    CheckSubStationSpecificChart(id, substationData);
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
    document.getElementById('heatmapContainer').style.display = 'block';  // Show heatmap
    createHeatmap(substationName);
}


// Create Heatmap for Substation
// Create Heatmap for Substation
function createHeatmap(substationName) {
    const chart = echarts.init(document.getElementById('heatmapContainer'), 'dark');
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
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Bhiwadi Substation (Rajasthan)', 'Raigarh Substation (Chhattisgarh)', 'Pavagada Substation (Karnataka)', 'Mundra Substation (Gujarat)', 'Alipurduar Substation (West Bengal)']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Bhiwadi Substation (Rajasthan)',
                type: 'line',
                stack: 'Total',
                data: [273, 168, 270, 299, 96, 178, 261, 113, 262, 191, 98, 66]
            },
            {
                name: 'Raigarh Substation (Chhattisgarh)',
                type: 'line',
                stack: 'Total',
                data: [162, 127, 283, 170, 215, 125, 85, 39, 291, 132, 172, 138]
            },
            {
                name: 'Pavagada Substation (Karnataka)',
                type: 'line',
                stack: 'Total',
                data: [31, 66, 92, 77, 58, 167, 140, 242, 261, 39, 86, 278]
            },
            {
                name: 'Mundra Substation (Gujarat)',
                type: 'line',
                stack: 'Total',
                data: [32, 65, 103, 80, 177, 94, 212, 288, 275, 272, 240, 100]
            },
            {
                name: 'Alipurduar Substation (West Bengal)',
                type: 'line',
                stack: 'Total',
                data: [278, 90, 204, 261, 129, 37, 138, 293, 169, 63, 238, 43]
            }
        ]
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

function getRandomAlarmData() {
    return [
        Math.floor(Math.random() * 15) + 1,  // Severity 1 (1-15)
        Math.floor(Math.random() * 30) + 1,  // Severity 2 (1-30)
        Math.floor(Math.random() * 40) + 1,  // Severity 3 (1-40)
        Math.floor(Math.random() * 100) + 1  // Severity 4 (1-100)
    ];
}

function createTreeMap() {
    const myChart = echarts.init(document.getElementById('treemap'), 'dark');
    // Sample substation data with randomly generated alarm values
    const substationData = [
        {
            name: 'Bhiwadi Substation (Rajasthan)',
            value: getRandomAlarmData(),
            children: [
                { name: 'Severity 1 Alarms', value: getRandomAlarmData()[0] },
                { name: 'Severity 2 Alarms', value: getRandomAlarmData()[1] },
                { name: 'Severity 3 Alarms', value: getRandomAlarmData()[2] },
                { name: 'Severity 4 Alarms', value: getRandomAlarmData()[3] }
            ]
        },
        {
            name: 'Raigarh Substation (Chhattisgarh)',
            value: getRandomAlarmData(),
            children: [
                { name: 'Severity 1 Alarms', value: getRandomAlarmData()[0] },
                { name: 'Severity 2 Alarms', value: getRandomAlarmData()[1] },
                { name: 'Severity 3 Alarms', value: getRandomAlarmData()[2] },
                { name: 'Severity 4 Alarms', value: getRandomAlarmData()[3] }
            ]
        },
        {
            name: 'Pavagada Substation (Karnataka)',
            value: getRandomAlarmData(),
            children: [
                { name: 'Severity 1 Alarms', value: getRandomAlarmData()[0] },
                { name: 'Severity 2 Alarms', value: getRandomAlarmData()[1] },
                { name: 'Severity 3 Alarms', value: getRandomAlarmData()[2] },
                { name: 'Severity 4 Alarms', value: getRandomAlarmData()[3] }
            ]
        },
        {
            name: 'Mundra Substation (Gujarat)',
            value: getRandomAlarmData(),
            children: [
                { name: 'Severity 1 Alarms', value: getRandomAlarmData()[0] },
                { name: 'Severity 2 Alarms', value: getRandomAlarmData()[1] },
                { name: 'Severity 3 Alarms', value: getRandomAlarmData()[2] },
                { name: 'Severity 4 Alarms', value: getRandomAlarmData()[3] }
            ]
        },
        {
            name: 'Alipurduar Substation (West Bengal)',
            value: getRandomAlarmData(),
            children: [
                { name: 'Severity 1 Alarms', value: getRandomAlarmData()[0] },
                { name: 'Severity 2 Alarms', value: getRandomAlarmData()[1] },
                { name: 'Severity 3 Alarms', value: getRandomAlarmData()[2] },
                { name: 'Severity 4 Alarms', value: getRandomAlarmData()[3] }
            ]
        }
    ];

    myChart.setOption(
        (option = {
            title: {
                left: 'center',
                text: 'Substation Alarms by Severity'
            },
            tooltip: {
                formatter: function (info) {
                    return (
                        '<div class="tooltip-title">' +
                        echarts.format.encodeHTML(info.name) +
                        '</div>' +
                        'Alarm Count: &nbsp;&nbsp;' +
                        info.value
                    );
                }
            },
            series: [
                {
                    name: 'Substations',
                    top: 80,
                    type: 'treemap',
                    label: {
                        show: true,
                        formatter: '{b}',
                        color: 'black',  // Set the text color to black
                        fontWeight: 'bold'  // Make the text bold
                    },
                    itemStyle: {
                        borderColor: 'black'
                    },
                    levels: [
                        {
                            itemStyle: {
                                borderWidth: 3,
                                borderColor: '#333',
                                gapWidth: 3
                            }
                        },
                        {
                            color: ['#ffff00', '#ff9900', '#ff3300', '#ff0000'],
                            colorMappingBy: 'value',
                            itemStyle: {
                                gapWidth: 1
                            }
                        }
                    ],
                    data: substationData
                }
            ]
        })
    );
}


function createAlrmCountCharts() {
    const myChart = echarts.init(document.getElementById('alrmCount'), 'dark');

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
                    { value: 530, name: 'Alarms' },
                    { value: 59, name: 'Reset' },
                    { value: 484, name: 'Trips' },
                    { value: 30, name: 'Spare' }
                ]
            }
        ]
    };

    option && myChart.setOption(option);

}
