/**
    预付费用 组件
**/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewPrestoreFeeInfo: {
                index: 0,
                flowComponent: 'viewPrestoreFeeInfo',
                roomId: '',
                prestoreFeeType: '',
                prestoreFeeObjType: '',
                prestoreFeeAmount: '',
                state: '',
                remark: '',

            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadPrestoreFeeInfoData();
        },
        _initEvent: function () {
            vc.on('viewPrestoreFeeInfo', 'choosePrestoreFee', function (_app) {
                vc.copyObject(_app, vc.component.viewPrestoreFeeInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewPrestoreFeeInfo);
            });

            vc.on('viewPrestoreFeeInfo', 'onIndex', function (_index) {
                vc.component.viewPrestoreFeeInfo.index = _index;
            });

        },
        methods: {

            _openSelectPrestoreFeeInfoModel() {
                vc.emit('choosePrestoreFee', 'openChoosePrestoreFeeModel', {});
            },
            _openAddPrestoreFeeInfoModel() {
                vc.emit('addPrestoreFee', 'openAddPrestoreFeeModal', {});
            },
            _loadPrestoreFeeInfoData: function () {

            }
        }
    });

})(window.vc);
