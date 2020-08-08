var dom = document.getElementById("box1");
var myChart = echarts.init(dom);
var app = {};
option = null;
var labelRight = {
    normal: {
        position: 'right'
    }
};
option = {
    title: {
        text: '',
        subtext: '',
        left: 'center'
    },
    textStyle:{//图例文字的样式
        color:'#fff',
        fontSize:12
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['已售', '空闲']
    },
    color : [ 'green', 'red' ],
    series: [
        {
            name: '',
            type: 'pie',
            radius: '65%',
            center: ['40%', '40%'],
            data: [
                {value: 335, name: '已售'},
                {value: 310, name: '空闲'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}