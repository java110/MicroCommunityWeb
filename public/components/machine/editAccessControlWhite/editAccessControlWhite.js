(function (vc, vm) {
    vc.extends({
        data: {
            editAccessControlWhiteInfo: {
                acwId: '',
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
            vc.initDateTime('editAccessControlWhiteStartTime', function (_value) {
                $that.editAccessControlWhiteInfo.startTime = _value;
            });
            vc.initDateTime('editAccessControlWhiteEndTime', function (_value) {
                $that.editAccessControlWhiteInfo.endTime = _value;
            });
            vc.getDict('access_control_white', "person_type", function (_data) {
                $that.editAccessControlWhiteInfo.personTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('editAccessControlWhite', 'openEditAccessControlWhiteModal', function (_params) {
                $that.refreshEditAccessControlWhiteInfo();
                $('#editAccessControlWhiteModel').modal('show');
                vc.copyObject(_params, $that.editAccessControlWhiteInfo);
                $that.editAccessControlWhiteInfo.photo = _params.personFace;
                $that.editAccessControlWhiteInfo.communityId = vc.getCurrentCommunity().communityId;
                let _photos = [];
                _photos.push(_params.personFace);
                vc.emit('editAccessControlWhite', 'uploadImageUrl', 'notifyPhotos', _photos);
            });
            vc.on("editAccessControlWhite", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    $that.editAccessControlWhiteInfo.photo = _param[0].url;
                }
            });
        },
        methods: {
            editAccessControlWhiteValidate: function () {
                return vc.validate.validate({
                    editAccessControlWhiteInfo: $that.editAccessControlWhiteInfo
                }, {
                    'editAccessControlWhiteInfo.personName': [
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
                    'editAccessControlWhiteInfo.tel': [
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
                    'editAccessControlWhiteInfo.idCard': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "身份证号不能超过64"
                        }
                    ],
                    'editAccessControlWhiteInfo.personType': [
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
                    'editAccessControlWhiteInfo.startTime': [
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
                    'editAccessControlWhiteInfo.endTime': [
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
                    'editAccessControlWhiteInfo.accessControlKey': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "门禁卡号不能超过64"
                        }
                    ],
                    'editAccessControlWhiteInfo.acwId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editAccessControlWhite: function () {
                if (!$that.editAccessControlWhiteValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.updateAccessControlWhite',
                    JSON.stringify($that.editAccessControlWhiteInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAccessControlWhiteModel').modal('hide');
                            vc.emit('accessControlWhiteManage', 'listAccessControlWhite', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditAccessControlWhiteInfo: function () {
                let _personTypes = $that.editAccessControlWhiteInfo.personTypes;
                $that.editAccessControlWhiteInfo = {
                    acwId: '',
                    personName: '',
                    tel: '',
                    idCard: '',
                    personType: '',
                    startTime: '',
                    endTime: '',
                    accessControlKey: '',
                    personTypes: _personTypes,
                    machines: [],
                    photo: '',
                }
            },
            _listEditMachines: function (_page, _rows) {
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
                        $that.editAccessControlWhiteInfo.machines = _accessControlMachineManageInfo.machines;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.$that);
