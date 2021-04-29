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
            viewResourceStoreInfo2: {
                index: 0,
                flowComponent: 'viewResourceStoreInfo2',
                resName: '',
                resCode: '',
                price: '',
                stock: '',
                description: '',
                resourceStores: [],
                resourceSuppliers: []
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadResourceStoreInfoData();
            vc.component._loadResourceSuppliers();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo2', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, vc.component.viewResourceStoreInfo2);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo2);
            });
            vc.on('viewResourceStoreInfo2', 'onIndex', function (_index) {
                vc.component.viewResourceStoreInfo2.index = _index;
            });
            vc.on('viewResourceStoreInfo2', 'setSelectResourceStores', function (resourceStores) {
                // 保留用户之前输入的数量和备注
                let oldList = vc.component.viewResourceStoreInfo2.resourceStores;
                resourceStores.forEach((newItem) => {
                    newItem.rsId = '';
                    oldList.forEach((oldItem) => {
                        if(oldItem.resId == newItem.resId){
                            newItem.quantity = oldItem.quantity;
                            newItem.remark = oldItem.remark;
                            newItem.rsId = oldItem.rsId;
                        }
                    })
                })
                vc.component.viewResourceStoreInfo2.resourceStores = resourceStores;
            });
            vc.on('viewResourceStoreInfo2', 'getSelectResourceStores', function (resourceStores) {
                //vc.component.viewResourceStoreInfo2.resourceStores = resourceStores;
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStoreInfo2);
            });
        },
        methods: {
            _loadResourceSuppliers(){
                var param = {
                    params: {page:1,row:50}
                };
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        var _resourceSupplierManageInfo = JSON.parse(json);
                        vc.component.viewResourceStoreInfo2.resourceSuppliers = _resourceSupplierManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openSelectResourceStoreInfoModel() {
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {});
            },
            _openAddResourceStoreInfoModel() {
                vc.emit('addResourceStore', 'openAddResourceStoreModal', {});
            },
            _loadResourceStoreInfoData: function () {
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                vc.component.viewResourceStoreInfo2.resourceStores.forEach((item, index) => {
                    if(item.resId == resId){
                        vc.component.viewResourceStoreInfo2.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore2', 'removeSelectResourceStoreItem', resId);
            }
        }
    });
})(window.vc);
