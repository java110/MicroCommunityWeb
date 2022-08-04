(function() {
    let community = document.getElementById("community");
    community.innerHTML = vc.getCurrentCommunity().name;

    /********************************今日巡检 start****************************************** */
    function _loadAssetInspection() {
        let param = {
            params: {
                communityId: vc.getCurrentCommunity().communityId
            }
        }
        vc.http.apiGet(
            '/bigScreen/getAssetInspection',
            param,
            function(json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {
                    let _data = _json.data;
                    initInspeciton(_data);
                    return;
                }
            },
            function(errInfo, error) {
                console.log('请求失败处理');

                vc.toast(errInfo);

            });
    }

    function initInspeciton(_dataArr) {
        let _todayInpection = document.getElementById("todayInpection");
        let _li = "";
        for (let _inIndex = 0; _inIndex < _dataArr.length; _inIndex++) {

            _li += "<li> <p class=\"text_l\">" + (_inIndex + 1) + ".0、" + _dataArr[_inIndex].msg + "</p></li>";

            if (_inIndex >= 9) {
                break;
            }
        }
        _todayInpection.innerHTML = _li;
    }

    _loadAssetInspection();
    /********************************今日巡检  end****************************************** */

    /********************************小区资产 start****************************************** */
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
            function(json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {

                    let _data = _json.data;
                    document.getElementById("floorCount").innerHTML = _data.floorCount;
                    document.getElementById("roomCount").innerHTML = _data.roomCount;
                    document.getElementById("parkingSpaceCount").innerHTML = _data.parkingSpaceCount;
                    document.getElementById("machineCount").innerHTML = _data.machineCount;

                    return;
                }
            },
            function(errInfo, error) {
                console.log('请求失败处理');

                vc.toast(errInfo);

            });
    }

    _loadAssets();

    /********************************小区资产 end****************************************** */
    /********************************开门次数 start****************************************** */
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
            backgroundColor: 'rgba(1,202,217,.2)',
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
                textStyle: { //图例文字的样式
                    color: 'rgba(255,255,255,.7)',
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
            textStyle: { //图例文字的样式
                color: '#fff',
                fontSize: 12
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: _createTime,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel: {
                    color: "rgba(255,255,255,.7)"
                }
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.3)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.01)'
                    }
                },

                axisLabel: {
                    formatter: '{value} ml'
                }
            }],
            series: [{
                name: '门禁开门次数',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: _openDoorCount
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }

    function _getAssetOpenDoor() {
        let param = {
            params: {
                communityId: vc.getCurrentCommunity().communityId
            }
        }
        vc.http.apiGet(
            '/bigScreen/getAssetOpenDoor',
            param,
            function(json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {

                    let _data = _json.data;
                    _data = _data.reverse();
                    _initOpenDoorChart(_data);

                    return;
                }
            },
            function(errInfo, error) {
                console.log('请求失败处理');

                vc.toast(errInfo);

            });
    }

    _getAssetOpenDoor();

    /********************************开门次数 end****************************************** */


    /********************************房屋分析 start*************************************** */
    function _loadAssetRoom() {

        let param = {
            params: {
                communityId: vc.getCurrentCommunity().communityId
            }
        }
        vc.http.apiGet(
            '/bigScreen/getAssetsRoom',
            param,
            function(json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {
                    let _data = _json.data;
                    initChart(_data.freeRoomCount, _data.sellRoomCount);
                    return;
                }
            },
            function(errInfo, error) {
                console.log('请求失败处理');

                vc.toast(errInfo);

            });
    }

    function initChart(_freeRoomCount, _sellRoomCount) {
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
            color: ['#76c4bf', '#e5ffc7'],
            backgroundColor: 'rgba(1,202,217,.2)',
            series: [{
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
            }]
        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }


    _loadAssetRoom();

    /********************************房屋分析 end*************************************** */
    /********************************报修分析 start*************************************** */

    function _loadAssetsRepair() {

        let param = {
            params: {
                communityId: vc.getCurrentCommunity().communityId
            }
        }
        vc.http.apiGet(
            '/bigScreen/getAssetsRepair',
            param,
            function(json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {
                    let _data = _json.data;
                    initRepair(_data.unDealCount, _data.dealingCount, _data.dealedCount);
                    return;
                }
            },
            function(errInfo, error) {
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
            color: ['#7de494', '#7fd7b1', '#5578cf'],
            backgroundColor: 'rgba(1,202,217,.2)',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: ['待处理', '处理中', '已处理'],
                textStyle: {
                    color: '#fff'
                }
            },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: 'top',

                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '15',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: unDealCount, name: '待处理', color: '#FFF' },
                    { value: dealingCount, name: '处理中' },
                    { value: dealedCount, name: '已处理' }
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b} : {c} ',

                        },
                        labelLine: { show: true }
                    }
                }
            }]
        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }

    }

    _loadAssetsRepair();

    /********************************报修分析 end*************************************** */

    /********************************费用分析 start*************************************** */
    function _queryIndexContextData() {

        var param = {
                params: {
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
            //发送get请求
        vc.http.apiGet('/reportFeeMonthStatistics/queryReportProficient',
            param,
            function(json, res) {
                var indexData = JSON.parse(json);

                let _receivableInformation = indexData.receivableInformation;

                let _receivableAmount = _receivableInformation.receivableAmount;

                let _remindInfomation = indexData.remindInfomation;
                let _data = [
                    { value: _remindInfomation.deadlineFeeCount, name: '费用到期提醒' },
                    { value: _remindInfomation.prePaymentCount, name: '费用提醒' }
                ];
                let _dom = document.getElementById('shopCount');
                _initCharts2(_dom, '费用提醒', _data);

                _dom = document.getElementById('ownerCount');
                _data = [
                    { value: _receivableInformation.oweAmount, name: '欠费金额' },
                    { value: _receivableInformation.receivedAmount, name: '已收金额' }
                ];
                _initCharts2(_dom, '应收总额', _data);

                let _floorReceivableInformations = indexData.floorReceivableInformations;

                _dom = document.getElementById('foorFeeAnsicis');
                _data = [];

                _floorReceivableInformations.forEach(item => {
                    _data.push({
                        value: item.receivableAmount,
                        name: item.name
                    })
                });
                _initCharts2(_dom, '楼栋费用占比', _data);

                _data = [];

                let _feeConfigReceivableInformations = indexData.feeConfigReceivableInformations;
                _feeConfigReceivableInformations.forEach(item => {
                    _data.push({
                        value: item.receivableAmount,
                        name: item.feeName
                    })
                });
                _dom = document.getElementById('feeAnsicis');
                _initCharts2(_dom, '分项费用占比', _data);
            },
            function(errInfo, error) {
                console.log('请求失败处理');
            }
        );
    }

    function _initCharts2(dom, _title, _data) {
        let myChart = echarts.init(dom);
        let option = null;
        option = {
            textStyle: { //图例文字的样式
                fontSize: 12,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            color: ['#7de494', '#5578cf'],
            backgroundColor: 'rgba(1,202,217,.2)',
            series: [{
                name: _title,
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: _data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                        show: true
                    },
                    formatter: function(params) {
                        if (params.value > 10) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                }
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }
    _queryIndexContextData()

    /*********************************************************缴费分析开始 ************************/
    function _loadAssetFee() {
        let param = {
            params: {
                communityId: vc.getCurrentCommunity().communityId
            }
        }
        vc.http.apiGet(
            '/reportFeeMonthStatistics/queryOwePaymentCount',
            param,
            function(json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {
                    let _data = _json.data;
                    initFeeChart(_data);
                    return;
                }
            },
            function(errInfo, error) {
                console.log('请求失败处理');
                vc.toast(errInfo);
            });
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

    function initFeeChart(_data) {
        let dom = document.getElementById("box4");
        let myChart = echarts.init(dom);
        let option = null;
        let xAxisData = [];
        let data1 = [];
        let data2 = [];
        _data.forEach(item => {
            xAxisData.push(item.feeName);
            data1.push(item.normalCount);
            data2.push(item.objCount);
        });
        option = {
            color: ['#7de494', '#5578cf'],
            backgroundColor: 'rgba(1,202,217,.2)',
            textStyle: { //图例文字的样式
                color: '#fff',
                fontSize: 12
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['已缴费', '未缴费'],
                textStyle: {
                    color: '#fff'
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis: [{
                type: 'category',
                axisTick: { show: false },
                data: xAxisData
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                    name: '已缴费',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1
                },
                {
                    name: '未缴费',
                    type: 'bar',
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2
                }
            ]
        };
        myChart.on('brushSelected', renderBrushed);
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }
    _loadAssetFee();
    /******************************************************************** */

})()