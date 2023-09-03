/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryEditInfo: {
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
            $that.assetInventoryEditInfo.aiId = vc.getParam('aiId');
            $that._queryAssetInventory();
            $that.queryAssetInventoryProduct();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo2', 'setSelectResourceStores', function (resourceStores) {
                let oldList = vc.component.assetInventoryEditInfo.resourceStores;
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
                vc.component.assetInventoryEditInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _doAssetInventory: function () {
                let _inoutOrderProducts = $that.assetInventoryEditInfo.resourceStores;
                vc.component.assetInventoryEditInfo.state = "2000";
                if (_inoutOrderProducts.length < 1) {
                    vc.toast('请选择商品');
                    return;
                }
                for (var i = 0; i < _inoutOrderProducts.length; i++) {
                    if (!_inoutOrderProducts[i].hasOwnProperty("quantity") || !_inoutOrderProducts[i].quantity || parseInt(_inoutOrderProducts[i].quantity) <= 0) {
                        vc.toast("请填写数量");
                        return;
                    }
                    if(!_inoutOrderProducts[i].timesId){
                        vc.toast(_inoutOrderProducts[i].resName + ",未选择价格");
                        return;
                    }
                    // _inoutOrderProducts[i].quantity = parseInt(_inoutOrderProducts[i].quantity);
                    // if (vc.component.assetInventoryInInfo.resOrderType == "20000") {
                    //     if (_inoutOrderProducts[i].quantity > _inoutOrderProducts[i].selectedStock) {
                    //         vc.toast(_inoutOrderProducts[i].resName + ",库存不足");
                    //         return;
                    //     }
                    // }
                }
                vc.http.apiPost(
                    'assetInventory.updateAssetInventory',
                    JSON.stringify(vc.component.assetInventoryEditInfo),
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
            _openChooseProductModal: function () {
                if (!$that.assetInventoryEditInfo.shId) {
                    vc.toast('请先选择仓库');
                    return;
                }
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: $that.assetInventoryEditInfo.shId,
                    unEditFlag:true
                });
            },

            _goBack: function () {
                vc.goBack();
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
            vc.component.assetInventoryEditInfo.resourceStores.forEach((item, index) => {
                if (item.resId == resId) {
                    vc.component.assetInventoryEditInfo.resourceStores.splice(index, 1);
                }
            })
            // 同时移除子页面复选框选项
            vc.emit('chooseResourceStore2', 'removeSelectResourceStoreItem', resId);
        },
            _queryAssetInventory: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        aiId: $that.assetInventoryEditInfo.aiId,
                        shopId: vc.getCurrentCommunity().shopId
                    }
                };
                //发送get请求
                vc.http.apiGet('assetInventory.listAssetInventory',
                    param,
                    function (json, res) {
                        var _assetInventoryManageInfo = JSON.parse(json);
                        vc.copyObject(_assetInventoryManageInfo.data[0], $that.assetInventoryEditInfo)
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
                        applyOrderId: $that.assetInventoryEditInfo.aiId
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
                        $that.assetInventoryEditInfo.resourceStores = _assetInventoryManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _caculTotalMount: function () {
                let j = 0;
                vc.component.assetInventoryEditInfo.resourceStores.forEach(item => {
                    if (!isNaN(item.count) && !isNaN(item.price)) {
                        j += parseFloat(item.count) * parseFloat(item.price).toFixed(2);
                    } else {
                        $that.assetInventoryEditInfo.totalMount = "请输入正确的数字";
                        throw Error();
                    }
                });
                $that.assetInventoryEditInfo.totalMount = j.toFixed(2);
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
            },
            
            _changeTimesId: function (e, index) {
                let timeId = e.target.value;
                let times = vc.component.assetInventoryEditInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        vc.component.assetInventoryEditInfo.resourceStores[index].selectedStock = item.stock;
                    }
                })
            },
            _getTimesStock: function (_resourceStore) {
                if (!_resourceStore.timesId) {
                    return "-";
                }
                let _stock = 0;
                _resourceStore.times.forEach(_item => {
                    if (_item.timesId == _resourceStore.timesId) {
                        _stock = _item.stock;
                    }
                });
                if (!_resourceStore.quantity) {
                    _resourceStore.quantity = '';
                }
                return _stock;
            }
        }
    });
})(window.vc);
