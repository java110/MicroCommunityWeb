/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accountBondObjDetailManageInfo: {
                accountBondObjDetails: [],
                shops:[],
                total: 0,
                records: 1,
                moreCondition: false,
                bobjId: '',
                conditions: {
                    state: '',
                    objId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listAccountBondObjsDetail(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listBondShops(1, 50);
        },
        _initEvent: function () {

            vc.on('accountBondObjManage', 'listAccountBondObj', function (_param) {
                vc.component._listAccountBondObjsDetail(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccountBondObjsDetail(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccountBondObjsDetail: function (_page, _rows) {

                vc.component.accountBondObjDetailManageInfo.conditions.page = _page;
                vc.component.accountBondObjDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.accountBondObjDetailManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/accountBondObjDetail/queryAccountBondObjDetail',
                    param,
                    function (json, res) {
                        var _accountBondObjDetailManageInfo = JSON.parse(json);
                        vc.component.accountBondObjDetailManageInfo.total = _accountBondObjDetailManageInfo.total;
                        vc.component.accountBondObjDetailManageInfo.records = _accountBondObjDetailManageInfo.records;
                        vc.component.accountBondObjDetailManageInfo.accountBondObjDetails = _accountBondObjDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accountBondObjDetailManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listBondShops:function(_page, _rows){
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                    }
                };

               //发送get请求
               vc.http.apiGet('/shop/queryShopsByAdmin',
                    param,
                    function(json,res){
                    var _shopManageInfo=JSON.parse(json);
                    vc.component.accountBondObjDetailManageInfo.total = _shopManageInfo.total;
                    vc.component.accountBondObjDetailManageInfo.records = _shopManageInfo.records;
                    vc.component.accountBondObjDetailManageInfo.shops = _shopManageInfo.data;
                    },function(errInfo,error){
                    console.log('请求失败处理');
                    }
                );
            },
            _openDeleteAccountBondObjModel: function (_accountBondObj) {
                vc.emit('deleteAccountBondObj', 'openDeleteAccountBondObjModal', _accountBondObj);
            },
            _queryAccountBondObjDetailMethod: function () {
                vc.component._listAccountBondObjsDetail(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.accountBondObjDetailManageInfo.moreCondition) {
                    vc.component.accountBondObjDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.accountBondObjDetailManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
