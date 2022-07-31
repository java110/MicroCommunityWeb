/**
 目录商品 组件
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewMainCategoryProductInfo: {
                index: 0,
                flowComponent: 'viewMainCategoryProductInfo',
                mainCategoryId: '',
                productId: '',
                startTime: '',
                endTime: '',
                seq: ''
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadMainCategoryProductInfoData();
        },
        _initEvent: function () {
            vc.on('viewMainCategoryProductInfo', 'chooseMainCategoryProduct', function (_app) {
                vc.copyObject(_app, vc.component.viewMainCategoryProductInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewMainCategoryProductInfo);
            });
            vc.on('viewMainCategoryProductInfo', 'onIndex', function (_index) {
                vc.component.viewMainCategoryProductInfo.index = _index;
            });
        },
        methods: {
            _openSelectMainCategoryProductInfoModel() {
                vc.emit('chooseMainCategoryProduct', 'openChooseMainCategoryProductModel', {});
            },
            _openAddMainCategoryProductInfoModel() {
                vc.emit('addMainCategoryProduct', 'openAddMainCategoryProductModal', {});
            },
            _loadMainCategoryProductInfoData: function () {
            }
        }
    });
})(window.vc);
