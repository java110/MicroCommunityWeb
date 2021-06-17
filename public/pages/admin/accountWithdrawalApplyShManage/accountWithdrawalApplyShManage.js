/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountWithdrawalApplyShManageInfo: {
                accountWithdrawalApplyShs: [],
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
            vc.component._listAccountWithdrawalApplyShs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('accountWithdrawalApplyManage', 'listAccountWithdrawalApply', function (_param) {
                vc.component._listAccountWithdrawalApplyShs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccountWithdrawalApplyShs(_currentPage, DEFAULT_ROWS);
            });
            vc.on('accountWithdrawalApplyShManage','accountWithdrawalApplyShManageInfo',function(_accountWithdrawalApplySh){
                vc.component._auditAccountWithdrawalApplyShState(_accountWithdrawalApplySh);
          });
        },
        methods: {
            _listAccountWithdrawalApplyShs: function (_page, _rows) {

                vc.component.accountWithdrawalApplyShManageInfo.conditions.page = _page;
                vc.component.accountWithdrawalApplyShManageInfo.conditions.row = _rows;
                vc.component.accountWithdrawalApplyShManageInfo.conditions.state = '486';
                var param = {
                    params: vc.component.accountWithdrawalApplyShManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/accountWithdrawalApply/listStateWithdrawalApplys',
                    param,
                    function (json, res) {
                        var _accountWithdrawalApplyShManageInfo = JSON.parse(json);
                        vc.component.accountWithdrawalApplyShManageInfo.total = _accountWithdrawalApplyShManageInfo.total;
                        vc.component.accountWithdrawalApplyShManageInfo.records = _accountWithdrawalApplyShManageInfo.records;
                        vc.component.accountWithdrawalApplyShManageInfo.accountWithdrawalApplyShs = _accountWithdrawalApplyShManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountWithdrawalApplyShManageInfo.records,
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
                vc.component._listAccountWithdrawalApplyShs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openAuditAccountWithdrawalApplyModal:function(_accountWithdrawalApply){
                vc.component.accountWithdrawalApplyShManageInfo.applyId = _accountWithdrawalApply.applyId;
                vc.emit('audit','openAuditModal',{});
            },
            _auditAccountWithdrawalApplyShState:function(_accountWithdrawalApplySh){

                if(_accountWithdrawalApplySh.state == '1100'){
                    _accountWithdrawalApplySh.state='586';
                }else if(_accountWithdrawalApplySh.state == '1200'){
                    _accountWithdrawalApplySh.state='587';
                }
                _accountWithdrawalApplySh.applyId = vc.component.accountWithdrawalApplyShManageInfo.applyId;
                _accountWithdrawalApplySh.context = _accountWithdrawalApplySh.remark;
                vc.http.apiPost(
                    '/accountWithdrawalApply/upAccountWithdrawalApply',
                    JSON.stringify(_accountWithdrawalApplySh),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                             vc.component._listAccountWithdrawalApplyShs(DEFAULT_PAGE, DEFAULT_ROWS);
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
                if (vc.component.accountWithdrawalApplyShManageInfo.moreCondition) {
                    vc.component.accountWithdrawalApplyShManageInfo.moreCondition = false;
                } else {
                    vc.component.accountWithdrawalApplyShManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
