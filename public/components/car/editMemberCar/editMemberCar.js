/**
 权限组
 **/
(function(vc) {
    vc.extends({
        data: {
            editMemberCarInfo: {
                carId: '',
                memberId: '',
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                remark: "",
                startTime: '',
                endTime: '',
                carNumType: '',
                leaseType: '',
            },
            carTypes: [{
                    key: '9901',
                    value: '家用小汽车'
                },
                {
                    key: '9902',
                    value: '客车'
                },
                {
                    key: '9903',
                    value: '货车'
                }
            ]
        },
        _initMethod: function() {

            vc.getDict('owner_car', "car_type", function(_data) {
                vc.component.carTypes = _data;
            });
            //vc.component._initEditCarDateInfo();
        },
        _initEvent: function() {
            vc.on('editMemberCar', 'openEditCar', function(_carInfo) {
                vc.copyObject(_carInfo, $that.editMemberCarInfo);
                /*if (_carInfo.startTime.indexOf(":") > -1) {
                    $that.editMemberCarInfo.startTime = $that.editMemberCarInfo.startTime.substring(0, 10);
                }
                if (_carInfo.endTime.indexOf(":") > -1) {
                    $that.editMemberCarInfo.endTime = $that.editMemberCarInfo.endTime.substring(0, 10);
                }*/
                $('#editMemberCarModal').modal('show');
                vc.component._initEditCarDateInfo();
            });
        },
        methods: {
            editMemberCarValidate: function() {
                return vc.validate.validate({
                    editMemberCarInfo: vc.component.editMemberCarInfo
                }, {

                    'editMemberCarInfo.carNum': [{
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,12",
                            errInfo: "车牌号不正确"
                        }
                    ],
                    'editMemberCarInfo.carBrand': [{
                        limit: "maxLength",
                        param: "50",
                        errInfo: "车品牌超出限制"
                    }],
                    'editMemberCarInfo.carType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车类型不能为空"
                    }],
                    'editMemberCarInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "起租时间不能为空"
                    }],
                    'editMemberCarInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结租时间不能为空"
                    }],
                    'editMemberCarInfo.carColor': [{
                        limit: "maxLength",
                        param: "12",
                        errInfo: "车颜色超出限制"
                    }],
                    'editMemberCarInfo.memberId': [{
                        limit: "required",
                        param: "",
                        errInfo: "车辆数据错误"
                    }],
                });
            },
            _submitEditMemberCarInfo: function() {
                if (!vc.component.editMemberCarValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editMemberCarInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/owner.editOwnerCar',
                    JSON.stringify(vc.component.editMemberCarInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMemberCarModal').modal('hide');
                            vc.emit('listOwnerCar', 'listOwnerCarData', {});
                            vc.emit('simplifyOwnerCar', 'listOwnerCarData', {});
                            vc.emit('listOwnerCarMember', 'listOwnerCarData', {});
                            vc.emit('carDetailMember', 'notify',{});
                            for (let key in $that.editMemberCarInfo) {
                                $that.editMemberCarInfo[key] = '';
                            }
                            vc.toast("修改成功");
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

        }
    });

})(window.vc);