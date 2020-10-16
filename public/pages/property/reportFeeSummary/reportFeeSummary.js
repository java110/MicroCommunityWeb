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
            vc.component._listActivitiess(DEFAULT_PAGE, DEFAULT_ROWS);

        },
        _initEvent: function () {

            vc.on('reportFeeSummary', 'chooseFloor', function (_param) {
                vc.component.reportFeeSummaryInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeSummaryInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);

            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listActivitiess(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listActivitiess: function (_page, _rows) {

                vc.component.reportFeeSummaryInfo.conditions.page = _page;
                vc.component.reportFeeSummaryInfo.conditions.row = _rows;
                vc.component.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeSummaryInfo.conditions
                };

                //发送get请求
                vc.http.get('reportFeeSummary',
                    'list',
                    param,
                    function (json, res) {
                        var _reportFeeSummaryInfo = JSON.parse(json);
                        vc.component.reportFeeSummaryInfo.total = _reportFeeSummaryInfo.total;
                        vc.component.reportFeeSummaryInfo.records = _reportFeeSummaryInfo.records;
                        vc.component.reportFeeSummaryInfo.activitiess = _reportFeeSummaryInfo.activitiess;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeSummaryInfo.records,
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
                            vc.component.reportFeeSummaryInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
        }
    });
})(window.vc);
