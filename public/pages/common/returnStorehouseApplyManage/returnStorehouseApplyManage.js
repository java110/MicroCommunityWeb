/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            returnStorehouseManageInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                storehouses: [],
                remark: '',
                communityId: vc.getCurrentCommunity().communityId,
                apply_type: 20000
            }
        },
        _initMethod: function () {
            $that._listReturnStorehouse();
        },
        _initEvent: function () {
            vc.on('returnStorehouseApply', 'setSelectResourceStores', function (resourceStores) {
                let oldList = vc.component.returnStorehouseManageInfo.resourceStores;
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
                vc.component.returnStorehouseManageInfo.resourceStores = resourceStores;
            })
        },
        methods: {
            //取消退还
            _openDeleteResourceStoreModel: function (_resourceStore) {
                let _tmpResourceStore = [];
                $that.returnStorehouseManageInfo.resourceStores.forEach(item => {
                    if (item.resId != _resourceStore.resId) {
                        _tmpResourceStore.push(item);
                    }
                })
                $that.returnStorehouseManageInfo.resourceStores = _tmpResourceStore;
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStaff', 'removeSelectResourceStaffItem', _resourceStore.resId);
            },
            // 退还全部
            _itemReturnAll: function (_resourceStore) {
                $that.returnStorehouseManageInfo.resourceStores.forEach(item => {
                    if (item.resId == _resourceStore.resId) {
                        item.curStock = item.miniStock;
                    }
                })
            },
            _openReturnStorehouseModel: function () {
                vc.emit('chooseResourceStaff', 'openChooseResourceStaffModel', {});
            },
            _listReturnStorehouse: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        vc.component.returnStorehouseManageInfo.storehouses = _storehouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _submitApply: function () {
                //校验数据
                if ($that.returnStorehouseManageInfo.remark == '') {
                    vc.toast('退还说明不能为空');
                    return;
                }
                let _saveFlag = true;
                if ($that.returnStorehouseManageInfo.resourceStores.length < 1) {
                    vc.toast('请选择物品');
                    return;
                }
                $that.returnStorehouseManageInfo.resourceStores.forEach(item => {
                    if (item.curStock <= 0) {
                        vc.toast("请填写退还数量");
                        _saveFlag = false;
                        return;
                    }
                    if (parseInt(item.curStock) > parseInt(item.miniStock)) {
                        vc.toast(item.resName + "库存不足");
                        _saveFlag = false;
                        return;
                    }
                    if (!item.shzId) {
                        vc.toast("请选择目标库存");
                        _saveFlag = false;
                        return;
                    }
                });
                if (!_saveFlag) {
                    return;
                }
                vc.http.apiPost(
                    'resourceStore.saveAllocationStorehouse',
                    JSON.stringify($that.returnStorehouseManageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);
