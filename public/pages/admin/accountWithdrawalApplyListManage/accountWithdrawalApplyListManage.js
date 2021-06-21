/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountWithdrawalApplyListManageInfo: {
                accountWithdrawalApplyLists: [],
                total: 0,
                records: 1,
                moreCondition: false,
                applyId: '',
                conditions: {
                    state: ''


                }
            }
        },
        _initMethod: function () {
            vc.component._listAccountWithdrawalApplyLists(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('accountWithdrawalApplyManage', 'listAccountWithdrawalApply', function (_param) {
                vc.component._listAccountWithdrawalApplyLists(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccountWithdrawalApplyLists(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccountWithdrawalApplyLists: function (_page, _rows) {

                vc.component.accountWithdrawalApplyListManageInfo.conditions.page = _page;
                vc.component.accountWithdrawalApplyListManageInfo.conditions.row = _rows;
                vc.component.accountWithdrawalApplyListManageInfo.conditions.state = '486,586,587,686,687';
                var param = {
                    params: vc.component.accountWithdrawalApplyListManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/accountWithdrawalApply/listStateWithdrawalApplys',
                    param,
                    function (json, res) {
                        var _accountWithdrawalApplyListManageInfo = JSON.parse(json);
                        vc.component.accountWithdrawalApplyListManageInfo.total = _accountWithdrawalApplyListManageInfo.total;
                        vc.component.accountWithdrawalApplyListManageInfo.records = _accountWithdrawalApplyListManageInfo.records;
                        vc.component.accountWithdrawalApplyListManageInfo.accountWithdrawalApplyLists = _accountWithdrawalApplyListManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountWithdrawalApplyListManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAccountWithdrawalApplyModal: function () {
                vc.emit('addAccountWithdrawalApply', 'openAddAccountWithdrawalApplyModal', {});
            },
            _openEditAccountWithdrawalApplyModel: function (_accountWithdrawalApply) {
                vc.emit('editAccountWithdrawalApply', 'openEditAccountWithdrawalApplyModal', _accountWithdrawalApply);
            },
            _openDeleteAccountWithdrawalApplyModel: function (_accountWithdrawalApply) {
                vc.emit('deleteAccountWithdrawalApply', 'openDeleteAccountWithdrawalApplyModal', _accountWithdrawalApply);
            },
            _queryAccountWithdrawalApplyMethod: function () {
                vc.component._listAccountWithdrawalApplyLists(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.accountWithdrawalApplyListManageInfo.moreCondition) {
                    vc.component.accountWithdrawalApplyListManageInfo.moreCondition = false;
                } else {
                    vc.component.accountWithdrawalApplyListManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
