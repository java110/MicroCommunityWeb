/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeDetailOwnerInfo: {
                fees: [],
                feeTypeCds: [],
                conditions: {},
                total: 0,
                records: 0
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function(_data) {
                $that.reportFeeDetailOwnerInfo.feeTypeCds = _data
            });
        },
        _initEvent: function() {
            vc.on('reportFeeDetailOwner', 'switch', function(_data) {
                $that.reportFeeDetailOwnerInfo.conditions = _data;
                $that._listReportFeeDetailOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailOwner', 'notify', function(_data) {
                $that.reportFeeDetailOwnerInfo.conditions = _data;
                $that._listReportFeeDetailOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportFeeDetailOwner', 'paginationPlus', 'page_event', function(_currentPage) {
                $that._listReportFeeDetailOwners(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportFeeDetailOwners: function(_page, _rows) {
                $that.reportFeeDetailOwnerInfo.conditions.page = _page;
                $that.reportFeeDetailOwnerInfo.conditions.row = _rows;
                $that.reportFeeDetailOwnerInfo.conditions.floorId = $that.reportFeeDetailOwnerInfo.floorId;
                let param = {
                    params: $that.reportFeeDetailOwnerInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeDetailOwner',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.reportFeeDetailOwnerInfo.total = _json.total;
                        $that.reportFeeDetailOwnerInfo.records = _json.records;
                        $that.reportFeeDetailOwnerInfo.fees = _json.data;

                        vc.emit('reportFeeDetailOwner', 'paginationPlus', 'init', {
                            total: $that.reportFeeDetailOwnerInfo.records,
                            dataCount: $that.reportFeeDetailOwnerInfo.total,
                            currentPage: _page,
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportReportFeeDetailOwnerExcel: function() {
                vc.component.reportFeeDetailOwnerInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportFeeDetailOwnerInfo.conditions.pagePath = 'reportFeeDetailOwner';
                let param = {
                    params: vc.component.reportFeeDetailOwnerInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            }

        }
    });
})(window.vc);