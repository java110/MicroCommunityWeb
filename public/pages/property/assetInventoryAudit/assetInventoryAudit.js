/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryAuditInfo: {
                aiId: '',
                shId: '',
                shName: '',
                name: '',
                staffName: '',
                invTime: '',
                shopHouses: [],
                resourceStores: [],
                state: '2000',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            $that.assetInventoryAuditInfo.aiId = vc.getParam('aiId');
            $that._queryAssetInventory();
            $that.queryAssetInventoryProduct();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo2', 'setSelectResourceStores', function (resourceStores) {
                let oldList = vc.component.assetInventoryAuditInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId) {
                            delete resourceStores[newIndex];
                        }
                    })
                })
                // 合并已有商品和新添加商品
                resourceStores.push.apply(resourceStores, oldList);
                // 过滤空元素
                resourceStores = resourceStores.filter((s) => {
                    return s.hasOwnProperty('resId');
                });
                vc.component.assetInventoryAuditInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _doAssetInventory: function (state) {
                vc.component.assetInventoryAuditInfo.state = state;
                vc.http.apiPost(
                    'assetInventory.updateAssetInventory',
                    // JSON.stringify({ 
                    //     aiId: vc.component..aiId,
                    //     shId: vc.component.assetInventoryAuditInfo.shId,
                    //     state: state,
                    //     opinion:vc.component.assetInventoryAuditInfo.opinion,
                    //     communityId:vc.getCurrentCommunity().communityId
                    // })
                    JSON.stringify(vc.component.assetInventoryAuditInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
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
                        aiId: $that.assetInventoryAuditInfo.aiId,
                        shopId: vc.getCurrentCommunity().shopId
                    }
                };
                //发送get请求
                vc.http.apiGet('assetInventory.listAssetInventory',
                    param,
                    function (json, res) {
                        var _assetInventoryManageInfo = JSON.parse(json);
                        vc.copyObject(_assetInventoryManageInfo.data[0], $that.assetInventoryAuditInfo)
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
                        applyOrderId: $that.assetInventoryAuditInfo.aiId
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
                        $that.assetInventoryAuditInfo.resourceStores = _assetInventoryManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _caculTotalMount: function () {
                let j = 0;
                vc.component.assetInventoryAuditInfo.resourceStores.forEach(item => {
                    if (!isNaN(item.count) && !isNaN(item.price)) {
                        j += parseFloat(item.count) * parseFloat(item.price).toFixed(2);
                    } else {
                        $that.assetInventoryAuditInfo.totalMount = "请输入正确的数字";
                        throw Error();
                    }
                });
                $that.assetInventoryAuditInfo.totalMount = j.toFixed(2);
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
