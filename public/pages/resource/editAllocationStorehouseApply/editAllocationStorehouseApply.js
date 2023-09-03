/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            editAllocationStorehouseApplyInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                storehouses: [],
                remark: '',
                communityId: vc.getCurrentCommunity().communityId,
                apply_type: 10000,
                applyId: '',
                staffName: '',
                staffId: '',
                shId: '',
            }
        },
        _initMethod: function() {
            $that.editAllocationStorehouseApplyInfo.applyId = vc.getParam('applyId');
            $that._listAllocationStorehouseApply();
            $that._listAllocationStorehouses();
            $that._listStorehouse();
        },
        _initEvent: function() {
            vc.on('editAllocationStorehouseApply', 'chooseResourceStore', function(resourceStores) {
                let oldList = $that.editAllocationStorehouseApplyInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                        newItem.shaName = newItem.shName;
                        newItem.shzId = '';
                        newItem.timesId = '';
                        newItem.curStock = '0'
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
                $that.editAllocationStorehouseApplyInfo.resourceStores = resourceStores;

            })
        },
        methods: {
            _listAllocationStorehouseApply: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: $that.editAllocationStorehouseApplyInfo.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouseApplys',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        let _data = _json.data[0];

                        vc.copyObject(_data, $that.editAllocationStorehouseApplyInfo);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAllocationStorehouses: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        applyId: $that.editAllocationStorehouseApplyInfo.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        let _data = _json.data;
                        _data.forEach(item => {
                            item.shzId = item.shIdz;
                            item.shId = item.shIda;
                            $that.editAllocationStorehouseApplyInfo.shId = item.shIda;
                            item.curStock = item.stock;
                        })
                        $that.editAllocationStorehouseApplyInfo.resourceStores = _data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _editApplyPurchaseSummit: function() {
                let _resourceStores = $that.editAllocationStorehouseApplyInfo.resourceStores;

                if (!_resourceStores || _resourceStores.length < 0) {
                    vc.toast("未选择采购物品");
                    return;
                }
                vc.http.apiPost(
                    '/resourceStore.updateAllocationStorehouse',
                    JSON.stringify($that.editAllocationStorehouseApplyInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },

            _openDeleteResourceStoreModel: function(_resourceStore) {
                let _tmpResourceStore = [];
                $that.editAllocationStorehouseApplyInfo.resourceStores.forEach(item => {
                    if (item.resId != _resourceStore.resId) {
                        _tmpResourceStore.push(item);
                    }
                })
                $that.editAllocationStorehouseApplyInfo.resourceStores = _tmpResourceStore;
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore', 'removeSelectResourceStoreItem', _resourceStore.resId);
            },
            _openAllocationStorehouseModel: function() {
                vc.emit('chooseResourceStore', 'openChooseResourceStoreModel', {
                    resOrderType: '20000',
                    shId: $that.editAllocationStorehouseApplyInfo.shId
                });
            },
            _changeTimesId: function(e, index) {
                let timeId = e.target.value;
                let times = $that.editAllocationStorehouseApplyInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        $that.editAllocationStorehouseApplyInfo.resourceStores[index].selectedStock = item.stock;
                    }
                })
            },
            _getTimesStock: function(_resourceStore) {
                if (!_resourceStore.timesId) {
                    return "-";
                }
                let _stock = 0;
                if (!_resourceStore.times) {
                    return "-";
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
            },
            _listStorehouse: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.editAllocationStorehouseApplyInfo.storehouses = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },


        }
    });
})(window.vc);