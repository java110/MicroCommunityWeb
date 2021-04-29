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
            viewResourceStoreInfo3: {
                index: 0,
                flowComponent: 'viewResourceStoreInfo3',
                resName: '',
                resCode: '',
                price: '',
                stock: '',
                description: '',
                resourceStores: [],
                resOrderType: '',
                resourceSuppliers: []
            }
        },
        _initMethod: function () {
            vc.component._loadResourceSuppliers();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo3', 'setResourcesOut', function (_resOrderType) {
                vc.component.viewResourceStoreInfo3.resOrderType = _resOrderType;
            });
            vc.on('viewResourceStoreInfo3', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, vc.component.viewResourceStoreInfo3);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo3);
            });
            vc.on('viewResourceStoreInfo3', 'onIndex', function (_index) {
                vc.component.viewResourceStoreInfo3.index = _index;
            });
            vc.on('viewResourceStoreInfo3', 'setSelectResourceStores', function (resourceStores) {
                console.log('selected :',resourceStores);
                // 保留用户之前输入的数量和备注
                let oldList = vc.component.viewResourceStoreInfo3.resourceStores;
                resourceStores.forEach((newItem) => {
                    newItem.quantity = 0;
                    newItem.rsId = '';
                    oldList.forEach((oldItem) => {
                        if(oldItem.resId == newItem.resId){
                            newItem.purchaseQuantity = oldItem.purchaseQuantity;
                            newItem.price = oldItem.price;
                            newItem.purchaseRemark = oldItem.purchaseRemark;
                            newItem.rsId = oldItem.rsId;
                        }
                    })
                })
                vc.component.viewResourceStoreInfo3.resourceStores = resourceStores;
            });
            vc.on('viewResourceStoreInfo3', 'getSelectResourceStores', function (resourceStores) {
                //vc.component.viewResourceStoreInfo3.resourceStores = resourceStores;
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo3);
            });
        },
        methods: {
            _loadResourceSuppliers() {
                var param = {
                    params: { page: 1, row: 50 }
                };
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        var _resourceSupplierManageInfo = JSON.parse(json);
                        vc.component.viewResourceStoreInfo3.resourceSuppliers = _resourceSupplierManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openSelectResourceStoreInfoModel() {
                vc.emit('chooseResourceStore3', 'openChooseResourceStoreModel3', {});
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                vc.component.viewResourceStoreInfo3.resourceStores.forEach((item, index) => {
                    if(item.resId == resId){
                        vc.component.viewResourceStoreInfo3.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore3', 'removeSelectResourceStoreItem', resId);
            }
        }
    });
})(window.vc);
