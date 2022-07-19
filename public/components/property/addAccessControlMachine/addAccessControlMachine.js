(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAccessControlMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: '',
                machineName: '',
                machineTypeCd: '9999',
                authCode: '',
                machineIp: '',
                machineMac: '',
                locationTypeCd: '',
                direction: '',
                locationType: '',
                locations: [],
                attrs: [],
                typeId: '',
                isShow: 'true',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addAccessControlMachine', 'openAddMachineModal', function() {
                $that._loadLocation();
                $that._loadMachineAttrSpec();
                $('#addAccessControlMachineModel').modal('show');
            });


        },
        methods: {
            addAccessControlMachineValidate: function() {
                return vc.validate.validate({
                    addAccessControlMachineInfo: vc.component.addAccessControlMachineInfo
                }, {
                    'addAccessControlMachineInfo.machineCode': [{
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
                    'addAccessControlMachineInfo.machineVersion': [{
                        limit: "required",
                        param: "",
                        errInfo: "版本号不能为空"
                    }],
                    'addAccessControlMachineInfo.machineName': [{
                        limit: "required",
                        param: "",
                        errInfo: "设备名称不能为空"
                    }],
                    'addAccessControlMachineInfo.machineTypeCd': [{
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
                    'addAccessControlMachineInfo.direction': [{
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
                    'addAccessControlMachineInfo.authCode': [{
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
                    'addAccessControlMachineInfo.machineIp': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "设备IP格式错误"
                    }, ],
                    'addAccessControlMachineInfo.machineMac': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "设备MAC 格式错误"
                    }],
                    'addAccessControlMachineInfo.locationTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "请选择设备位置"
                    }]
                });
            },
            saveMachineInfo: function() {
                vc.component.addAccessControlMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.addAccessControlMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAccessControlMachineInfo);
                    $('#addAccessControlMachineModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/machine.saveMachine',
                    JSON.stringify(vc.component.addAccessControlMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addAccessControlMachineModel').modal('hide');
                            vc.component.clearAddMachineInfo();
                            vc.emit('accessControlMachineManage', 'listMachine', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddMachineInfo: function() {
                let _locations = $that.addAccessControlMachineInfo.locations;
                vc.component.addAccessControlMachineInfo = {
                    machineId: '',
                    machineCode: '',
                    machineVersion: '',
                    machineName: '',
                    machineTypeCd: '9999',
                    authCode: '',
                    machineIp: '',
                    machineMac: '',
                    locationTypeCd: '',
                    direction: '',
                    locationType: '',
                    locations: _locations,
                    attrs: [],
                    typeId: '',
                    isShow: 'true',
                };
            },
            _loadLocation: function() {
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
                        vc.component.addAccessControlMachineInfo.locations = _locationManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onAddChangeLocation: function(e) {
                let _locationTypeCd = $that.addAccessControlMachineInfo.locationTypeCd;
                $that.addAccessControlMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.addAccessControlMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadMachineAttrSpec: function() {
                $that.addAccessControlMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function(data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addAccessControlMachineInfo.attrs.push(item);
                        }
                    });

                });
            },
            _loadAttrValue: function(_specCd, _values) {
                vc.getAttrValue(_specCd, function(data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                });
            }
        }
    });

})(window.vc);