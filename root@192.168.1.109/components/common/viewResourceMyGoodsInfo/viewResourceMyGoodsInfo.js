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
            viewResourceMyGoodsInfo: {
                index: 0,
                flowComponent: 'viewResourceMyGoodsInfo',
                resName: '',
                resCode: '',
                price: '',
                state: '',
                stock: '',
                description: '',
                resourceStores: [],
                resOrderType: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewResourceMyGoodsInfo', 'setResourcesOut', function (_resOrderType) {
                vc.component.viewResourceMyGoodsInfo.resOrderType = _resOrderType;
            });
            vc.on('viewResourceMyGoodsInfo', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, vc.component.viewResourceMyGoodsInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceMyGoodsInfo);
            });
            vc.on('viewResourceMyGoodsInfo', 'getResourceStore', function (_app) {
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceMyGoodsInfo.resourceStores);
            });
            vc.on('viewResourceMyGoodsInfo', 'onIndex', function (_index) {
                vc.component.viewResourceMyGoodsInfo.index = _index;
            });
            vc.on('viewResourceMyGoodsInfo', 'setSelectResourceStores', function (resourceStores) {
                console.log('set on :', resourceStores);
                // 保留用户之前输入的数量和备注
                resourceStores.forEach((item) => {
                    item.state = '';
                })
                vc.component.viewResourceMyGoodsInfo.resourceStores = resourceStores;
                // vc.component.viewResourceMyGoodsInfo.resourceStores.push.apply(vc.component.viewResourceMyGoodsInfo.resourceStores, resourceStores)
            });
            vc.on('viewResourceMyGoodsInfo', 'getSelectResourceStores', function (resourceStores) {
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewResourceMyGoodsInfo);
            });
        },
        methods: {
            _openSelectResourceMyGoodsInfoModel() {
                vc.emit('chooseResourceStaff', 'openChooseResourceStaffModel', {});
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId, index) {
                vc.component.viewResourceMyGoodsInfo.resourceStores.forEach((item) => {
                    if (item.resId == resId) {
                        vc.component.viewResourceMyGoodsInfo.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStaff', 'removeSelectResourceStaffItem', resId);
            }
        }
    });
})(window.vc);
