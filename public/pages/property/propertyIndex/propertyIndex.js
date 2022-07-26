(function(vc) {
    vc.extends({
        data: {
            indexContextInfo: {
                ownerCount: '0',
                noEnterRoomCount: '0',
                roomCount: '0',
                freeRoomCount: '0',
                parkingSpaceCount: '0',
                freeParkingSpaceCount: '0',
                shopCount: '0',
                freeShopCount: '0'
            }
        },
        _initMethod: function() {
            vc.component._queryIndexContextData();
        },
        _initEvent: function() {
            vc.on("indexContext", "_queryIndexContextData", function(_param) {
                vc.component._queryIndexContextData();
            });
        },
        methods: {
            _queryIndexContextData: function() {
                if (vc.getCurrentCommunity() == null || vc.getCurrentCommunity() == undefined) {
                    return;
                }
                var param = {
                        params: {
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/index.queryIndexStatistic',
                    param,
                    function(json, res) {
                        var indexData = JSON.parse(json);
                        vc.copyObject(indexData, vc.component.indexContextInfo);
                        let _dom = document.getElementById('ownerCount');
                        if (!_dom) { return; }
                        $that._initCharts2(indexData.ownerCount - indexData.noEnterRoomCount, indexData.noEnterRoomCount, _dom, vc.i18n('业主信息', 'indexContext'), vc.i18n('已入住', 'indexContext'), vc.i18n('未入住', 'indexContext'));
                        _dom = document.getElementById('roomCount');
                        $that._initCharts2(indexData.roomCount - indexData.freeRoomCount, indexData.freeRoomCount, _dom, vc.i18n('房屋信息', 'indexContext'), vc.i18n('已入住', 'indexContext'), vc.i18n('空闲', 'indexContext'));
                        _dom = document.getElementById('parkingSpaceCount');
                        $that._initEcharts(indexData.parkingSpaceCount - indexData.freeParkingSpaceCount, indexData.freeParkingSpaceCount, _dom, vc.i18n('车位信息', 'indexContext'), vc.i18n('已使用', 'indexContext'), vc.i18n('空闲', 'indexContext'));
                        _dom = document.getElementById('shopCount');
                        $that._initCharts2(indexData.shopCount - indexData.freeShopCount, indexData.freeShopCount, _dom, vc.i18n('商铺信息', 'indexContext'), vc.i18n('已出售', 'indexContext'), vc.i18n('空闲', 'indexContext'));
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initEcharts: function(userCount, freeCount, dom, _title, _userCountName, _freeCountName) {
                //let dom = document.getElementById("box2");
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    color: ['#66CDAA', '#FFDAB9'],
                    series: [{
                        name: _title,
                        type: 'pie',
                        radius: ['60%', '75%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: true
                        },
                        data: [
                            { value: userCount, name: _userCountName },
                            { value: freeCount, name: _freeCountName }
                        ],
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },
            _initCharts2: function(userCount, freeCount, dom, _title, _userCountName, _freeCountName) {
                //var dom = document.getElementById("box1");
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    textStyle: { //图例文字的样式
                        fontSize: 12
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    color: ['#66CDAA', '#FFDAB9'],
                    series: [{
                        name: _title,
                        type: 'pie',
                        radius: '75%',
                        center: ['50%', '50%'],
                        data: [
                            { value: userCount, name: _userCountName },
                            { value: freeCount, name: _freeCountName }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },
            _initCharts3: function(userCount, freeCount, dom, _title, _userCountName, _freeCountName) {
                //var dom = document.getElementById("box1");
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    title: {
                        text: '',
                        subtext: '',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    color: ['#66CDAA', '#FFDAB9'],
                    series: [{
                        name: _title,
                        type: 'pie',
                        radius: ['20%', '75%'],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        data: [
                            { value: userCount, name: _userCountName },
                            { value: freeCount, name: _freeCountName }
                        ]
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }
        }
    })
})(window.vc);