(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPropertyRightRegistrationInfo: {
                prrId: '',
                roomId: '',
                floorId: '',
                floors: [],
                unitId: '',
                units: [],
                rooms: [],
                name: '',
                link: '',
                idCard: '',
                address: '',
                isTrue: '',
                flag: '',
                state: "0",
                idCardPhotos: [],
                housePurchasePhotos: [],
                repairPhotos: [],
                deedTaxPhotos: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('addPropertyRightRegistration', 'openAddPropertyRightRegistrationModal', function() {
                $('#addPropertyRightRegistrationModel').modal('show');
            });
            vc.component._queryFloor();
            //身份证照片上传
            vc.on("addPropertyRightRegistration", "notifyUploadIdCardImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.addPropertyRightRegistrationInfo.idCardPhotos = [];
                    _param.forEach((item) => {
                        vc.component.addPropertyRightRegistrationInfo.idCardPhotos.push(item.fileId);
                    })
                } else {
                    vc.component.addPropertyRightRegistrationInfo.idCardPhotos = [];
                }
            });
            //购房合同图片上传
            vc.on("addPropertyRightRegistration", "notifyUploadHousePurchaseImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.addPropertyRightRegistrationInfo.housePurchasePhotos = [];
                    _param.forEach((item) => {
                        vc.component.addPropertyRightRegistrationInfo.housePurchasePhotos.push(item.fileId);
                    })
                } else {
                    vc.component.addPropertyRightRegistrationInfo.housePurchasePhotos = [];
                }
            });
            //维修基金图片上传
            vc.on("addPropertyRightRegistration", "notifyUploadRepairImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.addPropertyRightRegistrationInfo.repairPhotos = [];
                    _param.forEach((item) => {
                        vc.component.addPropertyRightRegistrationInfo.repairPhotos.push(item.fileId);
                    })
                } else {
                    vc.component.addPropertyRightRegistrationInfo.repairPhotos = [];
                }
            });
            //契税证明图片上传
            vc.on("addPropertyRightRegistration", "notifyUploadDeedTaxImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.addPropertyRightRegistrationInfo.deedTaxPhotos = [];
                    _param.forEach((item) => {
                        vc.component.addPropertyRightRegistrationInfo.deedTaxPhotos.push(item.fileId);
                    })
                } else {
                    vc.component.addPropertyRightRegistrationInfo.deedTaxPhotos = [];
                }
            });
        },
        methods: {
            addPropertyRightRegistrationValidate() {
                return vc.validate.validate({
                    addPropertyRightRegistrationInfo: vc.component.addPropertyRightRegistrationInfo
                }, {
                    'addPropertyRightRegistrationInfo.floorId': [{
                        limit: "required",
                        param: "",
                        errInfo: "楼栋不能为空"
                    }],
                    'addPropertyRightRegistrationInfo.unitId': [{
                        limit: "required",
                        param: "",
                        errInfo: "单元不能为空"
                    }],
                    'addPropertyRightRegistrationInfo.roomId': [{
                        limit: "required",
                        param: "",
                        errInfo: "房屋不能为空"
                    }],
                    'addPropertyRightRegistrationInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "姓名不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,64",
                            errInfo: "姓名长度必须在2位至64位"
                        }
                    ],
                    'addPropertyRightRegistrationInfo.link': [{
                        limit: "required",
                        param: "",
                        errInfo: "联系方式不能为空"
                    }, ],
                    'addPropertyRightRegistrationInfo.idCard': [{
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
                    'addPropertyRightRegistrationInfo.address': [{
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
                    'addPropertyRightRegistrationInfo.isTrue': [{
                        limit: "required",
                        param: "",
                        errInfo: "请确认维修基金是否缴纳"
                    }],
                    'addPropertyRightRegistrationInfo.flag': [{
                        limit: "required",
                        param: "",
                        errInfo: "请确认契税是否缴纳"
                    }]
                });
            },
            savePropertyRightRegistrationInfo: function() {
                if (!vc.component.addPropertyRightRegistrationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addPropertyRightRegistrationInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/propertyRightRegistration.savePropertyRightRegistration',
                    JSON.stringify(vc.component.addPropertyRightRegistrationInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPropertyRightRegistrationModel').modal('hide');
                            vc.component.clearAddPropertyRightRegistrationInfo();
                            vc.emit('propertyRightRegistrationManage', 'listPropertyRightRegistration', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询楼栋
            _queryFloor: function() {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function(json, res) {
                        var listFloorData = JSON.parse(json);
                        vc.component.addPropertyRightRegistrationInfo.floors = listFloorData.apiFloorDataVoList;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询单元
            _queryUnit: function() {
                var param = {
                    params: {
                        floorId: vc.component.addPropertyRightRegistrationInfo.floorId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.apiGet('/unit.queryUnits',
                    param,
                    function(json, res) {
                        var listUnitData = JSON.parse(json);
                        vc.component.addPropertyRightRegistrationInfo.units = listUnitData;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询房屋
            _queryRoom: function() {
                var param = {
                    params: {
                        unitId: vc.component.addPropertyRightRegistrationInfo.unitId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function(json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.component.addPropertyRightRegistrationInfo.rooms = listRoomData.rooms;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddPropertyRightRegistrationInfo: function() {
                vc.emit('addPropertyRightRegistration1', 'uploadImage', 'clearImage', {});
                vc.emit('addPropertyRightRegistration2', 'uploadImage', 'clearImage', {});
                vc.emit('addPropertyRightRegistration3', 'uploadImage', 'clearImage', {});
                vc.emit('addPropertyRightRegistration4', 'uploadImage', 'clearImage', {});
                vc.component.addPropertyRightRegistrationInfo = {
                    roomId: '',
                    floorId: '',
                    floors: [],
                    unitId: '',
                    units: [],
                    rooms: [],
                    name: '',
                    link: '',
                    idCard: '',
                    address: '',
                    isTrue: '',
                    flag: '',
                    state: "0",
                    idCardPhotos: [],
                    housePurchasePhotos: [],
                    repairPhotos: [],
                    deedTaxPhotos: []
                };
            }
        }
    });
})(window.vc);