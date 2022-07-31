/**
    保证金对象 组件
**/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewAccountBondObjInfo: {
                index: 0,
                flowComponent: 'viewAccountBondObjInfo',
                bondId: '',
                objId: '',
                receivableAmount: '',
                receivedAmount: '',

            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadAccountBondObjInfoData();
        },
        _initEvent: function () {
            vc.on('viewAccountBondObjInfo', 'chooseAccountBondObj', function (_app) {
                vc.copyObject(_app, vc.component.viewAccountBondObjInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewAccountBondObjInfo);
            });

            vc.on('viewAccountBondObjInfo', 'onIndex', function (_index) {
                vc.component.viewAccountBondObjInfo.index = _index;
            });

        },
        methods: {

            _openSelectAccountBondObjInfoModel() {
                vc.emit('chooseAccountBondObj', 'openChooseAccountBondObjModel', {});
            },
            _openAddAccountBondObjInfoModel() {
                vc.emit('addAccountBondObj', 'openAddAccountBondObjModal', {});
            },
            _loadAccountBondObjInfoData: function () {

            }
        }
    });

})(window.vc);
