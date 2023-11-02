/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeDetailContractInfo: {
                fees: [],
                feeTypeCds: [],
                conditions: {},
                total: 0,
                records: 0
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function (_data) {
                $that.reportFeeDetailContractInfo.feeTypeCds = _data
            });
        },
        _initEvent: function () {
            vc.on('reportFeeDetailContract', 'switch', function (_data) {
                $that.reportFeeDetailContractInfo.conditions = _data;
                $that._listReportFeeDetailContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailContract', 'notify', function (_data) {
                $that.reportFeeDetailContractInfo.conditions = _data;
                $that._listReportFeeDetailContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailContract', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._listReportFeeDetailContracts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportFeeDetailContracts: function (_page, _rows) {
                $that.reportFeeDetailContractInfo.conditions.page = _page;
                $that.reportFeeDetailContractInfo.conditions.row = _rows;
                let param = {
                    params: $that.reportFeeDetailContractInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeDetailContract',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.reportFeeDetailContractInfo.total = _json.total;
                        $that.reportFeeDetailContractInfo.records = _json.records;
                        $that.reportFeeDetailContractInfo.fees = _json.data;
                        vc.emit('reportFeeDetailContract', 'paginationPlus', 'init', {
                            total: $that.reportFeeDetailContractInfo.records,
                            dataCount: $that.reportFeeDetailContractInfo.total,
                            currentPage: _page,
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportReportFeeDetailContractExcel: function() {
                //$that.reportFeeDetailContractInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportFeeDetailContractInfo.conditions.pagePath = 'reportFeeDetailContract';
                let param = {
                    params: $that.reportFeeDetailContractInfo.conditions
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