/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountManageInfo: {
                accounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                scId: '',
                conditions: {
                    ownerName: '',
                    idCard: '',
                    link: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listAccounts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('accountManage', 'listshopAccount', function (_param) {
                vc.component._listAccounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccounts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccounts: function (_page, _rows) {
                vc.component.accountManageInfo.conditions.page = _page;
                vc.component.accountManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.accountManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/account/queryOwnerAccount',
                    param,
                    function (json, res) {
                        var _accountManageInfo = JSON.parse(json);
                        vc.component.accountManageInfo.total = _accountManageInfo.total;
                        vc.component.accountManageInfo.records = _accountManageInfo.records;
                        vc.component.accountManageInfo.accounts = _accountManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryAccountMethod: function () {
                vc.component._listAccounts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.accountManageInfo.moreCondition) {
                    vc.component.accountManageInfo.moreCondition = false;
                } else {
                    vc.component.accountManageInfo.moreCondition = true;
                }
            },
            _prestoreAccount: function () {
                vc.emit('prestoreAccount', 'openAddModal', {});
            },
            _accountDetail: function (_account) {
                vc.jumpToPage('/admin.html#/pages/property/accountDetailManage?acctId=' + _account.acctId);
            }
        }
    });
})(window.vc);
