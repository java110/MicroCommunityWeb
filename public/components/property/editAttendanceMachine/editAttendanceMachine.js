(function (vc, vm) {
    vc.extends({
        data: {
            editAttendanceMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: 'v1.0',
                machineName: '',
                machineTypeCd: '9997',
                authCode: '未知',
                machineIp: '',
                machineMac: '',
                locationTypeCd: '',
                direction: '3306',
                locationType: '',
                locations: [],
                attrs: [],
                typeId: '',
                isShow: 'true'
            }
        },
        _initMethod: function () {
            $that._loadEditMachineAttrSpec();
        },
        _initEvent: function () {
            vc.on('editAttendanceMachine', 'openEditMachineModal', function (_params) {
                vc.component.refreshEditMachineInfo();
                $('#editAttendanceMachineModel').modal('show');
                vc.copyObject(_params, vc.component.editAttendanceMachineInfo);
                vc.component._initMachineUrl();
                if (_params.hasOwnProperty('machineAttrs')) {
                    let _machineAttrs = _params.machineAttrs;
                    _machineAttrs.forEach(item => {
                        $that.editAttendanceMachineInfo.attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specCd) {
                                attrItem.attrId = item.attrId;
                                attrItem.value = item.value;
                            }
                        })
                    })
                }
                vc.component.editAttendanceMachineInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initMachineUrl: function () {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    return;
                }
                var apiUrl = sysInfo.apiUrl + "/api/machineTranslate.machineHeartbeart?communityId=" +
                    vc.getCurrentCommunity().communityId + "&transaction_id=-1&req_time=20181113225612&user_id=-1" +
                    "&app_id=" + vc.component.editAttendanceMachineInfo.machineTypeCd;
                vc.component.editAttendanceMachineInfo.machineUrl = apiUrl;
            },
            editAttendanceMachineValidate: function () {
                return vc.validate.validate({
                    editAttendanceMachineInfo: vc.component.editAttendanceMachineInfo
                }, {
                    'editAttendanceMachineInfo.machineCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备编码不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,30",
                            errInfo: "设备编码不能超过30位"
                        }
                    ],
                    'editAttendanceMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }
                    ],
                    'editAttendanceMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        }
                    ],
                    'editAttendanceMachineInfo.machineIp': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备IP格式错误"
                        }
                    ],
                    'editAttendanceMachineInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备ID不能为空"
                        }
                    ],
                });
            },
            editAttendanceMachine: function () {
                vc.component.editAttendanceMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.editAttendanceMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.updateMachine',
                    JSON.stringify(vc.component.editAttendanceMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAttendanceMachineModel').modal('hide');
                            vc.emit('attendanceMachineManage', 'listMachine', {});
                            vc.toast("修改成功");
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
            refreshEditMachineInfo: function () {
                let _locations = $that.editAttendanceMachineInfo.locations;
                let _attrs = $that.editAttendanceMachineInfo.attrs;
                vc.component.editAttendanceMachineInfo = {
                    machineId: '',
                    machineCode: '',
                    machineVersion: 'v1.0',
                    machineName: '',
                    machineTypeCd: '9997',
                    authCode: '未知',
                    machineIp: '',
                    machineMac: '',
                    locationTypeCd: '',
                    direction: '3306',
                    locationType: '',
                    locations: _locations,
                    attrs: _attrs,
                    typeId: ''
                }
            },
            _loadEditMachineAttrSpec: function () {
                $that.editAttendanceMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editAttendanceMachineInfo.attrs.push(item);
                        }
                    });
                }, 'ATTENDANCE');
            },
            _loadEditAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, 'ATTENDANCE');
            },
            setEditMachineTypeCd: function (_typeId) {
                vc.component.editAttendanceMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.editAttendanceMachineInfo.machineTypeCd = item.machineTypeCd;
                        if (item.machineTypeCd == '9998' || item.machineTypeCd == '9994') {
                            $that.editAttendanceMachineInfo.direction = '3306';
                            $that.editAttendanceMachineInfo.isShow = 'false';
                        } else {
                            $that.editAttendanceMachineInfo.isShow = 'true';
                        }
                    }
                });
            }
        }
    });
})(window.vc, window.vc.component);