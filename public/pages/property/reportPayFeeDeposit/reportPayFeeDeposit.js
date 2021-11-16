/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportPayFeeDepositInfo: {
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                depositFees: [],
                sumTotal: [],
                feeConfigs: [],
                states: [],
                payerObjTypes: [],
                detailStates: [],
                roomUnits: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    feeId: '',
                    state: '',
                    payerObjType: '',
                    startTime: '',
                    endTime: '',
                    configId: '',
                    detailState: '',
                    feeTypeCd: '888800010006', //押金
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            // vc.component.initFeeConfig();
            vc.component._initDate();
            //与字典表收费状态关联
            vc.getDict('pay_fee', "state", function (_data) {
                vc.component.reportPayFeeDepositInfo.states = _data;
            });
            //与字典表付费对象类型关联
            vc.getDict('pay_fee', "payer_obj_type", function (_data) {
                vc.component.reportPayFeeDepositInfo.payerObjTypes = _data;
            });
            //与字典表退费状态关联
            vc.getDict('pay_fee_detail', "state", function (_data) {
                vc.component.reportPayFeeDepositInfo.detailStates = _data;
            });
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('reportPayFeeDeposit', 'chooseFloor', function (_param) {
                vc.component.reportPayFeeDepositInfo.conditions.floorId = _param.floorId;
                vc.component.reportPayFeeDepositInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.reportPayFeeDepositInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportPayFeeDepositInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportPayFeeDepositInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportPayFeeDepositInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportPayFeeDepositInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByName('startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByName("endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            //查询
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                vc.component.reportPayFeeDepositInfo.conditions.page = _page;
                vc.component.reportPayFeeDepositInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportPayFeeDepositInfo.conditions
                };
                param.params.feeId = param.params.feeId.trim();
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryPayFeeDeposit',
                    param,
                    function (json, res) {
                        var _reportPayFeeDepositInfo = JSON.parse(json);
                        vc.component.reportPayFeeDepositInfo.total = _reportPayFeeDepositInfo.total;
                        vc.component.reportPayFeeDepositInfo.records = _reportPayFeeDepositInfo.records;
                        vc.component.reportPayFeeDepositInfo.depositFees = _reportPayFeeDepositInfo.data;
                        vc.component.reportPayFeeDepositInfo.sumTotal = _reportPayFeeDepositInfo.sumTotal;
                        if (_reportPayFeeDepositInfo.data.length > 0) {
                            vc.component.reportPayFeeDepositInfo.feeConfigs = _reportPayFeeDepositInfo.data[0].feeConfigDtos
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportPayFeeDepositInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportPayFeeDepositInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function (_page, _rows) {
                vc.component.reportPayFeeDepositInfo.conditions.configId = '';
                vc.component.reportPayFeeDepositInfo.conditions.feeId = '';
                vc.component.reportPayFeeDepositInfo.conditions.payerObjType = '';
                vc.component.reportPayFeeDepositInfo.conditions.state = '';
                vc.component.reportPayFeeDepositInfo.conditions.startTime = '';
                vc.component.reportPayFeeDepositInfo.conditions.endTime = '';
                vc.component.reportPayFeeDepositInfo.conditions.detailState = '';
                vc.component.reportPayFeeDepositInfo.conditions.floorId = '';
                vc.component.reportPayFeeDepositInfo.conditions.floorName = '';
                vc.component.reportPayFeeDepositInfo.conditions.roomNum = '';
                vc.component.reportPayFeeDepositInfo.conditions.unitId = '';
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.reportPayFeeDepositInfo.moreCondition) {
                    vc.component.reportPayFeeDepositInfo.moreCondition = false;
                } else {
                    vc.component.reportPayFeeDepositInfo.moreCondition = true;
                }
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            loadUnits: function (_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'room',
                    'loadUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.reportPayFeeDepositInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeDeposit&' + vc.objToGetParam($that.reportPayFeeDepositInfo.conditions));
            },
            _openPayFeeDetail: function(_param){
                vc.jumpToPage('/admin.html#/pages/property/propertyFee?feeId=' + _param.feeId);
            }
        }
    });
})(window.vc);
