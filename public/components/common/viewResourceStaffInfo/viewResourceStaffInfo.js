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
            viewResourceStaffInfo: {
                index: 0,
                flowComponent: 'viewResourceStaffInfo',
                resName: '',
                resCode: '',
                price: '',
                stock: '',
                description: '',
                resourceStores: [],
                resOrderType: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewResourceStaffInfo', 'setResourcesOut', function (_resOrderType) {
                vc.component.viewResourceStaffInfo.resOrderType = _resOrderType;
            });
            vc.on('viewResourceStaffInfo', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, vc.component.viewResourceStaffInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStaffInfo);
            });
            vc.on('viewResourceStaffInfo', 'onIndex', function (_index) {
                vc.component.viewResourceStaffInfo.index = _index;
            });
            vc.on('viewResourceStaffInfo', 'setSelectResourceStores', function (resourceStores) {
                console.log('set on :', resourceStores);
                // 保留用户之前输入的数量和备注
                let oldList = vc.component.viewResourceStaffInfo.resourceStores;
                resourceStores.forEach((newItem) => {
                    newItem.quantity = 0;
                    oldList.forEach((oldItem) => {
                        if(oldItem.resId == newItem.resId){
                            newItem.giveQuantity = oldItem.giveQuantity;
                            newItem.price = oldItem.price;
                            newItem.purchaseRemark = oldItem.purchaseRemark;
                        }
                    })
                })
                vc.component.viewResourceStaffInfo.resourceStores = resourceStores;
                console.log("这里呢")
                console.log(resourceStores)
            });
            vc.on('viewResourceStaffInfo', 'getSelectResourceStores', function (resourceStores) {
                //vc.component.viewResourceStaffInfo.resourceStores = resourceStores;
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceStaffInfo);
            });
        },
        methods: {
            _openSelectResourceStaffInfoModel() {
                vc.emit('chooseResourceStaff', 'openChooseResourceStaffModel', {});
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                vc.component.viewResourceStaffInfo.resourceStores.forEach((item, index) => {
                    if(item.resId == resId){
                        vc.component.viewResourceStaffInfo.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStaff', 'removeSelectResourceStaffItem', resId);
            }
        }
    });
})(window.vc);
