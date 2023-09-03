/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceDetailUseRecordInfo: {
                resourceStoreUseRecords: [],
                resId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('resourceDetailUseRecord', 'switch', function (_data) {
                $that.resourceDetailUseRecordInfo.resId = _data.resId;
                $that._loadResourceDetailUseRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceDetailUseRecord', 'notify',
                function (_data) {
                    $that._loadResourceDetailUseRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('resourceDetailUseRecord', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadResourceDetailUseRecordData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadResourceDetailUseRecordData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        resId: $that.resourceDetailUseRecordInfo.resId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.resourceDetailUseRecordInfo.resourceStoreUseRecords = _json.data;
                        vc.emit('resourceDetailUseRecord', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyResourceDetailUseRecord: function () {
                $that._loadResourceDetailUseRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);