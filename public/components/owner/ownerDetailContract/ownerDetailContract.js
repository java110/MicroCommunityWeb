/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailContractInfo: {
                contracts: [],
                ownerId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailContract', 'switch', function (_data) {
                $that.ownerDetailContractInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailContractData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailContract', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailContractData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailContractData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.ownerDetailContractInfo.ownerId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailContractInfo.contracts = _roomInfo.data;
                        vc.emit('ownerDetailContract', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailContract: function () {
                $that._loadOwnerDetailContractData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);