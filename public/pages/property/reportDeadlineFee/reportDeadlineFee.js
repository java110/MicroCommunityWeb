/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportDeadlineFeeInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.initDateMonth('startTime', function (_startTime) {
                $that.reportDeadlineFeeInfo.conditions.startTime = _startTime;
            });
            vc.initDateMonth('endTime', function (_endTime) {
                $that.reportDeadlineFeeInfo.conditions.endTime = _endTime;
                let start = Date.parse(new Date($that.reportDeadlineFeeInfo.conditions.startTime + "-01"))
                let end = Date.parse(new Date($that.reportDeadlineFeeInfo.conditions.endTime + "-01"))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.reportDeadlineFeeInfo.conditions.endTime = '';
                }
            });

            $(".popover-show").mouseover(() => { $('.popover-show').popover('show'); })
            $(".popover-show").mouseleave(() => { $('.popover-show').popover('hide'); })
        },
        _initEvent: function () {
            vc.on('reportDeadlineFee', 'chooseFloor', function (_param) {
                vc.component.reportDeadlineFeeInfo.conditions.floorId = _param.floorId;
                vc.component.reportDeadlineFeeInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMethod: function () {
                vc.component._resetFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                vc.component.reportDeadlineFeeInfo.conditions.page = _page;
                vc.component.reportDeadlineFeeInfo.conditions.row = _rows;
                vc.component.reportDeadlineFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportDeadlineFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryDeadlineFee',
                    param,
                    function (json, res) {
                        var _reportDeadlineFeeInfo = JSON.parse(json);
                        vc.component.reportDeadlineFeeInfo.total = _reportDeadlineFeeInfo.total;
                        vc.component.reportDeadlineFeeInfo.records = _reportDeadlineFeeInfo.records;
                        vc.component.reportDeadlineFeeInfo.fees = _reportDeadlineFeeInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportDeadlineFeeInfo.records,
                            dataCount: vc.component.reportDeadlineFeeInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetFees: function (_page, _rows) {
                vc.component.reportDeadlineFeeInfo.conditions.floorName = "";
                vc.component.reportDeadlineFeeInfo.conditions.floorId = "";
                vc.component.reportDeadlineFeeInfo.conditions.unitId = "";
                vc.component.reportDeadlineFeeInfo.conditions.roomNum = "";
                vc.component.reportDeadlineFeeInfo.roomUnits = [];
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
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
                            vc.component.reportDeadlineFeeInfo.roomUnits = tmpUnits;
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
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportDeadlineFee&' + vc.objToGetParam($that.reportDeadlineFeeInfo.conditions));
            }
        }
    });
})(window.vc);
