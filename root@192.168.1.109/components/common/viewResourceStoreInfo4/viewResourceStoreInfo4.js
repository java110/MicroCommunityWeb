/**
 物品管理 组件
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewResourceStoreInfo4: {
                index: 0,
                flowComponent: 'viewResourceStoreInfo4',
                resName: '',
                resCode: '',
                price: '',
                stock: '',
                description: '',
                resourceStores: [],
                resourceSuppliers: [],
                resOrderType: '',
                urgentPrice: '',
                storehouses: [],
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadResourceStoreInfoData();
            $that._listAllocationStorehouse();
            // vc.component._loadResourceSuppliers();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo4', 'setResourcesOut', function (_resOrderType) {
                vc.component.viewResourceStoreInfo4.resOrderType = _resOrderType;
            });
            vc.on('viewResourceStoreInfo4', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, vc.component.viewResourceStoreInfo4);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo4);
            });
            vc.on('viewResourceStoreInfo4', 'onIndex', function (_index) {
                vc.component.viewResourceStoreInfo4.index = _index;
            });
            vc.on('viewResourceStoreInfo4', 'setSelectResourceStores', function (resourceStores) {
                let oldList = vc.component.viewResourceStoreInfo4.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    newItem.shzId = '';
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
                vc.component.viewResourceStoreInfo4.resourceStores = resourceStores;
            });
            vc.on('viewResourceStoreInfo4', 'getSelectResourceStores', function (resourceStores) {
                //vc.component.viewResourceStoreInfo4.resourceStores = resourceStores;
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo4);
            });
        },
        methods: {
            _loadResourceSuppliers() {
                var param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        var _resourceSupplierManageInfo = JSON.parse(json);
                        vc.component.viewResourceStoreInfo4.resourceSuppliers = _resourceSupplierManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openSelectResourceStoreInfoModel() {
                vc.emit('chooseResourceStore4', 'openChooseResourceStoreModel4', {});
            },
            _openAddResourceStoreInfoModel() {
                vc.emit('addResourceStore', 'openAddResourceStoreModal', {});
            },
            _loadResourceStoreInfoData: function () {
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
                        vc.component.viewResourceStoreInfo4.storehouses = _storehouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            storeHousesChange: function(e, i){
                let shId = e.target.value;
                vc.component.viewResourceStoreInfo4.storehouses.forEach((item) => {
                    if(item.shId == shId){
                        vc.component.viewResourceStoreInfo4.resourceStores[i].shzName = item.shName;
                    }
                })
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                vc.component.viewResourceStoreInfo4.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        vc.component.viewResourceStoreInfo4.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore4', 'removeSelectResourceStoreItem', resId);
            }
        }
    });
})(window.vc);
