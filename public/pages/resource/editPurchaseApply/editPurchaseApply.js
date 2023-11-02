/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            editPurchaseApplyInfo: {
                applyOrderId: '',
                resourceStores: [],
                resourceSuppliers: [],
                description: '',
                endUserName: '',
                endUserTel: '',
                file: '',
                resOrderType: '10000',
                staffId: '',
                staffName: '',
                communityId: vc.getCurrentCommunity().communityId,
                shId: '',
                storehouses: [],
                flowId: ''
            }
        },
        _initMethod: function () {
            $that.editPurchaseApplyInfo.applyOrderId = vc.getParam('applyOrderId');
            $that.editPurchaseApplyInfo.resOrderType = vc.getParam('resOrderType');
            $that._listPurchaseApply();
        },
        _initEvent: function () {
            vc.on('editPurchaseApply', 'setSelectResourceStores', function (resourceStores) {
                let oldList = $that.editPurchaseApplyInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    newItem.timesId = '';
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId && newItem.times && newItem.times.length < 2) {
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
                $that.editPurchaseApplyInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _listPurchaseApply: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyOrderId: $that.editPurchaseApplyInfo.applyOrderId,
                        resOrderType: $that.editPurchaseApplyInfo.resOrderType
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let _purchaseApplys = _json.purchaseApplys;
                        vc.copyObject(_purchaseApplys[0], $that.editPurchaseApplyInfo);
                        $that.editPurchaseApplyInfo.resourceStores = _purchaseApplys[0].purchaseApplyDetailVo;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _editApplyPurchaseSummit: function () {
                let _resourceStores = $that.editPurchaseApplyInfo.resourceStores;
                if (!_resourceStores || _resourceStores.length < 0) {
                    vc.toast("未选择采购物品");
                    return;
                }
                vc.http.apiPost(
                    '/purchaseApply.updatePurchaseApply',
                    JSON.stringify($that.editPurchaseApplyInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.goBack();
                            vc.toast("修改成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openSelectResourceStoreInfoModel() {
                let _shId = $that.editPurchaseApplyInfo.shId;
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: _shId
                });
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                $that.editPurchaseApplyInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        $that.editPurchaseApplyInfo.resourceStores.splice(index, 1);
                    }
                })
            },
            _changeTimesId: function (e, index) {
                let timeId = e.target.value;
                let times = $that.editPurchaseApplyInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        $that.editPurchaseApplyInfo.resourceStores[index].selectedStock = item.stock;
                    }
                })
            },
            _getTimesStock: function (_resourceStore) {
                if (!_resourceStore.timesId) {
                    return "-";
                }
                let _stock = 0;
                if (!_resourceStore.times) {
                    return _stock;
                }
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