var dom = document.getElementById("box2");
var myChart = echarts.init(dom);
var app = {};
option = null;
var xAxisData = [];

var emphasisStyle = {
    itemStyle: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
    }
};

option = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['已处理', '未处理']
    },
    color: ['yellow','red'],
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: true,
                position: 'top'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 90, name: '已处理'},
                {value: 10, name: '未处理'}
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: '{b} : {c} '
                    },
                    labelLine: { show: true }
                }
            }
        }
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}