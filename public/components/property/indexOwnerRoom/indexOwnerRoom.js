(function (vc) {
    vc.extends({
        data: {
            indexOwnerRoomInfo: {
                unbindCount:0,
                bindCount:0,
                unbindRoomCount:0,
                bindRoomCount:0,
            }
        },
        _initMethod: function () {
            $that._loadIndexOwnerRegisterData();
        },
        _initEvent: function () {
        },
        methods: {
            _loadIndexOwnerRegisterData:function(){
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/propertyIndex.queryOwnerRegisterIndex',
                    param,
                    function (json, res) {
                        let _res = JSON.parse(json);
                        if(_res.code != 0){
                            return;
                        }
                        vc.copyObject(_res.data, $that.indexOwnerRoomInfo);
                        let _dom = document.getElementById('ownerRoomCount');
                        $that._initOwnerEcharts($that.indexOwnerRoomInfo.bindCount, $that.indexOwnerRoomInfo.unbindCount, _dom, vc.i18n('住户信息', 'indexOwnerRoom'), vc.i18n('已处理', 'indexOwnerRoom'), vc.i18n('未处理', 'indexOwnerRoom'), '#4B7AF0', '#E2EDF6');
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                       
                    }
                );
            },
            _initOwnerEcharts: function (userCount, freeCount, dom, _title, _userCountName, _freeCountName, userColor, freeColor) {
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    tooltip: {
                        trigger: 'item'
                    },

                    legend: {
                        top: '5%',
                        left: 'right',
                        orient: 'vertical',  //垂直显示
                    },
                    color: [userColor, freeColor],
                    series: [{
                        name: _title,
                        type: 'pie',
                        radius: ['40%', '65%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
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
                            show: false
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
        }
    })
})(window.vc);