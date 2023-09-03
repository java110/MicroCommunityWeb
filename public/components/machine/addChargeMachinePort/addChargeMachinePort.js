(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addChargeMachinePortInfo: {
                portId: '',
                portName: '',
                portCode: '',
                state: 'FREE',
                machineId:''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addChargeMachinePort', 'openAddChargeMachinePortModal', function (_param) {
                vc.copyObject(_param,$that.addChargeMachinePortInfo);
                $('#addChargeMachinePortModel').modal('show');
            });
        },
        methods: {
            addChargeMachinePortValidate() {
                return vc.validate.validate({
                    addChargeMachinePortInfo: vc.component.addChargeMachinePortInfo
                }, {
                    'addChargeMachinePortInfo.portName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "插座名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "插座名称不能超过200"
                        },
                    ],
                    'addChargeMachinePortInfo.portCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "插座编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "插座编号不能超过30"
                        },
                    ],
                    'addChargeMachinePortInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "插座状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "插座状态不能超过12"
                        },
                    ],
                });
            },
            saveChargeMachinePortInfo: function () {
                if (!vc.component.addChargeMachinePortValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addChargeMachinePortInfo.communityId = vc.getCurrentCommunity().communityId;
                

                vc.http.apiPost(
                    '/chargeMachine.saveChargeMachinePort',
                    JSON.stringify(vc.component.addChargeMachinePortInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChargeMachinePortModel').modal('hide');
                            vc.component.clearAddChargeMachinePortInfo();
                            vc.emit('chargeMachinePortManage', 'listChargeMachinePort', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddChargeMachinePortInfo: function () {
                vc.component.addChargeMachinePortInfo = {
                    portName: '',
                    portCode: '',
                    state: 'FREE',
                    machineId:''
                };
            }
        }
    });

})(window.vc);
