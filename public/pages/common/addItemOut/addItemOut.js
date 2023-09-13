/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            addItemOutInfo: {
                resourceStores: [],
                resourceSuppliers: [],
                audit: {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
                description: '',
                endUserName: '',
                endUserTel: '',
                file: '',
                resOrderType: '20000',
                staffId: '',
                staffName: '',
                communityId: vc.getCurrentCommunity().communityId,
                shId: '',
                storehouses: [],
                flowId: '',
            }
        },
        _initMethod: function() {
            //10000 采购 20000出库
            let userInfo = vc.getData('/nav/getUserInfo');
            $that.addItemOutInfo.endUserName = userInfo.name;
            $that.addItemOutInfo.endUserTel = userInfo.tel;
            $that._loadResourceSuppliers();
            $that._listPurchaseStorehouses();
        },
        _initEvent: function() {
            vc.on('addItemOut', 'setSelectResourceStores', function(resourceStores) {
                let oldList = $that.addItemOutInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                        newItem.rsId = '';
                        newItem.timesId = '';
                        if(newItem.times && newItem.times.length >0){
                            newItem.timesId = newItem.times[0].timesId;
                        }
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
                $that.addItemOutInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _openSelectResourceStoreInfoModel() {
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: $that.addItemOutInfo.shId
                });
            },
            _finishStep: function() {
                let _resourceStores = $that.addItemOutInfo.resourceStores;

                if (!_resourceStores || _resourceStores.length < 0) {
                    vc.toast("未选择采购物品");
                    return;
                }
                let _validate = true;
                _resourceStores.forEach(item => {
                    let _selectedStock = item.selectedStock;
                    let _quantity = item.quantity;
                    if (parseInt(_quantity) > parseInt(_selectedStock)) {
                        _validate = false;
                    }
                });


                if (!_validate) {
                    vc.toast('库存不够');
                    return;
                }

                vc.http.apiPost(
                    '/collection/goodsCollection',
                    JSON.stringify($that.addItemOutInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadResourceSuppliers() {
                let param = {
                    params: { page: 1, row: 50 }
                };
                //发送get请求
                vc.http.apiGet('/resourceSupplier.listResourceSuppliers',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.addItemOutInfo.resourceSuppliers = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listPurchaseStorehouses: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        allowUse: 'ON'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.addItemOutInfo.storehouses = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function(resId) {
                $that.addItemOutInfo.resourceStores.forEach((item, index) => {
                        if (item.resId == resId) {
                            $that.addItemOutInfo.resourceStores.splice(index, 1);
                        }
                    })
                    // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore2', 'removeSelectResourceStoreItem', resId);
            },
            _changeTimesId: function(e, index) {
                let timeId = e.target.value;
                let times = $that.addItemOutInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        $that.addItemOutInfo.resourceStores[index].selectedStock = item.stock;
                    }
                });
                $that.$forceUpdate();
            },
            _getTimesStock: function(_resourceStore) {
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
            },
            _loadStaffOrg: function(_flowId) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryFirstAuditStaff',
                    param,
                    function(json, res) {
                        let _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data[0], $that.addItemOutInfo.audit);
                        if(!_data[0].assignee.startsWith('-')){
                            $that.addItemOutInfo.audit.staffId = $that.addItemOutInfo.audit.assignee;
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function() {
                vc.emit('selectStaff', 'openStaff', $that.addItemOutInfo.audit);
            },
            _computeFlow: function() {
                let _storehouses = $that.addItemOutInfo.storehouses;
                let _flowId = "";
                _storehouses.forEach(item => {
                    if ($that.addItemOutInfo.shId == item.shId) {
                        _flowId = item.useFlowId;
                    }
                });
                $that.addItemOutInfo.flowId = _flowId;
                if (!_flowId) {
                    return;
                }
                $that._loadStaffOrg(_flowId);
            }
        }
    });
})(window.vc);