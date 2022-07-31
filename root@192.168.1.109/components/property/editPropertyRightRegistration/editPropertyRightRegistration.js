(function(vc, vm) {
    vc.extends({
        data: {
            editPropertyRightRegistrationInfo: {
                prrId: '',
                roomId: '',
                floorId: '',
                unitId: '',
                name: '',
                link: '',
                idCard: '',
                address: '',
                floors: [],
                units: [],
                rooms: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('editPropertyRightRegistration', 'openEditPropertyRightRegistrationModal', function(_params) {
                vc.component.refreshEditPropertyRightRegistrationInfo();
                $('#editPropertyRightRegistrationModel').modal('show');
                vc.copyObject(_params, vc.component.editPropertyRightRegistrationInfo);
                vc.component.editPropertyRightRegistrationInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.component.queryFloor();
            });
        },
        methods: {
            editPropertyRightRegistrationValidate: function() {
                return vc.validate.validate({
                    editPropertyRightRegistrationInfo: vc.component.editPropertyRightRegistrationInfo
                }, {
                    'editPropertyRightRegistrationInfo.roomId': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋id不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "房屋id不能超过30"
                        },
                    ],
                    'editPropertyRightRegistrationInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "姓名不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,64",
                            errInfo: "姓名长度必须在2位至64位"
                        },
                    ],
                    'editPropertyRightRegistrationInfo.link': [{
                        limit: "required",
                        param: "",
                        errInfo: "联系方式不能为空"
                    }],
                    'editPropertyRightRegistrationInfo.idCard': [{
                            limit: "required",
                            param: "",
                            errInfo: "身份证号不能为空"
                        },
                        {
                            limit: "idCard",
                            param: "",
                            errInfo: "身份证格式错误"
                        }
                    ],
                    'editPropertyRightRegistrationInfo.address': [{
                            limit: "required",
                            param: "",
                            errInfo: "地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "255",
                            errInfo: "地址不能超过255"
                        },
                    ],
                    'editPropertyRightRegistrationInfo.prrId': [{
                        limit: "required",
                        param: "",
                        errInfo: "房屋产权ID不能为空"
                    }]
                });
            },
            editPropertyRightRegistration: function() {
                if (!vc.component.editPropertyRightRegistrationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'propertyRightRegistration.updatePropertyRightRegistration',
                    JSON.stringify(vc.component.editPropertyRightRegistrationInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPropertyRightRegistrationModel').modal('hide');
                            vc.emit('propertyRightRegistrationManage', 'listPropertyRightRegistration', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询楼栋
            queryFloor: function() {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.get(
                    'listFloor',
                    'list',
                    param,
                    function(json, res) {
                        var listFloorData = JSON.parse(json);
                        vc.component.editPropertyRightRegistrationInfo.floors = listFloorData.apiFloorDataVoList;
                        vc.component.queryUnit();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询单元
            queryUnit: function() {
                var param = {
                    params: {
                        floorId: vc.component.editPropertyRightRegistrationInfo.floorId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.get('unit',
                    'loadUnits',
                    param,
                    function(json, res) {
                        var listUnitData = JSON.parse(json);
                        vc.component.editPropertyRightRegistrationInfo.units = listUnitData;
                        vc.component.queryRoom();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询房屋
            queryRoom: function() {
                var param = {
                    params: {
                        unitId: vc.component.editPropertyRightRegistrationInfo.unitId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.get('room',
                    'listRoom',
                    param,
                    function(json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.component.editPropertyRightRegistrationInfo.rooms = listRoomData.rooms;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditPropertyRightRegistrationInfo: function() {
                vc.component.editPropertyRightRegistrationInfo = {
                    prrId: '',
                    roomId: '',
                    floorId: '',
                    unitId: '',
                    name: '',
                    link: '',
                    idCard: '',
                    address: '',
                    floors: [],
                    units: [],
                    rooms: []
                }
            }
        }
    });
})(window.vc, window.vc.component);