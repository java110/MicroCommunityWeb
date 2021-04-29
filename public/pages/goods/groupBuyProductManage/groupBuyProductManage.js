/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            groupBuyProductManageInfo: {
                products: [],
                total: 0,
                records: 1,
                moreCondition: false,
                productId: '',
                componentShow:'groupBuyProductManage',
                conditions: {
                    prodName: '',
                    keyword: '',
                    barCode: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('groupBuyProductManage', 'listProduct', function (_param) {
                $that.groupBuyProductManageInfo.componentShow = 'groupBuyProductManage';
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProducts: function (_page, _rows) {

                vc.component.groupBuyProductManageInfo.conditions.page = _page;
                vc.component.groupBuyProductManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.groupBuyProductManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/groupBuy/queryGroupBuyProduct',
                    param,
                    function (json, res) {
                        var _groupBuyProductManageInfo = JSON.parse(json);
                        vc.component.groupBuyProductManageInfo.total = _groupBuyProductManageInfo.total;
                        vc.component.groupBuyProductManageInfo.records = _groupBuyProductManageInfo.records;
                        vc.component.groupBuyProductManageInfo.products = _groupBuyProductManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.groupBuyProductManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddProductModal: function () {
                //vc.emit('addProduct', 'openAddProductModal', {});
                $that.groupBuyProductManageInfo.componentShow = 'addGroupBuyProduct';
            },
            _openEditProductModel: function (_product) {
                $that.groupBuyProductManageInfo.componentShow = 'editGroupBuyProduct';
                vc.emit('editGroupBuyProduct', 'openEditProductModal', _product);
            },
            _openDeleteProductModel: function (_product) {
                vc.emit('deleteGroupBuyProduct','openDeleteGroupBuyProductModal', _product);
            },
            _queryProductMethod: function () {
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.groupBuyProductManageInfo.moreCondition) {
                    vc.component.groupBuyProductManageInfo.moreCondition = false;
                } else {
                    vc.component.groupBuyProductManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
