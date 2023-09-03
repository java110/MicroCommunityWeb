(function (vc, vm) {
    vc.extends({
        data: {
            editAccessControlMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: 'v1.0',
                machineName: '',
                machineTypeCd: '9999',
                authCode: '未知',
                machineIp: '',
                machineMac: '',
                locationTypeCd: '',
                direction: '',
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
            vc.on('editAccessControlMachine', 'openEditMachineModal', function (_params) {
                vc.component.refreshEditMachineInfo();
                $that._loadEditLocation()
                $('#editAccessControlMachineModel').modal('show');
                vc.copyObject(_params, vc.component.editAccessControlMachineInfo);
                vc.component._initMachineUrl();
                if (_params.hasOwnProperty('machineAttrs')) {
                    let _machineAttrs = _params.machineAttrs;
                    _machineAttrs.forEach(item => {
                        $that.editAccessControlMachineInfo.attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specCd) {
                                attrItem.attrId = item.attrId;
                                attrItem.value = item.value;
                            }
                        })
                    })
                }
                vc.component.editAccessControlMachineInfo.communityId = vc.getCurrentCommunity().communityId;
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
                    "&app_id=" + vc.component.editAccessControlMachineInfo.machineTypeCd;
                vc.component.editAccessControlMachineInfo.machineUrl = apiUrl;
            },
            editAccessControlMachineValidate: function () {
                return vc.validate.validate({
                    editAccessControlMachineInfo: vc.component.editAccessControlMachineInfo
                }, {
                    'editAccessControlMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "门禁名称不能为空"
                        }
                    ],
                    'editAccessControlMachineInfo.machineCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "门禁编码不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,30",
                            errInfo: "门禁编码不能超过30位"
                        }
                    ],
                    'editAccessControlMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }
                    ],
                    'editAccessControlMachineInfo.direction': [
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
                    'editAccessControlMachineInfo.locationTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择门禁位置"
                        }
                    ],
                    'editAccessControlMachineInfo.machineIp': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备IP格式错误"
                        }
                    ],
                    'editAccessControlMachineInfo.machineMac': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备MAC格式错误"
                        }
                    ],
                    'editAccessControlMachineInfo.authCode': [
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
                    'editAccessControlMachineInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备ID不能为空"
                        }
                    ]
                });
            },
            editAccessControlMachine: function () {
                vc.component.editAccessControlMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.editAccessControlMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.updateMachine',
                    JSON.stringify(vc.component.editAccessControlMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAccessControlMachineModel').modal('hide');
                            vc.emit('accessControlMachineManage', 'listMachine', {});
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
                        vc.component.editAccessControlMachineInfo.machineTypes = _machineTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshEditMachineInfo: function () {
                let _locations = $that.editAccessControlMachineInfo.locations;
                let _attrs = $that.editAccessControlMachineInfo.attrs;
                vc.component.editAccessControlMachineInfo = {
                    machineId: '',
                    machineCode: '',
                    machineVersion: 'v1.0',
                    machineName: '',
                    machineTypeCd: '9999',
                    authCode: '未知',
                    machineIp: '',
                    machineMac: '',
                    locationTypeCd: '',
                    direction: '',
                    locationType: '',
                    locations: _locations,
                    attrs: _attrs,
                    typeId: '',
                    isShow: 'true'
                }
            },
            _loadEditLocation: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('communityLocation.listCommunityLocations',
                    param,
                    function (json, res) {
                        var _locationManageInfo = JSON.parse(json);
                        vc.component.editAccessControlMachineInfo.locations = _locationManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onChangeLocation: function (e) {
                let _locationTypeCd = $that.editAccessControlMachineInfo.locationTypeCd;
                $that.editAccessControlMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.editAccessControlMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadEditMachineAttrSpec: function () {
                $that.editAccessControlMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editAccessControlMachineInfo.attrs.push(item);
                        }
                    });
                }, 'ACCESS_CONTROL');
            },
            _loadEditAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, 'ACCESS_CONTROL');
            },
            setEditMachineTypeCd: function (_typeId) {
                vc.component.editAccessControlMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.editAccessControlMachineInfo.machineTypeCd = item.machineTypeCd;
                        if (item.machineTypeCd == '9998' || item.machineTypeCd == '9994') {
                            $that.editAccessControlMachineInfo.direction = '3306';
                            $that.editAccessControlMachineInfo.isShow = 'false';

                        } else {
                            $that.editAccessControlMachineInfo.isShow = 'true';
                        }
                    }
                });
            }
        }
    });
})(window.vc, window.vc.component);