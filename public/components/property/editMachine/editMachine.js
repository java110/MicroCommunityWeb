(function (vc, vm) {
    vc.extends({
        data: {
            editMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: '',
                machineName: '',
                machineTypeCd: '',
                authCode: '',
                machineIp: '',
                machineMac: '',
                floorId: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitNum: '',
                roomId: '',
                paId: '',
                orgId: '',
                locationTypeCd: '',
                locationObjId: '',
                roomNum: '',
                machineUrl: '',
                direction: '',
                locationType: '',
                locations: [],
                attrs: [],
                typeId: '',
                isShow: 'true',
                machineTypes: []
            }
        },
        _initMethod: function () {
            $that._loadEditMachineAttrSpec();
            $that._listEditMachineTypes();
        },
        _initEvent: function () {
            vc.on('editMachine', 'openEditMachineModal', function (_params) {
                vc.component.refreshEditMachineInfo();
                $that._loadEditLocation()
                $('#editMachineModel').modal('show');
                vc.copyObject(_params, vc.component.editMachineInfo);
                vc.component._initMachineUrl();
                $that.setEditMachineTypeCd(vc.component.editMachineInfo.typeId);
                //根据位置类型 传输数据
                if (vc.component.editMachineInfo.locationTypeCd == '2000') {
                    vc.emit('editMachine', 'floorSelect2', 'setFloor', {
                        floorId: vc.component.editMachineInfo.floorId,
                        floorNum: vc.component.editMachineInfo.floorNum
                    });
                    vc.emit('editMachine', 'unitSelect2', 'setUnit', {
                        floorId: vc.component.editMachineInfo.floorId,
                        floorNum: vc.component.editMachineInfo.floorNum,
                        unitId: vc.component.editMachineInfo.unitId,
                        unitNum: vc.component.editMachineInfo.unitNum,
                    });
                } else if (vc.component.editMachineInfo.locationTypeCd == '3000') {
                    vc.emit('editMachine', 'floorSelect2', 'setFloor', {
                        floorId: vc.component.editMachineInfo.floorId,
                        floorNum: vc.component.editMachineInfo.floorNum
                    });
                    vc.emit('editMachine', 'unitSelect2', 'setUnit', {
                        floorId: vc.component.editMachineInfo.floorId,
                        floorNum: vc.component.editMachineInfo.floorNum,
                        unitId: vc.component.editMachineInfo.unitId,
                        unitNum: vc.component.editMachineInfo.unitNum,
                    });
                    vc.emit('editMachine', 'roomSelect2', 'setRoom', {
                        floorId: vc.component.editMachineInfo.floorId,
                        floorNum: vc.component.editMachineInfo.floorNum,
                        unitId: vc.component.editMachineInfo.unitId,
                        unitNum: vc.component.editMachineInfo.unitNum,
                        roomId: vc.component.editMachineInfo.roomId,
                        roomNum: vc.component.editMachineInfo.roomNum,
                    });
                } else if (vc.component.editMachineInfo.locationTypeCd == '4000') {
                    vc.emit('editMachine', 'parkingAreaSelect2', 'setParkingArea', {
                        paId: vc.component.editMachineInfo.paId,
                        num: vc.component.editMachineInfo.num
                    });
                } else if (vc.component.editMachineInfo.locationTypeCd == '5000') {
                    vc.emit('editMachine', 'orgSelect2', 'setOrg', {
                        orgId: vc.component.editMachineInfo.orgId,
                        num: vc.component.editMachineInfo.num
                    });
                }
                if (_params.hasOwnProperty('machineAttrs')) {
                    let _machineAttrs = _params.machineAttrs;
                    _machineAttrs.forEach(item => {
                        $that.editMachineInfo.attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specCd) {
                                attrItem.attrId = item.attrId;
                                attrItem.value = item.value;
                            }
                        })
                    })
                }
                vc.component.editMachineInfo.communityId = vc.getCurrentCommunity().communityId;
            });

            vc.on("editMachine", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    vc.component.editMachineInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    vc.component.editMachineInfo.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty("roomId")) {
                    vc.component.editMachineInfo.roomId = _param.roomId;
                }
            });
            vc.on('editMachine', 'staffSelect2', 'setStaff', function (_param) {
                if (_param.hasOwnProperty("orgId")) {
                    vc.component.addMachineInfo.orgId = _param.orgId;
                }
            })
        },
        methods: {
            _initMachineUrl: function () {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    return;
                }
                var apiUrl = sysInfo.apiUrl + "/api/machineTranslate.machineHeartbeart?communityId=" +
                    vc.getCurrentCommunity().communityId + "&transaction_id=-1&req_time=20181113225612&user_id=-1" +
                    "&app_id=" + vc.component.editMachineInfo.machineTypeCd;
                vc.component.editMachineInfo.machineUrl = apiUrl;
            },
            editMachineValidate: function () {
                return vc.validate.validate({
                    editMachineInfo: vc.component.editMachineInfo
                }, {
                    'editMachineInfo.machineCode': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备编码不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "1,30",
                            errInfo: "设备编码不能超过30位"
                        },
                    ],
                    'editMachineInfo.machineVersion': [{
                        limit: "required",
                        param: "",
                        errInfo: "版本号不能为空"
                    }],
                    'editMachineInfo.machineName': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备名称不能为空"
                    }],
                    'editMachineInfo.machineTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备类型不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "设备类型格式错误"
                        },
                    ],
                    'editMachineInfo.direction': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备方向不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "设备方向格式错误"
                        },
                    ],
                    'editMachineInfo.authCode': [{
                        limit: "required",
                        param: "",
                        errInfo: "厂家不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "厂家不能大于64位"
                        },
                    ],
                    'editMachineInfo.machineIp': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "设备IP格式错误"
                    }],
                    'editMachineInfo.machineMac': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "设备MAC 格式错误"
                    }],
                    'editMachineInfo.machineId': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备ID不能为空"
                    }],
                    'editMachineInfo.locationTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "请选择设备位置"
                    }],
                    'editMachineInfo.locationObjId': [{
                        limit: "required",
                        param: "",
                        errInfo: "请选择位置"
                    }]
                });
            },
            editMachine: function () {
                vc.component.editMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.editMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.updateMachine',
                    JSON.stringify(vc.component.editMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMachineModel').modal('hide');
                            vc.emit('machineManage', 'listMachine', {});
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
                        vc.component.editMachineInfo.machineTypes = _machineTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshEditMachineInfo: function () {
                let _locations = $that.editMachineInfo.locations;
                let _attrs = $that.editMachineInfo.attrs;
                let _machineTypes = $that.editMachineInfo.machineTypes;
                vc.component.editMachineInfo = {
                    machineId: '',
                    machineCode: '',
                    machineVersion: '',
                    machineName: '',
                    machineTypeCd: '',
                    authCode: '',
                    machineIp: '',
                    machineMac: '',
                    floorId: '',
                    floorNum: '',
                    floorName: '',
                    unitId: '',
                    unitNum: '',
                    roomId: '',
                    locationTypeCd: '',
                    locationObjId: '',
                    roomNum: '',
                    machineUrl: '',
                    direction: '',
                    locationType: '',
                    locations: _locations,
                    attrs: _attrs,
                    paId: '',
                    typeId: '',
                    isShow: 'true',
                    machineTypes: _machineTypes
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
                        vc.component.editMachineInfo.locations = _locationManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onChangeLocation: function (e) {
                let _locationTypeCd = $that.editMachineInfo.locationTypeCd;
                $that.editMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.editMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadEditMachineAttrSpec: function () {
                $that.editMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editMachineInfo.attrs.push(item);
                        }
                    });
                }, "COMMON");
            },
            _loadEditAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, "COMMON");
            },
            setEditMachineTypeCd: function (_typeId) {
                vc.component.editMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.editMachineInfo.machineTypeCd = item.machineTypeCd;
                        if (item.machineTypeCd == '9998' || item.machineTypeCd == '9994') {
                            $that.editMachineInfo.direction = '3306';
                            $that.editMachineInfo.isShow = 'false';
                        } else {
                            $that.editMachineInfo.isShow = 'true';
                        }
                    }
                });
            }
        }
    });
})(window.vc, window.vc.component);