(function (vc) {
    vc.extends({
        data: {
            addAccessControlWhiteInfo: {
                acwId: '',
                machineIds: [],
                personName: '',
                tel: '',
                idCard: '',
                personType: '',
                startTime: '',
                endTime: '',
                accessControlKey: '',
                personTypes: [],
                machines: [],
                photo: ''
            }
        },
        _initMethod: function () {
            $that._listAddMachines();
            vc.initDateTime('addAccessControlWhiteStartTime',function(_value){
                $that.addAccessControlWhiteInfo.startTime = _value;
            });
            vc.initDateTime('addAccessControlWhiteEndTime', function (_value) {
                $that.addAccessControlWhiteInfo.endTime = _value;
            });
            vc.getDict('access_control_white', "person_type", function (_data) {
                $that.addAccessControlWhiteInfo.personTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addAccessControlWhite', 'openAddAccessControlWhiteModal', function () {
                $that._listAddMachines();
                $('#addAccessControlWhiteModel').modal('show');
            });
            vc.on("addAccessControlWhite", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addAccessControlWhiteInfo.photo = _param[0].url;
                }
            });
        },
        methods: {
            addAccessControlWhiteValidate() {
                return vc.validate.validate({
                    addAccessControlWhiteInfo: vc.component.addAccessControlWhiteInfo
                }, {
                    'addAccessControlWhiteInfo.personName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "用户名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "用户名称不能超过64"
                        }
                    ],
                    'addAccessControlWhiteInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "手机号不能超过11"
                        }
                    ],
                    'addAccessControlWhiteInfo.idCard': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "身份证号不能超过64"
                        }
                    ],
                    'addAccessControlWhiteInfo.personType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "人员类别不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "人员类别不能超过12"
                        }
                    ],
                    'addAccessControlWhiteInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "开始时间不能超过32"
                        }
                    ],
                    'addAccessControlWhiteInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "结束时间不能超过32"
                        }
                    ],
                    'addAccessControlWhiteInfo.accessControlKey': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "门禁卡号不能超过64"
                        }
                    ],
                });
            },
            saveAccessControlWhiteInfo: function () {
                if (!vc.component.addAccessControlWhiteValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if(!$that.addAccessControlWhiteInfo.machineIds || $that.addAccessControlWhiteInfo.machineIds.length<1){
                    vc.toast('未选择授权门禁');
                    return ;
                }

                vc.component.addAccessControlWhiteInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/machine.saveAccessControlWhite',
                    JSON.stringify(vc.component.addAccessControlWhiteInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAccessControlWhiteModel').modal('hide');
                            vc.component.clearAddAccessControlWhiteInfo();
                            vc.emit('accessControlWhiteManage', 'listAccessControlWhite', {});
                            vc.toast("添加成功");
                           vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddAccessControlWhiteInfo: function () {
                let _personTypes = $that.addAccessControlWhiteInfo.personTypes;
                vc.component.addAccessControlWhiteInfo = {
                    machineIds: [],
                    personName: '',
                    tel: '',
                    idCard: '',
                    personType: '',
                    startTime: '',
                    endTime: '',
                    accessControlKey: '',
                    personTypes: _personTypes,
                    machines: [],
                    photo: ''
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
                        $that.addAccessControlWhiteInfo.machines = _accessControlMachineManageInfo.machines;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack:function(){
                vc.goBack();
            }
        }
    });
})(window.vc);
