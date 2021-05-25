(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMachineAuthInfo: {
                authId: '',
                machineId: '',
                personId: '',
                startTime: '',
                endTime: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMachineAuth', 'openAddMachineAuthModal', function () {
                $('#addMachineAuthModel').modal('show');
            });
        },
        methods: {
            addMachineAuthValidate() {
                return vc.validate.validate({
                    addMachineAuthInfo: vc.component.addMachineAuthInfo
                }, {
                    'addMachineAuthInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "设备格式错误"
                        },
                    ],
                    'addMachineAuthInfo.personId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "员工名称太长"
                        },
                    ],
                    'addMachineAuthInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        },
                    ],
                    'addMachineAuthInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ]

                });
            },
            saveMachineAuthInfo: function () {
                if (!vc.component.addMachineAuthValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addMachineAuthInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMachineAuthInfo);
                    $('#addMachineAuthModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'machineAuth.saveMachineAuth',
                    JSON.stringify(vc.component.addMachineAuthInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMachineAuthModel').modal('hide');
                            vc.component.clearAddMachineAuthInfo();
                            vc.emit('machineAuthManage', 'listMachineAuth', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMachineAuthInfo: function () {
                vc.component.addMachineAuthInfo = {
                    machineId: '',
                    personId: '',
                    startTime: '',
                    endTime: '',

                };
            }
        }
    });

})(window.vc);
