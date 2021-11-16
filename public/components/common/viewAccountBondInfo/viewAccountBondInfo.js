/**
    保证金 组件
**/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewAccountBondInfo: {
                index: 0,
                flowComponent: 'viewAccountBondInfo',
                bondName: '',
                amount: '',
                bondMonth: '',
                objId: '',

            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadAccountBondInfoData();
        },
        _initEvent: function () {
            vc.on('viewAccountBondInfo', 'chooseAccountBond', function (_app) {
                vc.copyObject(_app, vc.component.viewAccountBondInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewAccountBondInfo);
            });

            vc.on('viewAccountBondInfo', 'onIndex', function (_index) {
                vc.component.viewAccountBondInfo.index = _index;
            });

        },
        methods: {

            _openSelectAccountBondInfoModel() {
                vc.emit('chooseAccountBond', 'openChooseAccountBondModel', {});
            },
            _openAddAccountBondInfoModel() {
                vc.emit('addAccountBond', 'openAddAccountBondModal', {});
            },
            _loadAccountBondInfoData: function () {

            }
        }
    });

})(window.vc);
