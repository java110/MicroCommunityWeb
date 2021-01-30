/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeBreakdownInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                feeConfigDtos: [],
                feeTypeCds: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    configId: '',
                    feeTypeCd: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.reportFeeBreakdownInfo.feeTypeCds = _data;
            });
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportFeeBreakdownInfo.conditions.startTime = _startTime;
            // });
            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportFeeBreakdownInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportFeeBreakdownInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportFeeBreakdownInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportFeeBreakdownInfo.conditions.endTime = '';
            //     }
            // });
        },
        _initEvent: function () {
            vc.on('reportFeeBreakdown', 'chooseFloor', function (_param) {
                vc.component.reportFeeBreakdownInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeBreakdownInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);

            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
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
                        vc.component.reportFeeBreakdownInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportFeeBreakdownInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportFeeBreakdownInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportFeeBreakdownInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportFeeBreakdownInfo.conditions.endTime = '';
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
            //查询
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                vc.component.reportFeeBreakdownInfo.conditions.page = _page;
                vc.component.reportFeeBreakdownInfo.conditions.row = _rows;
                vc.component.reportFeeBreakdownInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeBreakdownInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryFeeBreakdown',
                    param,
                    function (json, res) {
                        var _reportFeeBreakdownInfo = JSON.parse(json);
                        vc.component.reportFeeBreakdownInfo.total = _reportFeeBreakdownInfo.total;
                        vc.component.reportFeeBreakdownInfo.records = _reportFeeBreakdownInfo.records;
                        vc.component.reportFeeBreakdownInfo.fees = _reportFeeBreakdownInfo.data;
                        if (_reportFeeBreakdownInfo.data.length > 0) {
                            vc.component.reportFeeBreakdownInfo.feeConfigDtos = _reportFeeBreakdownInfo.data[0].feeConfigDtos;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeBreakdownInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function () {
                vc.component._resetListFee(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置方法
            _resetListFee: function (_page, _rows) {
                vc.component.reportFeeBreakdownInfo.conditions.floorId = "";
                vc.component.reportFeeBreakdownInfo.conditions.floorName = "";
                vc.component.reportFeeBreakdownInfo.conditions.unitId = "";
                vc.component.reportFeeBreakdownInfo.conditions.roomNum = "";
                vc.component.reportFeeBreakdownInfo.conditions.configId = "";
                vc.component.reportFeeBreakdownInfo.conditions.startTime = "";
                vc.component.reportFeeBreakdownInfo.conditions.endTime = "";
                vc.component.reportFeeBreakdownInfo.conditions.feeTypeCd = "";
                // 清除下拉框选项
                vc.component.reportFeeBreakdownInfo.roomUnits = [];
                var param = {
                    params: vc.component.reportFeeBreakdownInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryFeeBreakdown',
                    param,
                    function (json, res) {
                        var _reportFeeBreakdownInfo = JSON.parse(json);
                        vc.component.reportFeeBreakdownInfo.total = _reportFeeBreakdownInfo.total;
                        vc.component.reportFeeBreakdownInfo.records = _reportFeeBreakdownInfo.records;
                        vc.component.reportFeeBreakdownInfo.fees = _reportFeeBreakdownInfo.data;
                        if (_reportFeeBreakdownInfo.data.length > 0) {
                            vc.component.reportFeeBreakdownInfo.feeConfigDtos = _reportFeeBreakdownInfo.data[0].feeConfigDtos;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeBreakdownInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
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
                            vc.component.reportFeeBreakdownInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function () {
                if (vc.component.reportFeeBreakdownInfo.moreCondition) {
                    vc.component.reportFeeBreakdownInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeBreakdownInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' + vc.getCurrentCommunity().communityId + "&pagePath=reportFeeBreakdown");
            }
        }
    });
})(window.vc);
