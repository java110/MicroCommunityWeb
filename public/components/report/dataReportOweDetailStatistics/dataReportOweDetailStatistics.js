/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataReportOweDetailStatisticsInfo: {
                fees: [],
                feeTypeCds: [],
                ownerId: '',
                roomNum: '',
                startDate: '',
                endDate: '',
                objName: '',
                ownerName: '',
                link: '',
                feeAmount: '0'
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function(_data) {
                $that.dataReportOweDetailStatisticsInfo.feeTypeCds = _data
            });
        },
        _initEvent: function() {
            vc.on('dataReportOweDetailStatistics', 'switch', function(_data) {
                $that.dataReportOweDetailStatisticsInfo.startDate = _data.startDate;
                $that.dataReportOweDetailStatisticsInfo.endDate = _data.endDate;
                $that._loadDataReportOweDetailStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataReportOweDetailStatistics', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadDataReportOweDetailStatisticsData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('dataReportOweDetailStatistics', 'notify', function(_data) {
                $that._loadDataReportOweDetailStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadDataReportOweDetailStatisticsData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        startDate: $that.dataReportOweDetailStatisticsInfo.startDate,
                        endDate: $that.dataReportOweDetailStatisticsInfo.endDate,
                        objName: $that.dataReportOweDetailStatisticsInfo.objName,
                        ownerName: $that.dataReportOweDetailStatisticsInfo.ownerName,
                        link: $that.dataReportOweDetailStatisticsInfo.link,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/dataReport.queryOweDetailStatistics',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        $that.dataReportOweDetailStatisticsInfo.fees = _json.data;
                        vc.emit('dataReportOweDetailStatistics', 'paginationPlus', 'init', {
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

                        $that.dataReportOweDetailStatisticsInfo.feeAmount = _feeAmount.toFixed(2);
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDataReportOweDetailStatistics: function() {
                $that._loadDataReportOweDetailStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportReportOweDetailExcel: function() {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        startDate: $that.dataReportOweDetailStatisticsInfo.startDate,
                        endDate: $that.dataReportOweDetailStatisticsInfo.endDate,
                        objName: $that.dataReportOweDetailStatisticsInfo.objName,
                        ownerName: $that.dataReportOweDetailStatisticsInfo.ownerName,
                        link: $that.dataReportOweDetailStatisticsInfo.link,
                        pagePath: 'dataReportOweDetailStatistics'
                    }
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
            },
        }
    });
})(window.vc);