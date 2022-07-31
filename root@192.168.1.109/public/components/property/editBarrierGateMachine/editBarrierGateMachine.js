(function(vc, vm) {

    vc.extends({
        data: {
            editBarrierGateMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: 'v1.0',
                machineName: '',
                machineTypeCd: '',
                authCode: '未知',
                machineIp: '',
                machineMac: '',
                locationTypeCd: '',
                direction: '',
                locationType: '',
                locations: [],
                machineTypes: [],
                attrs: [],
                typeId: '',
                isShow: 'true',

            }
        },
        _initMethod: function() {
            $that._loadEditMachineAttrSpec();
        },
        _initEvent: function() {
            vc.on('editBarrierGateMachine', 'openEditMachineModal', function(_params) {
                vc.component.refreshEditMachineInfo();
                $that._loadEditLocation()
                $that._listEditMachineTypes();
                $('#editBarrierGateMachineModel').modal('show');
                vc.copyObject(_params, vc.component.editBarrierGateMachineInfo);
                vc.component._initMachineUrl();
                if (_params.hasOwnProperty('machineAttrs')) {
                    let _machineAttrs = _params.machineAttrs;
                    _machineAttrs.forEach(item => {
                        $that.editBarrierGateMachineInfo.attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specCd) {
                                attrItem.attrId = item.attrId;
                                attrItem.value = item.value;
                            }
                        })
                    })
                }
                vc.component.editBarrierGateMachineInfo.communityId = vc.getCurrentCommunity().communityId;
            });


        },
        methods: {
            _initMachineUrl: function() {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    return;
                }

                var apiUrl = sysInfo.apiUrl + "/api/machineTranslate.machineHeartbeart?communityId=" +
                    vc.getCurrentCommunity().communityId + "&transaction_id=-1&req_time=20181113225612&user_id=-1" +
                    "&app_id=" + vc.component.editBarrierGateMachineInfo.machineTypeCd;
                vc.component.editBarrierGateMachineInfo.machineUrl = apiUrl;


            },
            editBarrierGateMachineValidate: function() {
                return vc.validate.validate({
                    editBarrierGateMachineInfo: vc.component.editBarrierGateMachineInfo
                }, {
                    'editBarrierGateMachineInfo.machineCode': [{
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
                    'editBarrierGateMachineInfo.machineVersion': [{
                        limit: "required",
                        param: "",
                        errInfo: "版本号不能为空"
                    }],
                    'editBarrierGateMachineInfo.machineName': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备名称不能为空"
                    }],
                    'editBarrierGateMachineInfo.direction': [{
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
                    'editBarrierGateMachineInfo.authCode': [{
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
                    'editBarrierGateMachineInfo.machineIp': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "设备IP格式错误"
                    }, ],
                    'editBarrierGateMachineInfo.machineMac': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "设备MAC 格式错误"
                    }, ],
                    'editBarrierGateMachineInfo.machineId': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备ID不能为空"
                    }],
                    'editBarrierGateMachineInfo.locationTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "请选择设备位置"
                    }],

                });
            },
            editBarrierGateMachine: function() {
                vc.component.editBarrierGateMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if ($that.editBarrierGateMachineInfo.machineTypeCd == '9995') {
                    $that.editBarrierGateMachineInfo.direction = '3306';
                }
                if (!vc.component.editBarrierGateMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/machine.updateMachine',
                    JSON.stringify(vc.component.editBarrierGateMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editBarrierGateMachineModel').modal('hide');
                            vc.emit('barrierGateMachineManage', 'listMachine', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditMachineInfo: function() {
                let _locations = $that.editBarrierGateMachineInfo.locations;
                let _attrs = $that.editBarrierGateMachineInfo.attrs;
                vc.component.editBarrierGateMachineInfo = {
                    machineId: '',
                    machineCode: '',
                    machineVersion: 'v1.0',
                    machineName: '',
                    machineTypeCd: '',
                    authCode: '未知',
                    machineIp: '',
                    machineMac: '',
                    locationTypeCd: '',
                    direction: '',
                    locationType: '',
                    locations: _locations,
                    machineTypes: [],
                    attrs: _attrs,
                    typeId: '',
                    isShow: 'true',
                }
            },
            _loadEditLocation: function() {
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
                    function(json, res) {
                        var _locationManageInfo = JSON.parse(json);
                        vc.component.editBarrierGateMachineInfo.locations = _locationManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onChangeLocation: function(e) {
                let _locationTypeCd = $that.editBarrierGateMachineInfo.locationTypeCd;

                $that.editBarrierGateMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.editBarrierGateMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadEditMachineAttrSpec: function() {
                $that.editBarrierGateMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function(data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editBarrierGateMachineInfo.attrs.push(item);
                        }
                    });

                }, 'BARRIER_GATE');
            },
            _loadEditAttrValue: function(_specCd, _values) {
                vc.getAttrValue(_specCd, function(data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                }, 'BARRIER_GATE');
            },
            _listEditMachineTypes: function() {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };

                //发送get请求
                vc.http.apiGet('machineType.listMachineType',
                    param,
                    function(json, res) {
                        let _machineTypeManageInfo = JSON.parse(json);
                        vc.component.editBarrierGateMachineInfo.machineTypes = _machineTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            setEditMachineTypeCd: function(_typeId) {
                vc.component.editBarrierGateMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.editBarrierGateMachineInfo.machineTypeCd = item.machineTypeCd;
                    }
                });
            }
        }
    });

})(window.vc, window.vc.component);