/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeDetailCarInfo: {
                fees: [],
                feeTypeCds: [],
                conditions: {},
                total: 0,
                records: 0
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function (_data) {
                $that.reportFeeDetailCarInfo.feeTypeCds = _data
            });
        },
        _initEvent: function () {
            vc.on('reportFeeDetailCar', 'switch', function (_data) {
                $that.reportFeeDetailCarInfo.conditions = _data;
                $that._listReportFeeDetailCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailCar', 'notify', function (_data) {
                $that.reportFeeDetailCarInfo.conditions = _data;
                $that._listReportFeeDetailCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailCar', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._listReportFeeDetailCars(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportFeeDetailCars: function (_page, _rows) {
                $that.reportFeeDetailCarInfo.conditions.page = _page;
                $that.reportFeeDetailCarInfo.conditions.row = _rows;
                let param = {
                    params: $that.reportFeeDetailCarInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeDetailCar',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.reportFeeDetailCarInfo.total = _json.total;
                        $that.reportFeeDetailCarInfo.records = _json.records;
                        $that.reportFeeDetailCarInfo.fees = _json.data;
                        vc.emit('reportFeeDetailCar', 'paginationPlus', 'init', {
                            total: $that.reportFeeDetailCarInfo.records,
                            dataCount: $that.reportFeeDetailCarInfo.total,
                            currentPage: _page,
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportReportFeeDetailCarExcel: function () {
                vc.component.reportFeeDetailCarInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportFeeDetailCarInfo.conditions.pagePath = 'reportFeeDetailCar';
                let param = {
                    params: vc.component.reportFeeDetailCarInfo.conditions
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