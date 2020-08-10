
let community = document.getElementById("community");
community.innerHTML = vc.getCurrentCommunity().name;

function _loadAssetRoom() {

    let param = {
        params: {
            communityId: vc.getCurrentCommunity().communityId
        }
    }
    vc.http.apiGet(
        '/bigScreen/getAssetsRoom',
        param,
        function (json, res) {
            //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
            let _json = JSON.parse(json);
            if (_json.code == 0) {
                let _data = _json.data;
                initChart(_data.freeRoomCount,_data.sellRoomCount);
                return;
            }
        },
        function (errInfo, error) {
            console.log('请求失败处理');

            vc.toast(errInfo);

        });
}

function initChart(_freeRoomCount,_sellRoomCount) {
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
        textStyle: {//图例文字的样式
            color: '#fff',
            fontSize: 12
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
        color: ['green', 'red'],
        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    { value: _sellRoomCount, name: '已售' },
                    { value: _freeRoomCount, name: '空闲' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
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