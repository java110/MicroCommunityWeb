/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetImportLogDetailInfo: {
                logs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                logId: '',
            }
        },
        _initMethod: function () {
            $that.assetImportLogDetailInfo.logId = vc.getParam('logId');
            vc.component._listAssetImportLogDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('assetImportLogDetail', 'listAssetImportLogDetail', function (_param) {
                vc.component._listAssetImportLogDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAssetImportLogDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAssetImportLogDetails: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        logId: $that.assetImportLogDetailInfo.logId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/assetImportLogDetail/queryAssetImportLogDetail',
                    param,
                    function (json, res) {
                        var _assetImportLogDetailInfo = JSON.parse(json);
                        vc.component.assetImportLogDetailInfo.total = _assetImportLogDetailInfo.total;
                        vc.component.assetImportLogDetailInfo.records = _assetImportLogDetailInfo.records;
                        vc.component.assetImportLogDetailInfo.logs = _assetImportLogDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.assetImportLogDetailInfo.records,
                            dataCount: vc.component.assetImportLogDetailInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
        }
    });
})(window.vc);
