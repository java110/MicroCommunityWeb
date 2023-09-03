/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseApplyInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                storehouses: [],
                remark: '',
                communityId: vc.getCurrentCommunity().communityId,
                apply_type: 10000,
                staffName: '',
                staffId: '',
                shId: '',
                flowId: '',
                audit: {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
            }
        },
        _initMethod: function() {
            $that._listAllocationStorehouse();
        },
        _initEvent: function() {
            vc.on('allocationStorehouseApply', 'chooseResourceStore_BACK', function(_param) {
                let _addFlag = true;
                $that.allocationStorehouseApplyInfo.resourceStores.forEach(item => {
                    if (item.resId == _param.resId) {
                        vc.toast('物品已经选择，请确认');
                        _addFlag = false;
                        return;
                    }
                });
                if (!_addFlag) {
                    return;
                }
                _param.shaName = _param.shName;
                _param.shzId = '';
                _param.curStock = '0';
                $that.allocationStorehouseApplyInfo.resourceStores.push(_param);
            })
            vc.on('allocationStorehouseApply', 'chooseResourceStore', function(resourceStores) {
                let oldList = $that.allocationStorehouseApplyInfo.resourceStores;
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
                $that.allocationStorehouseApplyInfo.resourceStores = resourceStores;

            })
        },
        methods: {
            // 验证物品来自同一仓库
            _resourcesFromSameHouse(resourcesList) {
                if (!resourcesList || resourcesList.length < 2) {
                    return true;
                }
                let lastHouse = '';
                let sign = true;
                for (let i = 0; i < resourcesList.length; i++) {
                    if (lastHouse == '') {
                        lastHouse = resourcesList[i].shId;
                        continue;
                    }
                    if (lastHouse == resourcesList[i].shId) {
                        continue;
                    } else {
                        sign = false;
                        break;
                    }
                }
                return sign;
            },
            //取消调拨
            _openDeleteResourceStoreModel: function(_resourceStore) {
                let _tmpResourceStore = [];
                $that.allocationStorehouseApplyInfo.resourceStores.forEach(item => {
                    if (item.resId != _resourceStore.resId) {
                        _tmpResourceStore.push(item);
                    }
                })
                $that.allocationStorehouseApplyInfo.resourceStores = _tmpResourceStore;
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore', 'removeSelectResourceStoreItem', _resourceStore.resId);
            },
            _openAllocationStorehouseModel: function() {
                vc.emit('chooseResourceStore', 'openChooseResourceStoreModel', {
                    resOrderType: '20000',
                    shId: $that.allocationStorehouseApplyInfo.shId
                });
            },
            _listAllocationStorehouse: function(_page, _rows) {
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
                        $that.allocationStorehouseApplyInfo.storehouses = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function() {
                vc.goBack();
            },
            _submitApply: function() {
                let _resourceStores = $that.allocationStorehouseApplyInfo.resourceStores;
                //校验数据
                if ($that.allocationStorehouseApplyInfo.remark == '') {
                    vc.toast('申请说明不能为空');
                    return;
                }
                let _saveFlag = true;
                if (_resourceStores.length < 1) {
                    vc.toast('请选择物品');
                    return;
                }
                if (!$that._resourcesFromSameHouse(_resourceStores)) {
                    vc.toast('调拨商品需来自同一仓库！');
                    return;
                }
                _resourceStores.forEach(item => {
                    if (!item.timesId) {
                        vc.toast(item.resName + "未选择参考价格");
                        _saveFlag = false;
                        return;
                    }
                    item.curStock = parseInt(item.curStock);
                    if (item.curStock > parseInt(item.selectedStock)) {
                        vc.toast(item.resName + "库存不足");
                        _saveFlag = false;
                        return;
                    }
                    if (!item.shzId) {
                        vc.toast("请选择目标库存");
                        _saveFlag = false;
                        return;
                    }
                    if (item.curStock < 1) {
                        vc.toast("请填写调拨数量");
                        _saveFlag = false;
                        return;
                    }
                });
                if (!_saveFlag) {
                    return;
                }
                vc.http.apiPost(
                    '/resourceStore.saveAllocationStorehouse',
                    JSON.stringify($that.allocationStorehouseApplyInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            vc.toast("申请调拨成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            chooseStaff: function() {
                vc.emit('selectStaff', 'openStaff', $that.allocationStorehouseApplyInfo.audit);
            },
            _changeTimesId: function(e, index) {
                let timeId = e.target.value;
                let times = $that.allocationStorehouseApplyInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        $that.allocationStorehouseApplyInfo.resourceStores[index].selectedStock = item.stock;
                    }
                })
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
            _computeFlow: function() {
                let _storehouses = $that.allocationStorehouseApplyInfo.storehouses;
                let _flowId = "";
                _storehouses.forEach(item => {
                    if ($that.allocationStorehouseApplyInfo.shId == item.shId) {
                        _flowId = item.allocationFlowId;
                    }
                });
                $that.allocationStorehouseApplyInfo.flowId = _flowId;
                if (!_flowId) {
                    return;
                }
                $that._loadStaffOrg(_flowId);
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
                        vc.copyObject(_data[0], $that.allocationStorehouseApplyInfo.audit);
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);