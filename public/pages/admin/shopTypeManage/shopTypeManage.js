/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            shopTypeManageInfo: {
                shopTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                typeName: '',
                conditions: {
                    typeName: '',
                    isShow: '',
                    isDefault: '',

                }
            }
        },
        _initMethod: function() {
            vc.component._listShopTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('shopTypeManage', 'listShopType', function(_param) {
                vc.component._listShopTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listShopTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listShopTypes: function(_page, _rows) {

                vc.component.shopTypeManageInfo.conditions.page = _page;
                vc.component.shopTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.shopTypeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/shopType/queryShopType',
                    param,
                    function(json, res) {
                        var _shopTypeManageInfo = JSON.parse(json);
                        vc.component.shopTypeManageInfo.total = _shopTypeManageInfo.total;
                        vc.component.shopTypeManageInfo.records = _shopTypeManageInfo.records;
                        vc.component.shopTypeManageInfo.shopTypes = _shopTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.shopTypeManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddShopTypeModal: function() {
                vc.emit('addShopType', 'openAddShopTypeModal', {});
            },
            _openEditShopTypeModel: function(_shopType) {
                vc.emit('editShopType', 'openEditShopTypeModal', _shopType);
            },
            _openDeleteShopTypeModel: function(_shopType) {
                vc.emit('deleteShopType', 'openDeleteShopTypeModal', _shopType);
            },
            _queryShopTypeMethod: function() {
                vc.component._listShopTypes(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.shopTypeManageInfo.moreCondition) {
                    vc.component.shopTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.shopTypeManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);