(function(vc) {
    vc.extends({
        data: {
            reportProficientInfo: {
                receivableAmount: '0',
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
                    objName: ''
                }
            }
        },
        _initMethod: function() {
            vc.component._queryIndexContextData();
            vc.component.changeTab($that.reportProficientInfo._currentTab);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                vc.component.reportProficientInfo.feeTypeCds = _data;
            });
            // $that._initDate();
        },
        _initEvent: function() {
            vc.on("indexContext", "_queryIndexContextData", function(_param) {
                vc.component._queryIndexContextData();
            });
        },
        methods: {
            _initDate: function() {
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
                    .on('changeDate', function(ev) {
                        var value = $(".startTime").val();
                        vc.component.reportProficientInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function(ev) {
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
            _queryIndexContextData: function() {
                if (vc.getCurrentCommunity() == null || vc.getCurrentCommunity() == undefined) {
                    return;
                }
                let param = {
                        params: {
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportProficient',
                    param,
                    function(json, res) {
                        let indexData = JSON.parse(json);
                        let _receivableInformation = indexData.receivableInformation;
                        let _receivableAmount = _receivableInformation.receivableAmount;
                        $that.reportProficientInfo.receivableAmount = _receivableAmount;
                        let _dom = document.getElementById('receivableAmountCount');
                        let _data = [
                            { value: _receivableInformation.oweAmount, name: '欠费金额' },
                            { value: _receivableInformation.receivedAmount, name: '已收金额' }
                        ];
                        $that._initCharts2(_dom, '应收总额', _data, '#4B7AF0', '#E2EDF6');
                        let _floorReceivableInformations = indexData.floorReceivableInformations;
                        _dom = document.getElementById('roomCount');
                        _data = [];
                        _floorReceivableInformations.forEach(item => {
                            _data.push({
                                value: item.receivableAmount,
                                name: item.name
                            })
                        });
                        $that._initCharts2(_dom, '楼栋费用占比', _data, '#01C36D', '#E2EDF6');
                        _data = [];
                        let _feeConfigReceivableInformations = indexData.feeConfigReceivableInformations;
                        _feeConfigReceivableInformations.forEach(item => {
                            _data.push({
                                value: item.receivableAmount,
                                name: item.feeName
                            })
                        });
                        _dom = document.getElementById('parkingSpaceCount');
                        $that._initCharts2(_dom, '分项费用占比', _data, '#4B7AF0', '#E2EDF6');
                        let _remindInfomation = indexData.remindInfomation;
                        _data = [
                            { value: _remindInfomation.deadlineFeeCount, name: '费用到期提醒' },
                            { value: _remindInfomation.prePaymentCount, name: '费用提醒' }
                        ];
                        _dom = document.getElementById('shopCount');
                        $that._initCharts2(_dom, '费用提醒', _data, '#01C36D', '#E2EDF6');
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //随机生成十六进制颜色
            _randomHexColor: function() {
                var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
                while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
                    hex = '0' + hex;
                }
                return '#' + hex; //返回‘#'开头16进制颜色
            },
            _initCharts2: function(dom, _title, _data) {
                let myChart = echarts.init(dom);
                let option = null;
                // 块颜色生成
                let colors = [];
                _data.forEach((item) => {
                    colors.push($that._randomHexColor());
                })
                option = {
                    textStyle: { //图例文字的样式
                        fontSize: 12
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    // color: ['#66CDAA', '#FFDAB9'],
                    color: colors,
                    series: [{
                        name: _title,
                        type: 'pie',
                        radius: '75%',
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
                                show: false
                            }
                        }
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },
            changeTab: function(_tab) {
                $that.reportProficientInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.reportProficientInfo.conditions)
            },
            _changeReporficientFeeTypeCd: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: $that.reportProficientInfo.conditions.feeTypeCd,
                        isDefault: '',
                        feeFlag: '',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfigs = _feeConfigManageInfo.feeConfigs
                        vc.component.reportProficientInfo.feeConfigDtos = _feeConfigs;
                        /*if (_feeConfigs.length > 0) {
                            $that.reportProficientInfo.conditions.configId = _feeConfigs[0].configId;
                            //$that.changeTab($that.reportProficientInfo._currentTab)
                        }*/
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _changeReporficientConfigId: function() {
                $that.changeTab($that.reportProficientInfo._currentTab)
            },
            _queryMethod: function() {
                $that.changeTab($that.reportProficientInfo._currentTab)
            },
            _resetMethod: function() {
                vc.component.reportProficientInfo.conditions.feeTypeCd = "";
                vc.component.reportProficientInfo.conditions.configId = "";
                vc.component.reportProficientInfo.conditions.objName = "";
                $that.changeTab($that.reportProficientInfo._currentTab)
            },
            _getReportProficientRoomName: function() {
                if (vc.component.reportProficientInfo == undefined) {
                    return '请填写房屋编号';
                }
                if (vc.component.reportProficientInfo._currentTab == 'reportProficientRoomFee') {
                    return '请填写房屋编号'
                }
                return '请填写车牌号';
            },
            _exportFee: function() {
                let _objType = vc.component.reportProficientInfo._currentTab == 'reportProficientRoomFee' ? "3333" : "6666"
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' +
                    vc.getCurrentCommunity().communityId +
                    "&configId=" + $that.reportProficientInfo.conditions.configId +
                    "&feeTypeCd=" + $that.reportProficientInfo.conditions.feeTypeCd +
                    "&objType=" + _objType +
                    "&pagePath=reportYearCollection");
            }
        }
    })
})(window.vc);