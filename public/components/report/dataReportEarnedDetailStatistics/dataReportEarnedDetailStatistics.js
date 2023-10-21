/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataReportEarnedDetailStatisticsInfo: {
                fees: [],
                feeTypeCds: [],
                ownerId: '',
                roomNum: '',
                startDate: '',
                endDate: '',
                objName: '',
                ownerName: '',
                communityId:'',
                link: '',
                feeAmount: '0'
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function(_data) {
                $that.dataReportEarnedDetailStatisticsInfo.feeTypeCds = _data
            });
        },
        _initEvent: function() {
            vc.on('dataReportEarnedDetailStatistics', 'switch', function(_data) {
                $that.dataReportEarnedDetailStatisticsInfo.startDate = _data.startDate;
                $that.dataReportEarnedDetailStatisticsInfo.endDate = _data.endDate;
                $that.dataReportEarnedDetailStatisticsInfo.communityId = _data.communityId;
                $that._loadDataReportEarnedDetailStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataReportEarnedDetailStatistics', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadDataReportEarnedDetailStatisticsData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('dataReportEarnedDetailStatistics', 'notify', function(_data) {
                $that._loadDataReportEarnedDetailStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadDataReportEarnedDetailStatisticsData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: $that.dataReportEarnedDetailStatisticsInfo.communityId,
                        startDate: $that.dataReportEarnedDetailStatisticsInfo.startDate,
                        endDate: $that.dataReportEarnedDetailStatisticsInfo.endDate,
                        objName: $that.dataReportEarnedDetailStatisticsInfo.objName,
                        ownerName: $that.dataReportEarnedDetailStatisticsInfo.ownerName,
                        link: $that.dataReportEarnedDetailStatisticsInfo.link,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/dataReport.queryReceivedDetailStatistics',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        $that.dataReportEarnedDetailStatisticsInfo.fees = _json.data;
                        vc.emit('dataReportEarnedDetailStatistics', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                        
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDataReportEarnedDetailStatistics: function() {
                $that._loadDataReportEarnedDetailStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportReportEarnedDetailExcel: function() {
                let param = {
                    params: {
                        communityId: $that.dataReportEarnedDetailStatisticsInfo.communityId,
                        startDate: $that.dataReportEarnedDetailStatisticsInfo.startDate,
                        endDate: $that.dataReportEarnedDetailStatisticsInfo.endDate,
                        objName: $that.dataReportEarnedDetailStatisticsInfo.objName,
                        ownerName: $that.dataReportEarnedDetailStatisticsInfo.ownerName,
                        link: $that.dataReportEarnedDetailStatisticsInfo.link,
                        pagePath:'dataReportEarnedDetailStatistics'
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