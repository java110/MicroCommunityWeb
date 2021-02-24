(function (vc) {

    vc.extends({
        data: {
            reportProficientInfo: {
                ownerCount: '0',
                noEnterRoomCount: '0',
                roomCount: '0',
                freeRoomCount: '0',
                parkingSpaceCount: '0',
                freeParkingSpaceCount: '0',
                shopCount: '0',
                freeShopCount: '0',
                _currentTab: 'reportProficientRoomFee',
                feeTypeCds: [],
                feeConfigDtos: [],
                conditions: {
                    configId: '',
                    feeTypeCd: '',
                    startTime: '',
                    endTime: '',
                    roomNum: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._queryIndexContextData();
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.reportProficientInfo.feeTypeCds = _data;
            });

            $that._initDate();
        },
        _initEvent: function () {
            vc.on("indexContext", "_queryIndexContextData", function (_param) {
                vc.component._queryIndexContextData();
            });

        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.reportProficientInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportProficientInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportProficientInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportProficientInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportProficientInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _queryIndexContextData: function () {
                if (vc.getCurrentCommunity() == null || vc.getCurrentCommunity() == undefined) {
                    return;
                }
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.get('indexContext',
                    'getData',
                    param,
                    function (json, res) {
                        var indexData = JSON.parse(json);
                        vc.copyObject(indexData, vc.component.reportProficientInfo);
                        let _dom = document.getElementById('ownerCount');
                        $that._initCharts2(indexData.ownerCount - indexData.noEnterRoomCount, indexData.noEnterRoomCount, _dom, '应收总额', '欠费金额', '已收金额');

                        _dom = document.getElementById('roomCount');
                        $that._initCharts2(indexData.roomCount - indexData.freeRoomCount, indexData.freeRoomCount, _dom, '楼栋费用占比', '已入住', '空闲');

                        _dom = document.getElementById('parkingSpaceCount');
                        $that._initCharts2(indexData.parkingSpaceCount - indexData.freeParkingSpaceCount, indexData.freeParkingSpaceCount, _dom, '分项费用占比', '已使用', '空闲');

                        _dom = document.getElementById('shopCount');
                        $that._initCharts2(indexData.shopCount - indexData.freeShopCount, indexData.freeShopCount, _dom, '费用提醒', '费用到期提醒', '预交费提醒');
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _initCharts2: function (userCount, freeCount, dom, _title, _userCountName, _freeCountName) {

                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    textStyle: {//图例文字的样式
                        fontSize: 12
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    color: ['#66CDAA', '#FFDAB9'],
                    series: [
                        {
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
                        }
                    ]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },
            changeTab: function (_tab) {
                $that.reportProficientInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {})
            },
            _changeReporficientFeeTypeCd: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: $that.reportProficientInfo.conditions.feeTypeCd,
                        isDefault: '',
                        feeFlag: '1003006',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.reportProficientInfo.feeConfigDtos = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    })
})(window.vc);