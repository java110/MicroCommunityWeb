/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountWithdrawalApplyFkManageInfo: {
                accountWithdrawalApplyFks: [],
                accountBanks: [],
                total: 0,
                records: 1,
                moreCondition: false,
                applyId: '',
                acctId: '',
                conditions: {
                    state: ''


                }
            }
        },
        _initMethod: function () {
            vc.component._listAccountWithdrawalApplyFks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('accountWithdrawalApplyManage', 'listAccountWithdrawalApply', function (_param) {
                vc.component._listAccountWithdrawalApplyFks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccountWithdrawalApplyFks(_currentPage, DEFAULT_ROWS);
            });
            vc.on('accountWithdrawalApplyFkManage','accountWithdrawalApplyFkManageInfo',function(_accountWithdrawalApplyFk){
                vc.component._auditAccountWithdrawalApplyFkState(_accountWithdrawalApplyFk);
          });
        },
        methods: {
            _listAccountWithdrawalApplyFks: function (_page, _rows) {

                vc.component.accountWithdrawalApplyFkManageInfo.conditions.page = _page;
                vc.component.accountWithdrawalApplyFkManageInfo.conditions.row = _rows;
                vc.component.accountWithdrawalApplyFkManageInfo.conditions.state = '586';
                var param = {
                    params: vc.component.accountWithdrawalApplyFkManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/accountWithdrawalApply/listStateWithdrawalApplys',
                    param,
                    function (json, res) {
                        var _accountWithdrawalApplyFkManageInfo = JSON.parse(json);
                        vc.component.accountWithdrawalApplyFkManageInfo.total = _accountWithdrawalApplyFkManageInfo.total;
                        vc.component.accountWithdrawalApplyFkManageInfo.records = _accountWithdrawalApplyFkManageInfo.records;
                        vc.component.accountWithdrawalApplyFkManageInfo.accountWithdrawalApplyFks = _accountWithdrawalApplyFkManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountWithdrawalApplyFkManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAccountBanks: function (_bankId) {

                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        bankId: _bankId
                    }
                };

                //发送get请求
                vc.http.apiGet('/accountBank/queryAccountBank',
                    param,
                    function (json, res) {
                        var _accountBankManageInfo = JSON.parse(json);
                        vc.component.accountWithdrawalApplyFkManageInfo.total = _accountBankManageInfo.total;
                        vc.component.accountWithdrawalApplyFkManageInfo.records = _accountBankManageInfo.records;
                        vc.component.accountWithdrawalApplyFkManageInfo.accountBanks = _accountBankManageInfo.data;
                       
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
                vc.component._listAccountWithdrawalApplyFks(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openAccountPaykModal:function(_accountWithdrawalApplyFks){
                vc.component.accountWithdrawalApplyFkManageInfo.applyId = _accountWithdrawalApplyFks.applyId;
                vc.component.accountWithdrawalApplyFkManageInfo.acctId = _accountWithdrawalApplyFks.acctId;

                $that._listAccountBanks(_accountWithdrawalApplyFks.bankId);
                var _accountBank = $that.accountWithdrawalApplyFkManageInfo.accountBanks;
                
                vc.emit('accountPay', 'accountPayModel',{_accountBank});
            },
            _auditAccountWithdrawalApplyFkState:function(_accountWithdrawalApplyFk){

                if(_accountWithdrawalApplyFk.state == '1100'){
                    _accountWithdrawalApplyFk.state='686';
                }else if(_accountWithdrawalApplyFk.state == '1200'){
                    _accountWithdrawalApplyFk.state='687';
                }
                _accountWithdrawalApplyFk.applyId = vc.component.accountWithdrawalApplyFkManageInfo.applyId;
                _accountWithdrawalApplyFk.acctId = vc.component.accountWithdrawalApplyFkManageInfo.acctId;
                _accountWithdrawalApplyFk.context = _accountWithdrawalApplyFk.remark;
                vc.http.apiPost(
                    '/accountWithdrawalApply/upAccountWithdrawalApply',
                    JSON.stringify(_accountWithdrawalApplyFk),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                             vc.component._listAccountWithdrawalApplyFks(DEFAULT_PAGE, DEFAULT_ROWS);
                            return ;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                });
            },
            _moreCondition: function () {
                if (vc.component.accountWithdrawalApplyFkManageInfo.moreCondition) {
                    vc.component.accountWithdrawalApplyFkManageInfo.moreCondition = false;
                } else {
                    vc.component.accountWithdrawalApplyFkManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
