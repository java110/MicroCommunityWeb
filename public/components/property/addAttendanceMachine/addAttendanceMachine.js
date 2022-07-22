(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAttendanceMachineInfo: {
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
                isShow: 'true',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addAttendanceMachine', 'openAddMachineModal', function() {
                $that._loadLocation();
                $that._loadMachineAttrSpec();
                $('#addAttendanceMachineModel').modal('show');
            });


        },
        methods: {
            addAttendanceMachineValidate: function() {
                return vc.validate.validate({
                    addAttendanceMachineInfo: vc.component.addAttendanceMachineInfo
                }, {
                    'addAttendanceMachineInfo.machineCode': [{
                            limit: "required",
                            param: "",
                            errInfo: "考勤机编码不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,30",
                            errInfo: "考勤机编码不能超过30位"
                        },
                    ],
                    'addAttendanceMachineInfo.machineVersion': [{
                        limit: "required",
                        param: "",
                        errInfo: "版本号不能为空"
                    }],
                    'addAttendanceMachineInfo.machineName': [{
                        limit: "required",
                        param: "",
                        errInfo: "考勤机名称不能为空"
                    }],
                    'addAttendanceMachineInfo.authCode': [{
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
                    'addAttendanceMachineInfo.machineIp': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "考勤机IP格式错误"
                    }, ],
                    'addAttendanceMachineInfo.machineMac': [{
                        limit: "maxLength",
                        param: "64",
                        errInfo: "考勤机MAC 格式错误"
                    }],
                    'addAttendanceMachineInfo.locationTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "请选择考勤机位置"
                    }]
                });
            },
            saveMachineInfo: function() {
                vc.component.addAttendanceMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.addAttendanceMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAttendanceMachineInfo);
                    $('#addAttendanceMachineModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/machine.saveMachine',
                    JSON.stringify(vc.component.addAttendanceMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAttendanceMachineModel').modal('hide');
                            vc.component.clearAddMachineInfo();
                            vc.emit('attendanceMachineManage', 'listMachine', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddMachineInfo: function() {
                let _locations = $that.addAttendanceMachineInfo.locations;
                vc.component.addAttendanceMachineInfo = {
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
                        row: 50,
                        locationType: '5000'
                    }
                };
                //发送get请求
                vc.http.apiGet('communityLocation.listCommunityLocations',
                    param,
                    function(json, res) {
                        var _locationManageInfo = JSON.parse(json);
                        vc.component.addAttendanceMachineInfo.locations = _locationManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            onAddChangeLocation: function(e) {
                let _locationTypeCd = $that.addAttendanceMachineInfo.locationTypeCd;
                $that.addAttendanceMachineInfo.locations.forEach(item => {
                    if (item.locationId == _locationTypeCd) {
                        $that.addAttendanceMachineInfo.locationType = item.locationType;
                    }
                });
            },
            _loadMachineAttrSpec: function() {
                $that.addAttendanceMachineInfo.attrs = [];
                vc.getAttrSpec('machine_attr', function(data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addAttendanceMachineInfo.attrs.push(item);
                        }
                    });

                }, 'ATTENDANCE');
            },
            _loadAttrValue: function(_specCd, _values) {
                vc.getAttrValue(_specCd, function(data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                }, 'ATTENDANCE');
            }
        }
    });

})(window.vc);