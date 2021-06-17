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
                        vc.component.accountWithdrawalApplyFkManageInfo.accountWithdrawalApplys = _accountWithdrawalApplyFkManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountWithdrawalApplyFkManageInfo.records,
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
                vc.component._listAccountWithdrawalApplyFks(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openAuditAccountWithdrawalApplyFkModal:function(_accountWithdrawalApplyFks){
                vc.component.accountWithdrawalApplyFkManageInfo.applyId = _accountWithdrawalApplyFks.applyId;
                vc.emit('accountPay', 'accountPayModel',{});
            },
            _auditAccountWithdrawalApplyFkState:function(_accountWithdrawalApplyFk){

                if(_accountWithdrawalApplyFk.state == '1100'){
                    _accountWithdrawalApplyFk.state='686';
                }else if(_accountWithdrawalApplyFk.state == '1200'){
                    _accountWithdrawalApplyFk.state='687';
                }
                _accountWithdrawalApplyFk.applyId = vc.component.accountWithdrawalApplyFkManageInfo.applyId;
                _accountWithdrawalApplyFk.context = _accountWithdrawalApply.remark;
                vc.http.post(
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
