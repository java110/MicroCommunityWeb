/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataReportEarnedStatisticsInfo: {
                fees: [],
                feeTypeCds: [],
                ownerId: '',
                roomNum: '',
                startDate: '',
                endDate: '',
                feeAmount: '0'
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function (_data) {
                $that.dataReportEarnedStatisticsInfo.feeTypeCds = _data
            });
        },
        _initEvent: function () {
            vc.on('dataReportEarnedStatistics', 'switch', function (_data) {
                $that.dataReportEarnedStatisticsInfo.startDate = _data.startDate;
                $that.dataReportEarnedStatisticsInfo.endDate = _data.endDate;
                $that._loadDataReportEarnedStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataReportEarnedStatistics', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadDataReportEarnedStatisticsData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('dataReportEarnedStatistics', 'notify', function (_data) {
                $that._loadDataReportEarnedStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadDataReportEarnedStatisticsData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        startDate: $that.dataReportEarnedStatisticsInfo.startDate,
                        endDate: $that.dataReportEarnedStatisticsInfo.endDate,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataReport.queryReceivedStatistics',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.dataReportEarnedStatisticsInfo.fees = _json.data;
                        vc.emit('dataReportEarnedStatistics', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                        let _feeAmount = 0.0;
                        if (_json.data && _json.data.length > 0) {
                            _json.data.forEach(item => {
                                _feeAmount += parseFloat(item.receivedFee);
                            });
                        }
                        $that.dataReportEarnedStatisticsInfo.feeAmount = _feeAmount.toFixed(2);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDataReportEarnedStatistics: function () {
                $that._loadDataReportEarnedStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportReportEarnedExcel: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        startDate: $that.dataReportEarnedStatisticsInfo.startDate,
                        endDate: $that.dataReportEarnedStatisticsInfo.endDate,
                        pagePath: 'dataReportEarnedStatistics'
                    }
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
            },
        }
    });
})(window.vc);