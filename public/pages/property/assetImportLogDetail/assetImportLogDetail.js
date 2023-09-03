/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetImportLogDetailInfo: {
                logs: [],
                logTypes: [],
                states: [{
                        name: '全部',
                        value: ''
                    },
                    {
                        name: '待导入',
                        value: 'W'
                    },
                    {
                        name: '导入成功',
                        value: 'C'
                    },
                    {
                        name: '导入失败',
                        value: 'F'
                    }
                ],
                total: 0,
                records: 1,
                moreCondition: false,
                logId: '',
                logType: '',
                state: ''
            }
        },
        _initMethod: function() {
            $that.assetImportLogDetailInfo.logId = vc.getParam('logId');
            $that.assetImportLogDetailInfo.logType = vc.getParam('logType');

            $that.queryAssetImportLogType();


        },
        _initEvent: function() {

            vc.on('assetImportLogDetail', 'listAssetImportLogDetail', function(_param) {
                $that._listAssetImportLogDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAssetImportLogDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAssetImportLogDetails: function(_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        logId: $that.assetImportLogDetailInfo.logId,
                        communityId: vc.getCurrentCommunity().communityId,
                        state: $that.assetImportLogDetailInfo.state,
                    }
                };
                //发送get请求
                vc.http.apiGet('/assetImportLogDetail/queryAssetImportLogDetail',
                    param,
                    function(json, res) {
                        var _assetImportLogDetailInfo = JSON.parse(json);
                        $that.assetImportLogDetailInfo.total = _assetImportLogDetailInfo.total;
                        $that.assetImportLogDetailInfo.records = _assetImportLogDetailInfo.records;
                        $that.assetImportLogDetailInfo.logs = _assetImportLogDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.assetImportLogDetailInfo.records,
                            dataCount: $that.assetImportLogDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            queryAssetImportLogType: function(_page, _rows) {
                let param = {
                    params: {
                        logType: $that.assetImportLogDetailInfo.logType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/log.queryAssetImportLogType',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.assetImportLogDetailInfo.logTypes = _json.data;
                        $that._listAssetImportLogDetails(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },


            _goBack: function() {
                vc.goBack();
            },
            queryAssetImportLogDetail: function() {
                $that._listAssetImportLogDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchDetailState: function(_item) {
                $that.assetImportLogDetailInfo.state = _item.value;
                $that._listAssetImportLogDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);