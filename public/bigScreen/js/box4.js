
function _loadAssetFee() {

    let param = {
        params: {
            communityId: vc.getCurrentCommunity().communityId
        }
    }
    vc.http.apiGet(
        '/reportFeeMonthStatistics/queryOwePaymentCount',
        param,
        function (json, res) {
            //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
            let _json = JSON.parse(json);
            if (_json.code == 0) {
                let _data = _json.data;
                initFeeChart(_data);
                return;
            }
        },
        function (errInfo, error) {
            console.log('请求失败处理');

            vc.toast(errInfo);

        });
}



function initFeeChart(_data) {
    var dom = document.getElementById("box4");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    var xAxisData = [];
    var data1 = [];
    var data2 = [];

    _data.forEach(item => {
        xAxisData.push(item.feeName);
        data1.push(-item.normalCount);
        data2.push(item.objCount);
    });

    // for (var i = 0; i < 10; i++) {
    //     xAxisData.push('Class' + i);
    //     data1.push((Math.random() * 2).toFixed(2));
    //     data2.push(-Math.random().toFixed(2));
    // }

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
        backgroundColor: '',
        legend: {
            data: ['未交费','已缴费'],
            left: 10
        },
        tooltip: {},
        xAxis: {
            data: xAxisData,
            name: '费用项',
            axisLine: { onZero: true },
            splitLine: { show: false },
            splitArea: { show: false }
        },
        textStyle: {//图例文字的样式
            color: '#fff',
            fontSize: 12
        },
        yAxis: {
            inverse: true,
            splitArea: { show: false }
        },
        grid: {
            left: 0
        },
        color: ['green','red'],
        series: [
            {
                name: '已缴费',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data1
            },
            {
                name: '未交费',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data2
            }
        ]
    };

    myChart.on('brushSelected', renderBrushed);

    

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

}

function renderBrushed(params) {
    var brushed = [];
    var brushComponent = params.batch[0];

    for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
        var rawIndices = brushComponent.selected[sIdx].dataIndex;
        brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
    }

    myChart.setOption({
        title: {
            backgroundColor: '#333',
            text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
            bottom: 0,
            right: 0,
            width: 100,
            textStyle: {
                fontSize: 12,
                color: '#fff'
            }
        }
    });
}

_loadAssetFee();