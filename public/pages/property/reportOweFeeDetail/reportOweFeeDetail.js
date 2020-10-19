/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportOweFeeDetailInfo: {
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
                    startTime:'',
                    endTime:''
                }
            }
        },
        _initMethod: function () {
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.initDateMonth('startTime', function (_startTime) {
                $that.reportOweFeeDetailInfo.conditions.startTime = _startTime;
            });

            vc.initDateMonth('endTime', function (_endTime) {
                $that.reportOweFeeDetailInfo.conditions.endTime = _endTime;
                let start = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.startTime + "-01"))
                let end = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.endTime + "-01"))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.reportOweFeeDetailInfo.conditions.endTime = '';
                }
            });

        },
        _initEvent: function () {

            vc.on('reportOweFeeDetail', 'chooseFloor', function (_param) {
                vc.component.reportOweFeeDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportOweFeeDetailInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);

            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _queryMethod:function(){
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFees: function (_page, _rows) {

                vc.component.reportOweFeeDetailInfo.conditions.page = _page;
                vc.component.reportOweFeeDetailInfo.conditions.row = _rows;
                vc.component.reportOweFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportOweFeeDetailInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryOweFeeDetail',
                    param,
                    function (json, res) {
                        var _reportOweFeeDetailInfo = JSON.parse(json);
                        vc.component.reportOweFeeDetailInfo.total = _reportOweFeeDetailInfo.total;
                        vc.component.reportOweFeeDetailInfo.records = _reportOweFeeDetailInfo.records;
                        vc.component.reportOweFeeDetailInfo.fees = _reportOweFeeDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportOweFeeDetailInfo.records,
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
                            vc.component.reportOweFeeDetailInfo.roomUnits = tmpUnits;
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
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId='+vc.getCurrentCommunity().communityId+"&pagePath=reportOweFeeDetail");
            }
        }
    });
})(window.vc);
