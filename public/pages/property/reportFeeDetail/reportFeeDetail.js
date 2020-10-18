/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeDetailInfo: {
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
                $that.reportFeeDetailInfo.conditions.startTime = _startTime;
            });

            vc.initDateMonth('endTime', function (_endTime) {
                $that.reportFeeDetailInfo.conditions.endTime = _endTime;
                let start = Date.parse(new Date($that.reportFeeDetailInfo.conditions.startTime + "-01"))
                let end = Date.parse(new Date($that.reportFeeDetailInfo.conditions.endTime + "-01"))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.reportFeeDetailInfo.conditions.endTime = '';
                }
            });

        },
        _initEvent: function () {

            vc.on('reportFeeDetail', 'chooseFloor', function (_param) {
                vc.component.reportFeeDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeDetailInfo.conditions.floorName = _param.floorName;
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

                vc.component.reportFeeDetailInfo.conditions.page = _page;
                vc.component.reportFeeDetailInfo.conditions.row = _rows;
                vc.component.reportFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeDetailInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryFeeDetail',
                    param,
                    function (json, res) {
                        var _reportFeeDetailInfo = JSON.parse(json);
                        vc.component.reportFeeDetailInfo.total = _reportFeeDetailInfo.total;
                        vc.component.reportFeeDetailInfo.records = _reportFeeDetailInfo.records;
                        vc.component.reportFeeDetailInfo.fees = _reportFeeDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeDetailInfo.records,
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
                            vc.component.reportFeeDetailInfo.roomUnits = tmpUnits;
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
            }
        }
    });
})(window.vc);
