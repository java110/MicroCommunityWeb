(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMachineInfo: {
                machineId: '',
                machineCode: '',
                machineVersion: '',
                machineName: '',
                machineTypeCd: '',
                machineTypeCds: [],
                authCode: '',
                machineIp: '',
                machineMac: '',
                floorId: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitName: '',
                roomId: '',
                boxId: '',
                orgId: '',
                locationTypeCd: '',
                locationObjId: '',
                roomName: '',
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
            vc.getDict('machine', 'machine_type_cd', function (_data) {
                $that.addMachineInfo.machineTypeCds = _data;
            })
        },
        _initEvent: function () {
            vc.on('addMachine', 'openAddMachineModal', function () {
                $that._loadLocation();
                $that._loadMachineAttrSpec();
                $that._listAddMachineTypes();
                $('#addMachineModel').modal('show');
            });
        },
        methods: {
            addMachineValidate: function () {
                return vc.validate.validate({
                    addMachineInfo: vc.component.addMachineInfo
                }, {
                    'addMachineInfo.machineCode': [
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
                    'addMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }
                    ],
                    'addMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        }
                    ],
                    'addMachineInfo.machineTypeCd': [
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
                    'addMachineInfo.direction': [
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
                    'addMachineInfo.authCode': [
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
                    'addMachineInfo.machineIp': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备IP格式错误"
                        }
                    ],
                    'addMachineInfo.machineMac': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备MAC 格式错误"
                        }
                    ],
                    'addMachineInfo.locationTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择设备位置"
                        }
                    ]
                });
            },
            saveMachineInfo: function () {
                vc.component.addMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.addMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMachineInfo);
                    $('#addMachineModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/machine.saveMachine',
                    JSON.stringify(vc.component.addMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMachineModel').modal('hide');
                            vc.component.clearAddMachineInfo();
                            vc.emit('machineManage', 'listMachine', {});
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
            _listAddMachineTypes: function () {
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
                        vc.component.addMachineInfo.machineTypes = _machineTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddMachineInfo: function () {
                let _locations = $that.addMachineInfo.locations;
                vc.component.addMachineInfo = {
                    machineCode: '',
                    machineVersion: '',
                    machineName: '',
                    machineTypeCd: '',
                    authCode: '',
                    machineIp: '',
                    machineMac: '',
                    direction: '',
                    locationType: '',
                    locations: _locations,
                    attrs: [],
                    floorId: '',
                    floorNum: '',
                    floorName: '',
                    unitId: '',
                    unitName: '',
                    roomId: '',
                    boxId: '',
                    orgId: '',
                    typeId: '',
                    isShow: 'true',
                    machineTypes: []
                };
            },
            _initAddMachineData: function () {
                $('.floorSelector').select2({
                    placeholder: '必填，请选择楼栋',
                    ajax: {
                        url: "sdata.json",
                        dataType: 'json',
                        delay: 250,
                        headers: {
                            'APP-ID': '8000418004',
                            'TRANSACTION-ID': vc.uuid(),
                            'REQ-TIME': vc.getDateYYYYMMDDHHMISS(),
                            'SIGN': ''
                        },
                        data: function (params) {
                            return {
                                floorNum: vc.component.addMachineInfo.floorNum,
                                /* page:*/
                            };
                        },
                        processResults: function (data) {
                            return {
                                results: data
                            };
                        },
                        cache: true
                    },
                    minimumInputLength: 2
                });
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
                        vc.component.addMachineInfo.locations = _locationManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onAddChangeLocation: function (e) {
                let _locationTypeCd = $that.addMachineInfo.locationTypeCd;
                $that.addMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.addMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadMachineAttrSpec: function () {
                $that.addMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addMachineInfo.attrs.push(item);
                        }
                    });

                }, 'COMMON');
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                }, 'COMMON');
            },
            setAddMachineTypeCd: function (_typeId) {
                vc.component.addMachineInfo.machineTypes.forEach(item => {
                    if (item.typeId == _typeId) {
                        vc.component.addMachineInfo.machineTypeCd = item.machineTypeCd;
                        if (item.machineTypeCd == '9994') {
                            $that.addMachineInfo.direction = '3306';
                            $that.addMachineInfo.isShow = 'false';
                        } else {
                            $that.addMachineInfo.direction = '';
                            $that.addMachineInfo.isShow = 'true';
                        }
                    }
                });
            }
        }
    });
})(window.vc);