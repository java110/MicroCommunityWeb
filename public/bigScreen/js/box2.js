function _loadAssetRoom() {

    let param = {
        params: {
            communityId: vc.getCurrentCommunity().communityId
        }
    }
    vc.http.apiGet(
        '/bigScreen/getAssetsRepair',
        param,
        function (json, res) {
            //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
            let _json = JSON.parse(json);
            if (_json.code == 0) {
                let _data = _json.data;
                initRepair(_data.unDealCount, _data.dealingCount, _data.dealedCount);
                return;
            }
        },
        function (errInfo, error) {
            console.log('请求失败处理');

            vc.toast(errInfo);

        });
}

function initRepair(unDealCount, dealingCount, dealedCount) {
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
            data: ['待处理', '处理中', '已处理']
        },
        color: ['red', 'yellow', 'green'],
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
                    { value: unDealCount, name: '待处理' },
                    { value: dealingCount, name: '处理中' },
                    { value: dealedCount, name: '已处理' }
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

}

_loadAssetRoom();