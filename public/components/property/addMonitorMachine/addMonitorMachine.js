(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMonitorMachineInfo: {
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
        },
        _initEvent: function () {
            vc.on('addMonitorMachine', 'openAddMachineModal', function () {
                $that._loadMachineAttrSpec();
                $('#addMonitorMachineModel').modal('show');
            });
        },
        methods: {
            addMonitorMachineValidate: function () {
                return vc.validate.validate({
                    addMonitorMachineInfo: vc.component.addMonitorMachineInfo
                }, {
                    'addMonitorMachineInfo.machineCode': [
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
                    'addMonitorMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }
                    ],
                    'addMonitorMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        }
                    ],
                    'addMonitorMachineInfo.machineTypeCd': [
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
                    'addMonitorMachineInfo.direction': [
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
                    'addMonitorMachineInfo.authCode': [
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
                    'addMonitorMachineInfo.machineIp': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备IP格式错误"
                        }
                    ],
                    'addMonitorMachineInfo.machineMac': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备MAC 格式错误"
                        }
                    ],
                    'addMonitorMachineInfo.locationTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择设备位置"
                        }
                    ]
                });
            },
            saveMachineInfo: function () {
                vc.component.addMonitorMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.addMonitorMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMonitorMachineInfo);
                    $('#addMonitorMachineModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/machine.saveMachine',
                    JSON.stringify(vc.component.addMonitorMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMonitorMachineModel').modal('hide');
                            vc.component.clearAddMachineInfo();
                            vc.emit('monitorMachineManage', 'listMachine', {});
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
                let _locations = $that.addMonitorMachineInfo.locations;
                vc.component.addMonitorMachineInfo = {
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
                        vc.component.addMonitorMachineInfo.locations = _locationManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onAddChangeLocation: function (e) {
                let _locationTypeCd = $that.addMonitorMachineInfo.locationTypeCd;
                $that.addMonitorMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.addMonitorMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadMachineAttrSpec: function () {
                $that.addMonitorMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addMonitorMachineInfo.attrs.push(item);
                        }
                    });
                }, 'MONITOR');
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, 'MONITOR');
            }
        }
    });
})(window.vc);