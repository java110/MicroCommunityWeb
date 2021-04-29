(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseProduct: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseLabelProductInfo: {
                products: [],
                _currentProductName: '',
                labelCd: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseLabelProduct', 'openChooseProductModel', function (_param) {
                $('#chooseLabelProductModel').modal('show');
                vc.component._refreshChooseProductInfo();
                $that.chooseLabelProductInfo.labelCd = _param.labelCd;
                vc.component._loadAllProductInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllProductInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        labelCd: $that.chooseLabelProductInfo.labelCd,
                        hasProduct: 'N'
                    }
                };

                //发送get请求
                vc.http.apiGet('/product/queryProductLabel',
                    param,
                    function (json) {
                        var _productInfo = JSON.parse(json);
                        vc.component.chooseLabelProductInfo.products = _productInfo.data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseLabelProduct: function (_product) {
                if (_product.hasOwnProperty('name')) {
                    _product.productName = _product.name;
                }
                vc.emit($props.emitChooseProduct, 'chooseLabelProduct', _product);
                vc.emit($props.emitLoadData, 'listProductData', {
                    productId: _product.productId
                });
                $('#chooseLabelProductModel').modal('hide');
            },
            queryProducts: function () {
                vc.component._loadAllProductInfo(1, 10, vc.component.chooseLabelProductInfo._currentProductName);
            },
            _refreshChooseProductInfo: function () {
                vc.component.chooseLabelProductInfo._currentProductName = "";
                vc.component.chooseLabelProductInfo.labelCd = "";
            }
        }

    });
})(window.vc);
