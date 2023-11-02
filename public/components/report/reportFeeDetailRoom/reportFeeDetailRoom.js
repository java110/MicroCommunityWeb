/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeDetailRoomInfo: {
                fees: [],
                floors: [],
                floorId: '',
                feeTypeCds: [],
                conditions: {},
                total: 0,
                records: 0
            }
        },
        _initMethod: function () {
            $that._listReportFeeDetailRoomFloors();
            vc.getDict('pay_fee_config', "fee_type_cd_show", function (_data) {
                $that.reportFeeDetailRoomInfo.feeTypeCds = _data
            });
        },
        _initEvent: function () {
            vc.on('reportFeeDetailRoom', 'switch', function (_data) {
                $that.reportFeeDetailRoomInfo.conditions = _data;
                $that._listReportFeeDetailRooms(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailRoom', 'notify', function (_data) {
                $that.reportFeeDetailRoomInfo.conditions = _data;
                $that._listReportFeeDetailRooms(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailRoom', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._listReportFeeDetailRooms(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportFeeDetailRoomFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloors', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.reportFeeDetailRoomInfo.floors = _feeConfigManageInfo.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            swatchFloor: function (_floorId) {
                $that.reportFeeDetailRoomInfo.floorId = _floorId;
                $that._listReportFeeDetailRooms(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listReportFeeDetailRooms: function (_page, _rows) {
                $that.reportFeeDetailRoomInfo.conditions.page = _page;
                $that.reportFeeDetailRoomInfo.conditions.row = _rows;
                $that.reportFeeDetailRoomInfo.conditions.floorId = $that.reportFeeDetailRoomInfo.floorId;
                let param = {
                    params: $that.reportFeeDetailRoomInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeDetailRoom',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.reportFeeDetailRoomInfo.total = _json.total;
                        $that.reportFeeDetailRoomInfo.records = _json.records;
                        $that.reportFeeDetailRoomInfo.fees = _json.data;
                        vc.emit('reportFeeDetailRoom', 'paginationPlus', 'init', {
                            total: $that.reportFeeDetailRoomInfo.records,
                            dataCount: $that.reportFeeDetailRoomInfo.total,
                            currentPage: _page,
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportReportFeeDetailRoomExcel: function () {
                vc.component.reportFeeDetailRoomInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportFeeDetailRoomInfo.conditions.pagePath = 'reportFeeDetailRoom';
                let param = {
                    params: vc.component.reportFeeDetailRoomInfo.conditions
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
            }
        }
    });
})(window.vc);