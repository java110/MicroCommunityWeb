/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceDetailAllocationInfo: {
                resourceStores: [],
                resId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('resourceDetailAllocation', 'switch', function(_data) {
                $that.resourceDetailAllocationInfo.resId = _data.resId;
                $that._loadResourceDetailAllocationData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceDetailAllocation', 'notify',
                function(_data) {
                    $that._loadResourceDetailAllocationData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('resourceDetailAllocation', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadResourceDetailAllocationData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadResourceDetailAllocationData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        resId: $that.resourceDetailAllocationInfo.resId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        $that.resourceDetailAllocationInfo.resourceStores = _json.data;
                        vc.emit('resourceDetailAllocation', 'paginationPlus', 'init', {
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
            _qureyResourceDetailAllocation: function() {
                $that._loadResourceDetailAllocationData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);