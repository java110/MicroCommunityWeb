/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailAccountInfo: {
                accounts: [],
                ownerId: '',
                name: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailAccount', 'switch', function (_data) {
                $that.ownerDetailAccountInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailAccountData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailAccount', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailAccountData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailAccount', 'notify', function (_data) {
                $that._loadOwnerDetailAccountData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadOwnerDetailAccountData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerDetailAccountInfo.ownerId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/account/queryOwnerAccount',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailAccountInfo.accounts = _roomInfo.data;
                        vc.emit('ownerDetailAccount', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailAccount: function () {
                $that._loadOwnerDetailAccountData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _accountDetail: function (_account) {
                vc.jumpToPage('/#/pages/property/accountDetailManage?acctId=' + _account.acctId);
            },
            _prestoreAccount: function (_account) {
                vc.emit('prestoreAccount', 'openAddModal', {
                    ownerId: $that.ownerDetailAccountInfo.ownerId,
                    acctType: _account.acctType,
                    tel: _account.link
                });
            },
            _prestoreAccount1:function(){
                vc.emit('prestoreAccount', 'openAddModal', {
                });
            }

        }
    });
})(window.vc);