/**
    设备台账 组件
**/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewEquipmentAccountInfo: {
                index: 0,
                flowComponent: 'viewEquipmentAccountInfo',
                machineName: '',
                machineCode: '',
                brand: '',
                model: '',
                locationDetail: '',
                firstEnableTime: '',
                warrantyDeadline: '',
                usefulLife: '',
                importanceLevel: '',
                state: '',
                purchasePrice: '',
                purchasePrice: '',
                useOrgOd: '',
                useUserId: '',
                chargeOrgId: '',
                chargeUseId: '',
                remark: '',

            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadEquipmentAccountInfoData();
        },
        _initEvent: function () {
            vc.on('viewEquipmentAccountInfo', 'chooseEquipmentAccount', function (_app) {
                vc.copyObject(_app, vc.component.viewEquipmentAccountInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewEquipmentAccountInfo);
            });

            vc.on('viewEquipmentAccountInfo', 'onIndex', function (_index) {
                vc.component.viewEquipmentAccountInfo.index = _index;
            });

        },
        methods: {

            _openSelectEquipmentAccountInfoModel() {
                vc.emit('chooseEquipmentAccount', 'openChooseEquipmentAccountModel', {});
            },
            _openAddEquipmentAccountInfoModel() {
                vc.emit('addEquipmentAccount', 'openAddEquipmentAccountModal', {});
            },
            _loadEquipmentAccountInfoData: function () {

            }
        }
    });

})(window.vc);
