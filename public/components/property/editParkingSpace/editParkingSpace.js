(function (vc) {
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string
        },
        data: {
            editParkingSpaceInfo: {
                parkingTypes: [],
                parkingType: '',
                parkingTypeName: '',
                psId: '',
                num: '',
                areaNum: '',
                paId: '',
                area: '',
                remark: ''
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('parking_space', "parking_type", function (_data) {
                vc.component.editParkingSpaceInfo.parkingTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('editParkingSpace', 'openEditParkingSpaceModal', function (_parkingSpace) {
                vc.copyObject(_parkingSpace, vc.component.editParkingSpaceInfo);
                vc.emit('editParkingSpace', 'parkingAreaSelect2', 'setParkingArea', {
                    paId: vc.component.editParkingSpaceInfo.paId,
                    num: vc.component.editParkingSpaceInfo.areaNum
                });
                $('#editParkingSpaceModel').modal('show');
            });
            vc.on("editParkingSpace", "notify", function (_param) {
                vc.component.editParkingSpaceInfo.paId = _param.paId;
            });
        },
        methods: {
            editParkingSpaceValidate() {
                return vc.validate.validate({
                    editParkingSpaceInfo: vc.component.editParkingSpaceInfo
                }, {
                    'editParkingSpaceInfo.num': [
                        {
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
                    'editParkingSpaceInfo.paId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场不能为空"
                        }
                    ],
                    'editParkingSpaceInfo.area': [
                        {
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
                    'editParkingSpaceInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            editParkingSpaceMethod: function () {
                if (!vc.component.editParkingSpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editParkingSpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/parkingSpace.editParkingSpace',
                    JSON.stringify(vc.component.editParkingSpaceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        
                        if (res.status == 200) {
                            //关闭model
                            $('#editParkingSpaceModel').modal('hide');
                            vc.component.clearEditParkingSpaceInfo();
                            vc.emit($props.notifyLoadDataComponentName, 'listParkingSpaceData', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearEditParkingSpaceInfo: function () {
                vc.component.editParkingSpaceInfo.psId = '';
                vc.component.editParkingSpaceInfo.num = '';
                vc.component.editParkingSpaceInfo.paId = '';
                vc.component.editParkingSpaceInfo.area = '';
                vc.component.editParkingSpaceInfo.remark = '';
                vc.component.editParkingSpaceInfo.areaNum = '';
                vc.emit('editParkingSpace', 'parkingAreaSelect2', 'setParkingArea', {
                    paId: '',
                    num: ''
                });
            }
        }
    });
})(window.vc);