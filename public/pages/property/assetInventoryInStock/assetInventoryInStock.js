/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryInStockInfo: {
                aiId: '',
                shId: '',
                shName: '',
                name: '',
                staffName: '',
                invTime: '',
                storehouses: [],
                remark: '',
                stateName: '',
                opinion: '',
                auditId: '',
                auditName: '',
                auditTel: '',
                auditTime: '',
                state: '',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            $that.assetInventoryInStockInfo.aiId = vc.getParam('aiId');
            $that._queryAssetInventory();
            $that.queryAssetInventoryProduct();
        },
        _initEvent: function () {
        },
        methods: {
            _openChooseProductModal: function () {
                if (!$that.assetInventoryInStockInfo.shId) {
                    vc.toast('请先选择仓库');
                    return;
                }
                vc.emit('chooseProductAndSpec', 'openChooseProductModel', {
                    shId: $that.assetInventoryInStockInfo.shId
                });
            },
            _goBack: function () {
                vc.goBack();
            },
            _queryAssetInventory: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        aiId: $that.assetInventoryInStockInfo.aiId,
                    }
                };
                //发送get请求
                vc.http.apiGet('assetInventory.listAssetInventory',
                    param,
                    function (json, res) {
                        var _assetInventoryManageInfo = JSON.parse(json);
                        vc.copyObject(_assetInventoryManageInfo.data[0], $that.assetInventoryInStockInfo)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            queryAssetInventoryProduct: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        applyOrderId: $that.assetInventoryInStockInfo.aiId
                    }
                };
                //发送get请求
                vc.http.apiGet('assetInventoryDetail.listAssetInventoryWholeDetail',
                    param,
                    function (json, res) {
                        var _assetInventoryManageInfo = JSON.parse(json);
                        _assetInventoryManageInfo.data.forEach(item => {
                            $that._computeData(item);
                        })
                        $that.assetInventoryInStockInfo.storehouses = _assetInventoryManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _caculTotalMount: function () {
                let j = 0;
                vc.component.assetInventoryInStockInfo.storehouses.forEach(item => {
                    if (!isNaN(item.count) && !isNaN(item.price)) {
                        j += parseFloat(item.count) * parseFloat(item.price).toFixed(2);
                    } else {
                        $that.assetInventoryInStockInfo.totalMount = "请输入正确的数字";
                        throw Error();
                    }
                });
                $that.assetInventoryInStockInfo.totalMount = j.toFixed(2);
            },
            _computeData: function (_inoutOrderProduct) {
                _inoutOrderProduct.invProfit = parseInt(_inoutOrderProduct.invQuantity) - parseInt(_inoutOrderProduct.quantity);
                if (_inoutOrderProduct.invProfit < 0) {
                    _inoutOrderProduct.invProfit = 0;
                }
                _inoutOrderProduct.invLoss = parseInt(_inoutOrderProduct.quantity) - parseInt(_inoutOrderProduct.invQuantity);
                if (_inoutOrderProduct.invLoss < 0) {
                    _inoutOrderProduct.invLoss = 0;
                }
                _inoutOrderProduct.invProfitMoney = _inoutOrderProduct.invProfit * parseFloat(_inoutOrderProduct.price);
                _inoutOrderProduct.invLossMoney = _inoutOrderProduct.invLoss * parseFloat(_inoutOrderProduct.price);
                $that.$forceUpdate();
            }
        }
    });
})(window.vc);
