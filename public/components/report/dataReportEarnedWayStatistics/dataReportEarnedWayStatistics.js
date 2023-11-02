/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataReportEarnedWayStatisticsInfo: {
                fees: [],
                ownerId: '',
                roomNum: '',
                startDate: '',
                endDate: '',
                feeAmount: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('dataReportEarnedWayStatistics', 'switch', function (_data) {
                $that.dataReportEarnedWayStatisticsInfo.startDate = _data.startDate;
                $that.dataReportEarnedWayStatisticsInfo.endDate = _data.endDate;
                $that._loadDataReportEarnedWayStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadDataReportEarnedWayStatisticsData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        startDate: $that.dataReportEarnedWayStatisticsInfo.startDate,
                        endDate: $that.dataReportEarnedWayStatisticsInfo.endDate,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataReport.queryReceivedWayStatistics',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.dataReportEarnedWayStatisticsInfo.fees = _json.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportReportEarnedWayExcel: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        startDate: $that.dataReportEarnedStatisticsInfo.startDate,
                        endDate: $that.dataReportEarnedStatisticsInfo.endDate,
                        pagePath: 'dataReportEarnedWayStatistics'
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