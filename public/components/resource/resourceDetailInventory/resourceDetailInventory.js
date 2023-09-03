/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceDetailInventoryInfo: {
                assetInventorys: [],
                resId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('resourceDetailInventory', 'switch', function (_data) {
                $that.resourceDetailInventoryInfo.resId = _data.resId;
                $that._loadResourceDetailInventoryData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceDetailInventory', 'notify',
                function (_data) {
                    $that._loadResourceDetailInventoryData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('resourceDetailInventory', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadResourceDetailInventoryData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadResourceDetailInventoryData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        resId: $that.resourceDetailInventoryInfo.resId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/assetInventory.listAssetInventory',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.resourceDetailInventoryInfo.assetInventorys = _json.data;
                        vc.emit('resourceDetailInventory', 'paginationPlus', 'init', {
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
            _qureyResourceDetailInventory: function () {
                $that._loadResourceDetailInventoryData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);