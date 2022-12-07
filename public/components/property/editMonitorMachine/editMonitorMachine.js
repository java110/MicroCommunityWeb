(function (vc, vm) {
    vc.extends({
        data: {
            editMonitorMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: '',
                machineName: '',
                machineTypeCd: '9998',
                authCode: '未知',
                machineIp: '',
                machineMac: '',
                locationTypeCd: '-1',
                direction: '3306',
                attrs: [],
                typeId: '',
                isShow: 'true'
            }
        },
        _initMethod: function () {
            $that._loadEditMachineAttrSpec();
        },
        _initEvent: function () {
            vc.on('editMonitorMachine', 'openEditMachineModal', function (_params) {
                vc.component.refreshEditMachineInfo();
                $('#editMonitorMachineModel').modal('show');
                vc.copyObject(_params, vc.component.editMonitorMachineInfo);
                vc.component._initMachineUrl();
                if (_params.hasOwnProperty('machineAttrs')) {
                    let _machineAttrs = _params.machineAttrs;
                    _machineAttrs.forEach(item => {
                        $that.editMonitorMachineInfo.attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specCd) {
                                attrItem.attrId = item.attrId;
                                attrItem.value = item.value;
                            }
                        })
                    })
                }
                vc.component.editMonitorMachineInfo.communityId = vc.getCurrentCommunity().communityId;
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
                    "&app_id=" + vc.component.editMonitorMachineInfo.machineTypeCd;
                vc.component.editMonitorMachineInfo.machineUrl = apiUrl;
            },
            editMonitorMachineValidate: function () {
                return vc.validate.validate({
                    editMonitorMachineInfo: vc.component.editMonitorMachineInfo
                }, {
                    'editMonitorMachineInfo.machineCode': [
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
                    'editMonitorMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }
                    ],
                    'editMonitorMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        }
                    ],
                    'editMonitorMachineInfo.direction': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备方向不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "设备方向格式错误"
                        }
                    ],
                    'editMonitorMachineInfo.authCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "厂家不能大于64位"
                        }
                    ],
                    'editMonitorMachineInfo.machineIp': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备IP格式错误"
                        }
                    ],
                    'editMonitorMachineInfo.machineMac': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备MAC 格式错误"
                        }
                    ],
                    'editMonitorMachineInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备ID不能为空"
                        }
                    ],
                    'editMonitorMachineInfo.locationTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择设备位置"
                        }
                    ]
                });
            },
            editMonitorMachine: function () {
                vc.component.editMonitorMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.editMonitorMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.updateMachine',
                    JSON.stringify(vc.component.editMonitorMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMonitorMachineModel').modal('hide');
                            vc.emit('monitorMachineManage', 'listMachine', {});
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
            _listEditMachineTypes: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('machineType.listMachineType',
                    param,
                    function (json, res) {
                        var _machineTypeManageInfo = JSON.parse(json);
                        vc.component.editMonitorMachineInfo.machineTypes = _machineTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshEditMachineInfo: function () {
                vc.component.editMonitorMachineInfo = {
                    machineId: '',
                    machineCode: '',
                    machineVersion: '',
                    machineName: '',
                    machineTypeCd: '9998',
                    authCode: '未知',
                    machineIp: '',
                    machineMac: '',
                    locationTypeCd: '-1',
                    direction: '3306',
                    attrs: [],
                    typeId: '',
                    isShow: 'true'
                }
            },
            _loadEditMachineAttrSpec: function () {
                $that.editMonitorMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editMonitorMachineInfo.attrs.push(item);
                        }
                    });
                }, 'MONITOR');
            },
            _loadEditAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, 'MONITOR');
            },
            setEditMachineTypeCd: function (_typeId) {
                vc.component.editMonitorMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.editMonitorMachineInfo.machineTypeCd = item.machineTypeCd;
                        if (item.machineTypeCd == '9998' || item.machineTypeCd == '9994') {
                            $that.editMonitorMachineInfo.direction = '3306';
                            $that.editMonitorMachineInfo.isShow = 'false';
                        } else {
                            $that.editMonitorMachineInfo.isShow = 'true';
                        }
                    }
                });
            }
        }
    });
})(window.vc, window.vc.component);