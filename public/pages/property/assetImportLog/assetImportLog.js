/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetImportLogInfo: {
                logs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                carNum: ''
            }
        },
        _initMethod: function () {
            vc.component._listAssetImportLogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('assetImportLog', 'listAssetImportLog', function (_param) {
                vc.component._listAssetImportLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAssetImportLogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAssetImportLogs: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/assetImportLog/queryAssetImportLog',
                    param,
                    function (json, res) {
                        let _assetImportLogInfo = JSON.parse(json);
                        vc.component.assetImportLogInfo.total = _assetImportLogInfo.total;
                        vc.component.assetImportLogInfo.records = _assetImportLogInfo.records;
                        vc.component.assetImportLogInfo.logs = _assetImportLogInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.assetImportLogInfo.records,
                            dataCount: vc.component.assetImportLogInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryData: function () {
                vc.component._listAssetImportLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetail: function (_log) {
                vc.jumpToPage('/#/pages/property/assetImportLogDetail?logId=' + _log.logId + "&logType=" + _log.logType);
            }
        }
    });
})(window.vc);