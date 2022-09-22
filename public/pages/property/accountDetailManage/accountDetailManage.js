/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountDetailManageInfo: {
                accountDetails: [],
                shopAccounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                scId: '',
                conditions: {
                    acctId: '',
                    detailType: '',
                    orderId: '',
                }
            }
        },
        _initMethod: function() {
            $that.accountDetailManageInfo.conditions.acctId = vc.getParam('acctId');
            vc.component._listAccountDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('accountDetailManage', 'listAccountDetail', function(_param) {
                vc.component._listAccountDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAccountDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccountDetails: function(_page, _rows) {

                vc.component.accountDetailManageInfo.conditions.page = _page;
                vc.component.accountDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.accountDetailManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/account/queryOwnerAccountDetail',
                    param,
                    function(json, res) {
                        var _accountDetailManageInfo = JSON.parse(json);
                        vc.component.accountDetailManageInfo.total = _accountDetailManageInfo.total;
                        vc.component.accountDetailManageInfo.records = _accountDetailManageInfo.records;
                        vc.component.accountDetailManageInfo.accountDetails = _accountDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountDetailManageInfo.records,
                            dataCount: vc.component.accountDetailManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryAccountDetailMethod: function() {
                vc.component._listAccountDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.accountDetailManageInfo.moreCondition) {
                    vc.component.accountDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.accountDetailManageInfo.moreCondition = true;
                }
            },
            _goBack: function() {
                vc.goBack();
            }


        }
    });
})(window.vc);