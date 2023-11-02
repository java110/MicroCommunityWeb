/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeSummaryInfo: {
                fees: [],
                feeConfigs: [],
                floors: [],
                configIds: [],
                feeTypeCds: [],
                communitys:[],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    floorId: '',
                    roomNum: '',
                    startDate: '',
                    endDate: '',
                    configId: '',
                    feeTypeCd: '',
                    ownerName: '',
                    link: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function() {
            $that.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId
            $that._initDate();
            $that._loadStaffCommunitys();
            $that._listFeeConfigs();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                $that.reportFeeSummaryInfo.feeTypeCds = _data
            });
            $that._listFloors();
            $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            
        },
        methods: {
            _initDate: function () {
                vc.initDate('startDate', function (_value) {
                    $that.reportFeeSummaryInfo.conditions.startDate = _value;
                });
                vc.initDate('endDate', function (_value) {
                    $that.reportFeeSummaryInfo.conditions.endDate = _value;
                });
                let _data = new Date();
                let _month = _data.getMonth() + 1;
                let _newDate = "";
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.reportFeeSummaryInfo.conditions.startDate = _newDate;
                _data.setMonth(_data.getMonth() + 1);
                _data.setDate(0);
                _month = _data.getMonth() + 1;
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + '-' + _data.getDate();
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + '-' + _data.getDate();
                }
                $that.reportFeeSummaryInfo.conditions.endDate = _newDate;
            },
            //查询
            _queryMethod: function () {
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchFloor: function (_floorId) {
                $that.reportFeeSummaryInfo.conditions.floorId = _floorId;
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                $that.reportFeeSummaryInfo.conditions.page = _page;
                $that.reportFeeSummaryInfo.conditions.row = _rows;
                //$that.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportFeeSummaryInfo.conditions
                };
                param.params.roomNum = param.params.roomNum.trim();
                param.params.ownerName = param.params.ownerName.trim();
                param.params.link = param.params.link.trim();
                if ($that.reportFeeSummaryInfo.configIds.length > 0) {
                    param.params.configIds = $that.reportFeeSummaryInfo.configIds.join(',');
                } else {
                    param.params.configIds = vc.component.reportFeeSummaryInfo.configIds;
                }
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeSummary',
                    param,
                    function (json, res) {
                        let _reportFeeSummaryInfo = JSON.parse(json);
                        $that.reportFeeSummaryInfo.fees = _reportFeeSummaryInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
                //楼栋收费率
                vc.emit('floorFeeSummary', 'notify', param.params);
                vc.emit('configFeeSummary', 'notify', param.params);
            },
            //重置
            _resetMethod: function (_page, _rows) {
                vc.component.reportFeeSummaryInfo.conditions.floorName = "";
                vc.component.reportFeeSummaryInfo.conditions.floorId = "";
                vc.component.reportFeeSummaryInfo.conditions.unitId = "";
                vc.component.reportFeeSummaryInfo.conditions.roomNum = "";
                vc.component.reportFeeSummaryInfo.conditions.startTime = "";
                vc.component.reportFeeSummaryInfo.conditions.endTime = "";
                vc.component.reportFeeSummaryInfo.configIds = [];
                vc.component.reportFeeSummaryInfo.conditions.configId = "";
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFeeConfigs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.reportFeeSummaryInfo.conditions.communityId,
                        isDefault: 'F'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.reportFeeSummaryInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function () {
                if (vc.component.reportFeeSummaryInfo.moreCondition) {
                    vc.component.reportFeeSummaryInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeSummaryInfo.moreCondition = true;
                }
            },
            _listFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.reportFeeSummaryInfo.conditions.communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloors', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.reportFeeSummaryInfo.floors = _feeConfigManageInfo.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _exportExcel: function () {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
                //$that.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportFeeSummaryInfo.conditions.pagePath = 'reportFeeSummary';
                let param = {
                    params: $that.reportFeeSummaryInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _toDetail: function (_fee) {
                let _configIds = "";
                $that.reportFeeSummaryInfo.feeConfigNames.forEach(item => {
                    _configIds += (item.configId + ',')
                })
                if (_configIds.endsWith(',')) {
                    _configIds = _configIds.substring(0, _configIds.length - 1);
                }
                vc.jumpToPage('/#/pages/property/reportFeeSummaryDetail?feeYear=' + _fee.feeYear + "&feeMonth=" + _fee.feeMonth +
                    "&configIds=" + _configIds + "&" + vc.objToGetParam($that.reportFeeSummaryInfo.conditions))
            },
            _printFeeSummary: function () {
                let _param = vc.objToGetParam($that.reportFeeSummaryInfo.conditions);
                window.open('/print.html#/pages/property/reportFeeSummaryPrint?' + _param);
            },
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.reportFeeSummaryInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity:function(){
                $that._listFeeConfigs();
                $that._listFloors();
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);