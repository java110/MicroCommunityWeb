/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountBondManageInfo: {
                accountBonds: [],
                total: 0,
                records: 1,
                moreCondition: false,
                bondId: '',
                conditions: {
                    bondName: '',
                    objId: '',

                },
                shopTypes : []
            }
        },
        _initMethod: function () {
            vc.component._listAccountBonds(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listAddShopTypes();
        },
        _initEvent: function () {

            vc.on('accountBondManage', 'listAccountBond', function (_param) {
                vc.component._listAccountBonds(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccountBonds(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccountBonds: function (_page, _rows) {

                vc.component.accountBondManageInfo.conditions.page = _page;
                vc.component.accountBondManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.accountBondManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/accountBond/queryAccountBond',
                    param,
                    function (json, res) {
                        var _accountBondManageInfo = JSON.parse(json);
                        vc.component.accountBondManageInfo.total = _accountBondManageInfo.total;
                        vc.component.accountBondManageInfo.records = _accountBondManageInfo.records;
                        vc.component.accountBondManageInfo.accountBonds = _accountBondManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountBondManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAccountBondModal: function () {
                vc.emit('addAccountBond', 'openAddAccountBondModal', {});
            },
            _openEditAccountBondModel: function (_accountBond) {
                vc.emit('editAccountBond', 'openEditAccountBondModal', _accountBond);
            },
            _openDeleteAccountBondModel: function (_accountBond) {
                vc.emit('deleteAccountBond', 'openDeleteAccountBondModal', _accountBond);
            },
            _queryAccountBondMethod: function () {
                vc.component._listAccountBonds(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.accountBondManageInfo.moreCondition) {
                    vc.component.accountBondManageInfo.moreCondition = false;
                } else {
                    vc.component.accountBondManageInfo.moreCondition = true;
                }
            },
            _listAddShopTypes:function(){
                var param = {
                 params: {
                     page: 1,
                     row: 100
                 }
             };
                //发送get请求
                vc.http.apiGet('/shopType/queryShopType',
                              param,
                              function(json,res){
                                 var _shopTypeManageInfo=JSON.parse(json);
                                 vc.component.accountBondManageInfo.shopTypes = _shopTypeManageInfo.data;
                              },function(errInfo,error){
                                 console.log('请求失败处理');
                              }
                            );
             },
            


        }
    });
})(window.vc);
