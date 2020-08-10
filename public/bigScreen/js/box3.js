
function _initOpenDoorChart(_data) {
    var dom = document.getElementById("box3_right");
    var myChart = echarts.init(dom);
    let _createTime = [];
    let _openDoorCount = [];
    _data.forEach(item => {
        _createTime.push(item.createTime);
        _openDoorCount.push(item.count);
    });
    var app = {};
    option = null;
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            textStyle: {//图例文字的样式
                color: '#fff',
                fontSize: 12
            },
            data: ['门禁开门次数']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        textStyle: {//图例文字的样式
            color: '#fff',
            fontSize: 12
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: _createTime
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '门禁开门次数',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: _openDoorCount
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
/**
 * 查询 资产信息
 */
function _loadAssets() {
    let param = {
        params: {
            communityId: vc.getCurrentCommunity().communityId
        }
    }
    vc.http.apiGet(
        '/bigScreen/getAssets',
        param,
        function (json, res) {
            //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
            let _json = JSON.parse(json);
            if (_json.code == 0) {

                let _data = _json.data;
                document.getElementById("floorCount").innerHTML = _data.floorCount + "栋";
                document.getElementById("roomCount").innerHTML = _data.roomCount + "个";
                document.getElementById("parkingSpaceCount").innerHTML = _data.parkingSpaceCount + "个";
                document.getElementById("machineCount").innerHTML = _data.machineCount + "台";

                return;
            }
        },
        function (errInfo, error) {
            console.log('请求失败处理');

            vc.toast(errInfo);

        });
}


/**
 * 查询 资产信息
 */
function _getAssetOpenDoor() {
    let param = {
        params: {
            communityId: vc.getCurrentCommunity().communityId
        }
    }
    vc.http.apiGet(
        '/bigScreen/getAssetOpenDoor',
        param,
        function (json, res) {
            //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
            let _json = JSON.parse(json);
            if (_json.code == 0) {

                let _data = _json.data;
                _data = _data.reverse();
                _initOpenDoorChart(_data);

                return;
            }
        },
        function (errInfo, error) {
            console.log('请求失败处理');

            vc.toast(errInfo);

        });
}


_loadAssets();

_getAssetOpenDoor();