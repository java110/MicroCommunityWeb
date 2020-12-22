/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportPayFeeDetailInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                totalReceivableAmount: 0,
                totalReceivedAmount: 0,
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    startTime:'',
                    endTime:''
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportPayFeeDetailInfo.conditions.startTime = _startTime;
            // });

            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportPayFeeDetailInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportPayFeeDetailInfo.conditions.endTime = '';
            //     }
            // });

        },
        _initEvent: function () {

            vc.on('reportPayFeeDetail', 'chooseFloor', function (_param) {
                vc.component.reportPayFeeDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportPayFeeDetailInfo.conditions.floorName = _param.floorName;
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
                        vc.component.reportPayFeeDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportPayFeeDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportPayFeeDetailInfo.conditions.endTime = '';
                        }
                    });
            },
            _queryMethod:function(){
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFees: function (_page, _rows) {

                vc.component.reportPayFeeDetailInfo.conditions.page = _page;
                vc.component.reportPayFeeDetailInfo.conditions.row = _rows;
                vc.component.reportPayFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportPayFeeDetailInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryPayFeeDetail',
                    param,
                    function (json, res) {
                        var _reportPayFeeDetailInfo = JSON.parse(json);
                        vc.component.reportPayFeeDetailInfo.total = _reportPayFeeDetailInfo.total;
                        vc.component.reportPayFeeDetailInfo.records = _reportPayFeeDetailInfo.records;
                        vc.component.reportPayFeeDetailInfo.fees = _reportPayFeeDetailInfo.data;
                        vc.component.reportPayFeeDetailInfo.totalReceivedAmount = _reportPayFeeDetailInfo.totalReceivedAmount;
                        vc.component.reportPayFeeDetailInfo.totalReceivableAmount = _reportPayFeeDetailInfo.totalReceivableAmount;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportPayFeeDetailInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportPayFeeDetailInfo.total
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
                            vc.component.reportPayFeeDetailInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseFloorMethod:function(){
                vc.emit('searchFloor','openSearchFloorModel',{});
            },
            _exportFee:function(){
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeDetail&'+vc.objToGetParam($that.reportPayFeeDetailInfo.conditions));
            }
        }
    });
})(window.vc);
