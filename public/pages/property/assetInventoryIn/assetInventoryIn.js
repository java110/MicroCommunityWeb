/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryInInfo: {
                resourceStores: [],
                shId: '',
                shName: '',
                invTime: '',
                name: '',
                staffName: '',
                storehouses: [],
                remark: '',
                state: '2000',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            vc.initDateTime('invTime', function (_value) {
                $that.assetInventoryInInfo.invTime = _value;
            });
            vc.component._listShopHouses();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo2', 'setSelectResourceStores', function (resourceStores) {
                let oldList = vc.component.assetInventoryInInfo.resourceStores;
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
                vc.component.assetInventoryInInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _doAssetInventory: function () {
                let _inoutOrderProducts = $that.assetInventoryInInfo.storehouses;
                if (_inoutOrderProducts.length < 1) {
                    vc.toast('请选择商品');
                    return;
                }
                vc.http.apiPost(
                    'assetInventory.saveAssetInventory',
                    JSON.stringify(vc.component.assetInventoryInInfo),
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
                if (!$that.assetInventoryInInfo.shId) {
                    vc.toast('请先选择仓库');
                    return;
                }
                // vc.emit('chooseProductAndSpec', 'openChooseProductModel', {
                //     shId: $that.assetInventoryInInfo.shId
                // });
            
            },
            _goBack: function () {
                vc.goBack();
            },
            _listShopHouses: function (_page, _rows) {
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
                        var _shopHouseManageInfo = JSON.parse(json);
                        vc.component.assetInventoryInInfo.storehouses = _shopHouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            } ,
            _openSelectResourceStoreInfoModel() {
                if (!$that.assetInventoryInInfo.shId) {
                    vc.toast('请先选择仓库');
                    return;
                }
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: $that.assetInventoryInInfo.shId,
                    unEditFlag:true
                });
            },
            // 清空物品,确定仓库名称
            selectResourceStores: function() {
                vc.component.assetInventoryInInfo.resourceStores = [];
                let _storehouses = vc.component.assetInventoryInInfo.storehouses;
                _storehouses.forEach((item, index) => {
                    if (item.shId == $that.assetInventoryInInfo.shId) {
                        $that.assetInventoryInInfo.shName = item.shName;
                    }
                })
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                vc.component.assetInventoryInInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        vc.component.assetInventoryInInfo.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore2', 'removeSelectResourceStoreItem', resId);
            }
        }
    });
})(window.vc);
