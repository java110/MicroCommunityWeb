/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountBondObjManageInfo: {
                accountBondObjs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                bobjId: '',
                conditions: {

                }
            }
        },
        _initMethod: function () {
            vc.component._listAccountBondObjs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('accountBondObjManage', 'listAccountBondObj', function (_param) {
                vc.component._listAccountBondObjs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccountBondObjs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccountBondObjs: function (_page, _rows) {

                vc.component.accountBondObjManageInfo.conditions.page = _page;
                vc.component.accountBondObjManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.accountBondObjManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/accountBondObj/queryAccountBondObj',
                    param,
                    function (json, res) {
                        var _accountBondObjManageInfo = JSON.parse(json);
                        vc.component.accountBondObjManageInfo.total = _accountBondObjManageInfo.total;
                        vc.component.accountBondObjManageInfo.records = _accountBondObjManageInfo.records;
                        vc.component.accountBondObjManageInfo.accountBondObjs = _accountBondObjManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountBondObjManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAccountBondObjModal: function () {
                vc.emit('addAccountBondObj', 'openAddAccountBondObjModal', {});
            },
            _openEditAccountBondObjModel: function (_accountBondObj) {
                vc.emit('editAccountBondObj', 'openEditAccountBondObjModal', _accountBondObj);
            },
            _openDeleteAccountBondObjModel: function (_accountBondObj) {
                vc.emit('deleteAccountBondObj', 'openDeleteAccountBondObjModal', _accountBondObj);
            },
            _queryAccountBondObjMethod: function () {
                vc.component._listAccountBondObjs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.accountBondObjManageInfo.moreCondition) {
                    vc.component.accountBondObjManageInfo.moreCondition = false;
                } else {
                    vc.component.accountBondObjManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
