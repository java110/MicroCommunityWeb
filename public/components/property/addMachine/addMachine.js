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
                authCode: '',
                machineIp: '',
                machineMac: '',
                floorId: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitName: '',
                roomId: '',
                paId: '',
                orgId: '',
                locationTypeCd: '',
                locationObjId: '',
                roomName: '',
                direction: '',
                locationType: '',
                locations: [],
                attrs: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMachine', 'openAddMachineModal', function () {
                $that._loadLocation();
                $that._loadMachineAttrSpec();
                $('#addMachineModel').modal('show');
            });

            vc.on("addMachine", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    vc.component.addMachineInfo.floorId = _param.floorId;
                }

                if (_param.hasOwnProperty("unitId")) {
                    vc.component.addMachineInfo.unitId = _param.unitId;
                }

                if (_param.hasOwnProperty("roomId")) {
                    vc.component.addMachineInfo.roomId = _param.roomId;
                }

                if (_param.hasOwnProperty("paId")) {
                    vc.component.addMachineInfo.paId = _param.paId;
                }
                
            });
            vc.on('addMachine', 'staffSelect2', 'setStaff',function(_param){
                if (_param.hasOwnProperty("orgId")) {
                    vc.component.addMachineInfo.orgId = _param.orgId;
                }
            })
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
                        },
                    ],
                    'addMachineInfo.machineVersion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "版本号不能为空"
                        }],
                    'addMachineInfo.machineName':
                        [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "设备名称不能为空"
                            }],
                    'addMachineInfo.machineTypeCd':
                        [
                            {
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
                    'addMachineInfo.direction':
                        [
                            {
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
                    'addMachineInfo.authCode':
                        [
                            {
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
                    'addMachineInfo.machineIp':
                        [
                            {
                                limit: "maxLength",
                                param: "64",
                                errInfo: "设备IP格式错误"
                            },
                        ],
                    'addMachineInfo.machineMac':
                        [
                            {
                                limit: "maxLength",
                                param: "64",
                                errInfo: "设备MAC 格式错误"
                            }
                        ],
                    'addMachineInfo.locationTypeCd':
                        [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "请选择设备位置"
                            }
                        ],
                    'addMachineInfo.locationObjId':
                        [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "请选择位置"
                            }
                        ]
                });
            },
            saveMachineInfo: function () {
                vc.component.addMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                if (vc.component.addMachineInfo.locationType != '2000'
                    && vc.component.addMachineInfo.locationType != '3000'
                    && vc.component.addMachineInfo.locationType != '4000'
                    && vc.component.addMachineInfo.locationType != '5000'
                ) { //大门时直接写 小区ID
                    vc.component.addMachineInfo.locationObjId = vc.component.addMachineInfo.communityId;
                } else if (vc.component.addMachineInfo.locationType == '2000') {
                    vc.component.addMachineInfo.locationObjId = vc.component.addMachineInfo.unitId;
                } else if (vc.component.addMachineInfo.locationType == '3000') {
                    vc.component.addMachineInfo.locationObjId = vc.component.addMachineInfo.roomId;
                } else if (vc.component.addMachineInfo.locationType == '4000') {
                    vc.component.addMachineInfo.locationObjId = vc.component.addMachineInfo.paId;
                } else if (vc.component.addMachineInfo.locationType == '5000') {
                    vc.component.addMachineInfo.locationObjId = vc.component.addMachineInfo.orgId;
                } else {
                    vc.toast("设备位置值错误");
                    return;
                }

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

                vc.http.post(
                    'addMachine',
                    'save',
                    JSON.stringify(vc.component.addMachineInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addMachineModel').modal('hide');
                            vc.component.clearAddMachineInfo();
                            vc.emit('machineManage', 'listMachine', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
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
                    paId: '',
                    orgId: ''
                };
            },
            _initAddMachineData: function () {
                $('.floorSelector').select2({
                    placeholder: '必填，请选择楼栋',
                    ajax: {
                        url: "sdata.json",
                        dataType: 'json',
                        delay: 250,
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
                    }, function (errInfo, error) {
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

                });
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                });
            },
        }
    });

})(window.vc);
