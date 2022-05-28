(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string
        },
        data: {
            addParkingSpaceInfo: {
                num: '',
                paId: '',
                area: '',
                remark: '',
                psId: '',
                parkingType: '',
                parkingTypes: [],
                parkingAreas: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('parking_space', "parking_type", function (_data) {
                vc.component.addParkingSpaceInfo.parkingTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addParkingSpace', 'openAddParkingSpaceModal', function (_parkingSpaceId) {
                if (_parkingSpaceId != null || _parkingSpaceId != -1) {
                    vc.component.addParkingSpaceInfo.parkingSpaceId = _parkingSpaceId;
                }
                $('#addParkingSpaceModel').modal('show');
            });
            vc.on("addParkingSpace", "notify", function (_param) {
                vc.component.addParkingSpaceInfo.paId = _param.paId;
            });
        },
        methods: {
            addParkingSpaceValidate() {
                return vc.validate.validate({
                    addParkingSpaceInfo: vc.component.addParkingSpaceInfo
                }, {
                    'addParkingSpaceInfo.num': [{
                        limit: "required",
                        param: "",
                        errInfo: "车位编号不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车位编号长度不能超过12位"
                        },
                    ],
                    'addParkingSpaceInfo.paId': [{
                        limit: "required",
                        param: "",
                        errInfo: "停车场不能为空"
                    }],
                    'addParkingSpaceInfo.parkingType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车位类型不能为空"
                    }],
                    'addParkingSpaceInfo.area': [{
                        limit: "required",
                        param: "",
                        errInfo: "车位面积不能为空"
                    },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "车位面积格式错误，如3.09"
                        }
                    ],
                    'addParkingSpaceInfo.remark': [

                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            saveParkingSpaceInfo: function () {
                if (!vc.component.addParkingSpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addParkingSpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/parkingSpace.saveParkingSpace',
                    JSON.stringify(vc.component.addParkingSpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addParkingSpaceModel').modal('hide');
                            vc.component.clearAddParkingSpaceInfo();
                            vc.toast("添加成功");
                            vc.emit($props.notifyLoadDataComponentName, 'listParkingSpaceData', {});
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddParkingSpaceInfo: function () {
                vc.component.addParkingSpaceInfo.num = '';
                vc.component.addParkingSpaceInfo.paId = '';
                vc.component.addParkingSpaceInfo.area = '';
                vc.component.addParkingSpaceInfo.remark = '';
                vc.component.addParkingSpaceInfo.parkingType = '';
                vc.emit('addParkingSpace', 'parkingAreaSelect2', 'setParkingArea', {
                    paId: '',
                    num: ''
                });
            }
        }
    });
})(window.vc);