(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addBarrierGateMachineInfo: {
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
                isShow: 'true'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addBarrierGateMachine', 'openAddMachineModal', function () {
                $that._loadLocation();
                $that._loadMachineAttrSpec();
                $that._listAddMachineTypes();
                $('#addBarrierGateMachineModel').modal('show');
            });
        },
        methods: {
            addBarrierGateMachineValidate: function () {
                return vc.validate.validate({
                    addBarrierGateMachineInfo: vc.component.addBarrierGateMachineInfo
                }, {
                    'addBarrierGateMachineInfo.machineCode': [
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
                    'addBarrierGateMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }
                    ],
                    'addBarrierGateMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        }
                    ],
                    'addBarrierGateMachineInfo.machineTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "设备类型格式错误"
                        }
                    ],
                    'addBarrierGateMachineInfo.direction': [
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
                    'addBarrierGateMachineInfo.authCode': [
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
                    'addBarrierGateMachineInfo.machineIp': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备IP格式错误"
                        }
                    ],
                    'addBarrierGateMachineInfo.machineMac': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备MAC 格式错误"
                        }
                    ],
                    'addBarrierGateMachineInfo.locationTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择设备位置"
                        }
                    ]
                });
            },
            saveMachineInfo: function () {
                vc.component.addBarrierGateMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if ($that.addBarrierGateMachineInfo.machineTypeCd == '9995') {
                    $that.addBarrierGateMachineInfo.direction = '3306';
                }
                if (!vc.component.addBarrierGateMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addBarrierGateMachineInfo);
                    $('#addBarrierGateMachineModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/machine.saveMachine',
                    JSON.stringify(vc.component.addBarrierGateMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#addBarrierGateMachineModel').modal('hide');
                            vc.component.clearAddMachineInfo();
                            vc.emit('barrierGateMachineManage', 'listMachine', {});
                            vc.toast("添加成功");
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
            clearAddMachineInfo: function () {
                let _locations = $that.addBarrierGateMachineInfo.locations;
                vc.component.addBarrierGateMachineInfo = {
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
                    attrs: [],
                    typeId: '',
                    isShow: 'true',
                    machineTypes: []
                };
            },
            _loadLocation: function () {
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
                        vc.component.addBarrierGateMachineInfo.locations = _locationManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onAddChangeLocation: function (e) {
                let _locationTypeCd = $that.addBarrierGateMachineInfo.locationTypeCd;
                $that.addBarrierGateMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.addBarrierGateMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadMachineAttrSpec: function () {
                $that.addBarrierGateMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addBarrierGateMachineInfo.attrs.push(item);
                        }
                    });
                }, 'BARRIER_GATE');
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, 'BARRIER_GATE');
            },
            _listAddMachineTypes: function () {
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
                    function (json, res) {
                        let _machineTypeManageInfo = JSON.parse(json);
                        vc.component.addBarrierGateMachineInfo.machineTypes = _machineTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            setAddMachineTypeCd: function (_typeId) {
                vc.component.addBarrierGateMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.addBarrierGateMachineInfo.machineTypeCd = item.machineTypeCd;
                    }
                });
            }
        }
    });
})(window.vc)