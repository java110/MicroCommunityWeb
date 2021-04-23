(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseProductSpec: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseProductSpecInfo: {
                productSpecs: [],
                _currentProductSpecName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseProductSpec', 'openChooseProductSpecModel', function (_param) {
                $('#chooseProductSpecModel').modal('show');
                vc.component._refreshChooseProductSpecInfo();
                vc.component._loadAllProductSpecInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllProductSpecInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('/product/queryProductSpec',
                    param,
                    function (json) {
                        var _productSpecInfo = JSON.parse(json);
                        let _data = _productSpecInfo.data;

                        _data.forEach(item => {
                            if(!item.hasOwnProperty('productSpecDetails')){
                                return ;
                            }

                            let _productSpecDetails = item.productSpecDetails;

                            let _specValue = "";

                            _productSpecDetails.forEach(detailItem =>{
                                _specValue += ( detailItem.detailValue +"/");
                            });

                            item.specValue = _specValue;
                        });
                        vc.component.chooseProductSpecInfo.productSpecs = _data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseProductSpec: function (_productSpec) {
                if (_productSpec.hasOwnProperty('name')) {
                    _productSpec.productSpecName = _productSpec.name;
                }
                vc.emit($props.emitChooseProductSpec, 'chooseProductSpec', _productSpec);
                vc.emit('editProduct', 'chooseProductSpec', _productSpec);
                vc.emit($props.emitLoadData, 'listProductSpecData', {
                    productSpecId: _productSpec.productSpecId
                });
                $('#chooseProductSpecModel').modal('hide');
            },
            queryProductSpecs: function () {
                vc.component._loadAllProductSpecInfo(1, 10, vc.component.chooseProductSpecInfo._currentProductSpecName);
            },
            _refreshChooseProductSpecInfo: function () {
                vc.component.chooseProductSpecInfo._currentProductSpecName = "";
            }
        }

    });
})(window.vc);
