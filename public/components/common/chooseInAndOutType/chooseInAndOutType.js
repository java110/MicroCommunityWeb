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
            chooseInAndOutType: {
                index: 0,
                flowComponent: 'chooseInAndOutType',
                resOrderType: '10000',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('chooseInAndOutType', 'onIndex', function (_index) {
                vc.component.chooseInAndOutType.index = _index;
            });
            vc.on('chooseInAndOutType', 'getSelectOrderType', function () {
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.chooseInAndOutType);
            });
        },
        methods: {

        }
    });
})(window.vc);
