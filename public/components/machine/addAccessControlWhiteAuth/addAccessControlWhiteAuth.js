(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAccessControlWhiteAuthInfo: {
                acwaId: '',
                acwId: '',
                machineId: '',
                machines: [],

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addAccessControlWhiteAuth', 'openAddAccessControlWhiteAuthModal', function (_param) {
                vc.copyObject(_param, $that.addAccessControlWhiteAuthInfo);
                $that._listAddMachines();
                $('#addAccessControlWhiteAuthModel').modal('show');
            });
        },
        methods: {
            addAccessControlWhiteAuthValidate() {
                return vc.validate.validate({
                    addAccessControlWhiteAuthInfo: vc.component.addAccessControlWhiteAuthInfo
                }, {
                    'addAccessControlWhiteAuthInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备不能超过30"
                        },
                    ],
                });
            },
            saveAccessControlWhiteAuthInfo: function () {
                if (!vc.component.addAccessControlWhiteAuthValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAccessControlWhiteAuthInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/machine.saveAccessControlWhiteAuth',
                    JSON.stringify(vc.component.addAccessControlWhiteAuthInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAccessControlWhiteAuthModel').modal('hide');
                            vc.component.clearAddAccessControlWhiteAuthInfo();
                            vc.emit('accessControlWhiteAuthManage', 'listAccessControlWhiteAuth', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddAccessControlWhiteAuthInfo: function () {
                vc.component.addAccessControlWhiteAuthInfo = {
                    acwaId: '',
                    acwId: '',
                    machineId: '',
                    machines: [],
                };
            },

            _listAddMachines: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineTypeCd: '9999',
                        domain: 'ACCESS_CONTROL',
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function (json, res) {
                        let _accessControlMachineManageInfo = JSON.parse(json);
                        $that.addAccessControlWhiteAuthInfo.machines = _accessControlMachineManageInfo.machines;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

        }
    });

})(window.vc);
