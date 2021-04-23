/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            productSpecManageInfo: {
                productSpecs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                specId: '',
                conditions: {
                    specName: '',
                    specId: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listProductSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('productSpecManage', 'listProductSpec', function (_param) {
                vc.component._listProductSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProductSpecs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProductSpecs: function (_page, _rows) {

                vc.component.productSpecManageInfo.conditions.page = _page;
                vc.component.productSpecManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.productSpecManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/product/queryProductSpec',
                    param,
                    function (json, res) {
                        var _productSpecManageInfo = JSON.parse(json);
                        vc.component.productSpecManageInfo.total = _productSpecManageInfo.total;
                        vc.component.productSpecManageInfo.records = _productSpecManageInfo.records;
                        let _data = _productSpecManageInfo.data;

                        _data.forEach(item => {
                            if(!item.hasOwnProperty('productSpecDetails')){
                                return ;
                            }

                            let _productSpecDetails = item.productSpecDetails;

                            let _specValue = "";

                            _productSpecDetails.forEach(detailItem =>{
                                _specValue += (detailItem.detailName + ':' + detailItem.detailValue +"<br/>");
                            });

                            item.specValue = _specValue;
                        });


                        vc.component.productSpecManageInfo.productSpecs = _data;

                        vc.emit('pagination', 'init', {
                            total: vc.component.productSpecManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddProductSpecModal: function () {
                vc.emit('addProductSpec', 'openAddProductSpecModal', {});
            },
            _openEditProductSpecModel: function (_productSpec) {
                vc.emit('editProductSpec', 'openEditProductSpecModal', _productSpec);
            },
            _openDeleteProductSpecModel: function (_productSpec) {
                vc.emit('deleteProductSpec', 'openDeleteProductSpecModal', _productSpec);
            },
            _queryProductSpecMethod: function () {
                vc.component._listProductSpecs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.productSpecManageInfo.moreCondition) {
                    vc.component.productSpecManageInfo.moreCondition = false;
                } else {
                    vc.component.productSpecManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
