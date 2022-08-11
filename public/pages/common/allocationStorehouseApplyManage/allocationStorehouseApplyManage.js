/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseManageInfo: {
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
                staffId: ''
            }
        },
        _initMethod: function () {
            $that._listAllocationStorehouse();
        },
        _initEvent: function () {
            vc.on('allocationStorehouseApply', 'chooseResourceStore_BACK', function (_param) {
                let _addFlag = true;
                $that.allocationStorehouseManageInfo.resourceStores.forEach(item => {
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
                $that.allocationStorehouseManageInfo.resourceStores.push(_param);
            })
            vc.on('allocationStorehouseApply', 'chooseResourceStore', function (resourceStores) {
                let oldList = vc.component.allocationStorehouseManageInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.shaName = newItem.shName;
                    newItem.shzId = '';
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
                vc.component.allocationStorehouseManageInfo.resourceStores = resourceStores;
                if (resourceStores.length > 0) {
                    $that._loadStaffOrg(resourceStores[0])
                }
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
            _openDeleteResourceStoreModel: function (_resourceStore) {
                let _tmpResourceStore = [];
                $that.allocationStorehouseManageInfo.resourceStores.forEach(item => {
                    if (item.resId != _resourceStore.resId) {
                        _tmpResourceStore.push(item);
                    }
                })
                $that.allocationStorehouseManageInfo.resourceStores = _tmpResourceStore;
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore', 'removeSelectResourceStoreItem', _resourceStore.resId);
            },
            _openAllocationStorehouseModel: function () {
                vc.emit('chooseResourceStore', 'openChooseResourceStoreModel', {
                    resOrderType: '20000'
                });
            },
            _listAllocationStorehouse: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        isShow: true,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        vc.component.allocationStorehouseManageInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _submitApply: function () {
                //校验数据
                if ($that.allocationStorehouseManageInfo.remark == '') {
                    vc.toast('申请说明不能为空');
                    return;
                }
                let _saveFlag = true;
                if ($that.allocationStorehouseManageInfo.resourceStores.length < 1) {
                    vc.toast('请选择物品');
                    return;
                }
                if (!vc.component._resourcesFromSameHouse($that.allocationStorehouseManageInfo.resourceStores)) {
                    vc.toast('调拨商品需来自同一仓库！');
                    return;
                }
                $that.allocationStorehouseManageInfo.resourceStores.forEach(item => {
                    item.curStock = parseInt(item.curStock);
                    if (item.curStock > parseInt(item.stock)) {
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
                    JSON.stringify($that.allocationStorehouseManageInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
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
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadStaffOrg: function (_resourceStore) {
                let flowType = '70007';
                if (_resourceStore.shType != "2806") {
                    flowType = '80008';
                }
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowType: flowType
                    }
                };
                //发送get请求
                vc.http.apiGet('/workflow/getFirstStaff',
                    param,
                    function (json, res) {
                        var _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data, $that.allocationStorehouseManageInfo);
                        $that.allocationStorehouseManageInfo.companyName = _data.parentOrgName;
                        $that.allocationStorehouseManageInfo.departmentName = _data.orgName;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.allocationStorehouseManageInfo);
            },
        }
    });
})(window.vc);