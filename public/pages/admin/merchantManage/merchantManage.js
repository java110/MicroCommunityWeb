/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            merchantManageInfo: {
                propertyCompanys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                storeId: '',
                conditions: {
                    storeId: '',
                    name: '',
                    tel: '',
                    storeTypeCd: '800900000005'
                }
            }
        },
        _initMethod: function() {
            vc.component._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('merchantManage', 'listMerchant', function(_param) {
                vc.component._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMerchants(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMerchants: function(_page, _rows) {

                vc.component.merchantManageInfo.conditions.page = _page;
                vc.component.merchantManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.merchantManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/store.listStores',
                    param,
                    function(json, res) {
                        var _merchantManageInfo = JSON.parse(json);
                        vc.component.merchantManageInfo.total = _merchantManageInfo.total;
                        vc.component.merchantManageInfo.records = _merchantManageInfo.records;
                        vc.component.merchantManageInfo.propertyCompanys = _merchantManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.merchantManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMerchantModal: function() {
                vc.emit('addMerchant', 'openAddMerchantModal', {});
            },
            _openEditMerchantModel: function(_propertyCompany) {
                vc.emit('editMerchant', 'openEditMerchantModal', _propertyCompany);
            },
            _openDeleteMerchantModel: function(_propertyCompany) {
                vc.emit('deleteMerchant', 'openDeleteMerchantModal', _propertyCompany);
            },
            _queryMerchantMethod: function() {
                vc.component._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.merchantManageInfo.moreCondition) {
                    vc.component.merchantManageInfo.moreCondition = false;
                } else {
                    vc.component.merchantManageInfo.moreCondition = true;
                }
            },
            // _openManageCommunity: function(_propertyCompany) {
            //     vc.jumpToPage('/#/pages/common/propertyCommunity?storeId=' + _propertyCompany.storeId);
            // }

        }
    });
})(window.vc);