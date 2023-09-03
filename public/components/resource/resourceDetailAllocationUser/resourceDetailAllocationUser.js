/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceDetailAllocationUserInfo: {
                allocationUserStorehouses: [],
                resId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('resourceDetailAllocationUser', 'switch', function (_data) {
                $that.resourceDetailAllocationUserInfo.resId = _data.resId;
                $that._loadResourceDetailAllocationUserData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceDetailAllocationUser', 'notify',
                function (_data) {
                    $that._loadResourceDetailAllocationUserData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('resourceDetailAllocationUser', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadResourceDetailAllocationUserData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadResourceDetailAllocationUserData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        resId: $that.resourceDetailAllocationUserInfo.resId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationUserStorehouses',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.resourceDetailAllocationUserInfo.assetInventorys = _json.data;
                        vc.emit('resourceDetailAllocationUser', 'paginationPlus', 'init', {
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
            _qureyResourceDetailAllocationUser: function () {
                $that._loadResourceDetailAllocationUserData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);