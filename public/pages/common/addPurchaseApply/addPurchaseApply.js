/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addPurchaseApplyInfo: {
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
            let userInfo = vc.getData('/nav/getUserInfo');
            $that.addPurchaseApplyInfo.endUserName = userInfo.name;
            $that.addPurchaseApplyInfo.endUserTel = userInfo.tel;
            $that._loadResourceSuppliers();
            $that._listPurchaseStorehouses();
        },
        _initEvent: function () {
            vc.on('addPurchaseApply', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, $that.addPurchaseApplyInfo);
            });
            vc.on('addPurchaseApply', 'setSelectResourceStores', function (resourceStores) {
                let oldList = $that.addPurchaseApplyInfo.resourceStores;
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
                $that.addPurchaseApplyInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _applyPurchaseSummit: function () {
                let _resourceStores = $that.addPurchaseApplyInfo.resourceStores;
                if (!_resourceStores || _resourceStores.length < 1) {
                    vc.toast("未选择采购物品！");
                    return;
                }
                let isFlag = true;
                let _quantity = true;
                $that.addPurchaseApplyInfo.resourceStores.forEach(item => {
                    if (item.timesId == null || item.timesId == '' || item.timesId == undefined) {
                        isFlag = false;
                    }
                    if (item.quantity == null || item.quantity == '' || item.quantity == undefined) {
                        _quantity = false;
                    }
                });
                if (!isFlag) {
                    vc.toast("请选择价格！");
                    return;
                }
                if (!_quantity) {
                    vc.toast("请填写申请数量！");
                    return;
                }
                _resourceStores.times
                vc.http.apiPost(
                    '/purchase/purchaseApply',
                    JSON.stringify($that.addPurchaseApplyInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
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
            _loadResourceSuppliers() {
                let param = {
                    params: {page: 1, row: 50}
                };
                //发送get请求
                vc.http.apiGet('/resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        let _resourceSupplierManageInfo = JSON.parse(json);
                        $that.addPurchaseApplyInfo.resourceSuppliers = _resourceSupplierManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openSelectResourceStoreInfoModel() {
                let _shId = $that.addPurchaseApplyInfo.shId;
                let endUserName = $that.addPurchaseApplyInfo.endUserName;
                let endUserTel = $that.addPurchaseApplyInfo.endUserTel;
                let description = $that.addPurchaseApplyInfo.description;
                if (!_shId) {
                    vc.toast('请选择仓库！');
                    return;
                }
                if (!endUserName) {
                    vc.toast('选择联系人！');
                    return;
                }
                if (!endUserTel) {
                    vc.toast('选择联系电话！');
                    return;
                }
                if (!description) {
                    vc.toast('选择申请说明！');
                    return;
                }
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: _shId
                });
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                $that.addPurchaseApplyInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        $that.addPurchaseApplyInfo.resourceStores.splice(index, 1);
                    }
                })
            },
            _changeTimesId: function (e, index) {
                let timeId = e.target.value;
                let times = $that.addPurchaseApplyInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        $that.addPurchaseApplyInfo.resourceStores[index].selectedStock = item.stock;
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
            },
            _loadStaffOrg: function (_flowId) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryFirstAuditStaff',
                    param,
                    function (json, res) {
                        var _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data[0], $that.addPurchaseApplyInfo.audit);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.addPurchaseApplyInfo.audit);
            },
            _listPurchaseStorehouses: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        allowPurchase: 'ON'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addPurchaseApplyInfo.storehouses = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeFlow: function () {
                let _storehouses = $that.addPurchaseApplyInfo.storehouses;
                let _flowId = "";
                _storehouses.forEach(item => {
                    if ($that.addPurchaseApplyInfo.shId == item.shId) {
                        _flowId = item.purchaseFlowId;
                    }
                });
                $that.addPurchaseApplyInfo.flowId = _flowId;
                if (!_flowId) {
                    return;
                }
                $that._loadStaffOrg(_flowId);
            }
        }
    });
})(window.vc);