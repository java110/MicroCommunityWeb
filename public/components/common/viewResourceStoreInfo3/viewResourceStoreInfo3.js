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
                let oldList = vc.component.viewResourceStoreInfo3.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.contrastPrice = newItem.price;
                    newItem.price = 0;
                    newItem.quantity = 0;
                    newItem.rsId = '';
                    oldList.forEach((oldItem) => {
                        if(oldItem.resId == newItem.resId){
                            delete resourceStores[newIndex];
                        }
                    })
                })
                // 合并已有商品和新添加商品
                resourceStores.push.apply(resourceStores,oldList);
                // 过滤空元素
                resourceStores = resourceStores.filter((s) => {
                    return s.hasOwnProperty('resId');
                });
                vc.component.viewResourceStoreInfo3.resourceStores = resourceStores;
            });
            vc.on('viewResourceStoreInfo3', 'getSelectResourceStores', function () {
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo3);
            });
            vc.on('viewResourceStoreInfo3', 'clearSelectResourceStores', function () {
                vc.component.viewResourceStoreInfo3.resourceStores = [];
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
