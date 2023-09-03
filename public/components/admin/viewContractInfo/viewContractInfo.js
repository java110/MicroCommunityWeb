/**
 合同信息 组件
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewContractInfo: {
                index: 0,
                flowComponent: 'viewContractInfo',
                contractName: '',
                contractCode: '',
                contractType: '',
                partyA: '',
                partyB: '',
                aContacts: '',
                bContacts: '',
                aLink: '',
                bLink: '',
                operator: '',
                operatorLink: '',
                amount: '',
                startTime: '',
                endTime: '',
                signingTime: ''
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadContractInfoData();
        },
        _initEvent: function () {
            vc.on('viewContractInfo', 'chooseContract', function (_app) {
                vc.copyObject(_app, vc.component.viewContractInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewContractInfo);
            });
            vc.on('viewContractInfo', 'onIndex', function (_index) {
                vc.component.viewContractInfo.index = _index;
            });
        },
        methods: {
            _openSelectContractInfoModel() {
                vc.emit('chooseContract', 'openChooseContractModel', {});
            },
            _openAddContractInfoModel() {
                vc.emit('addContract', 'openAddContractModal', {});
            },
            _loadContractInfoData: function () {
            }
        }
    });
})(window.vc);
