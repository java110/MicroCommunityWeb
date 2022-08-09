/**
 权限组
 **/
(function(vc) {
    vc.extends({
        data: {
            editCarInfo: {
                carId: '',
                memberId: '',
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                remark: "",
                startTime: '',
                endTime: '',
                carNumType: ''
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
            vc.on('editCar', 'openEditCar', function(_carInfo) {
                vc.copyObject(_carInfo, $that.editCarInfo);
                /*if (_carInfo.startTime.indexOf(":") > -1) {
                    $that.editCarInfo.startTime = $that.editCarInfo.startTime.substring(0, 10);
                }
                if (_carInfo.endTime.indexOf(":") > -1) {
                    $that.editCarInfo.endTime = $that.editCarInfo.endTime.substring(0, 10);
                }*/
                $('#editCarModal').modal('show');
                vc.component._initEditCarDateInfo();
            });
        },
        methods: {
            editCarValidate: function() {
                return vc.validate.validate({
                    editCarInfo: vc.component.editCarInfo
                }, {

                    'editCarInfo.carNum': [{
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
                    'editCarInfo.carBrand': [{
                        limit: "maxLength",
                        param: "50",
                        errInfo: "车品牌超出限制"
                    }],
                    'editCarInfo.carType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车类型不能为空"
                    }],
                    'editCarInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "起租时间不能为空"
                    }],
                    'editCarInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结租时间不能为空"
                    }],
                    'editCarInfo.carColor': [{
                        limit: "maxLength",
                        param: "12",
                        errInfo: "车颜色超出限制"
                    }],
                    'editCarInfo.memberId': [{
                        limit: "required",
                        param: "",
                        errInfo: "车辆数据错误"
                    }],
                });
            },
            _submitEditCarInfo: function() {
                if (!vc.component.editCarValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editCarInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'owner.editOwnerCar',
                    JSON.stringify(vc.component.editCarInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCarModal').modal('hide');
                            vc.emit('listOwnerCar', 'listOwnerCarData', {});
                            vc.emit('simplifyOwnerCar', 'listOwnerCarData', {});
                            vc.emit('listOwnerCarMember', 'listOwnerCarData', {});
                            for (let key in $that.editCarInfo) {
                                $that.editCarInfo[key] = '';
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
            _initEditCarDateInfo: function() {
                //vc.component.editCarInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.editCarStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.editCarStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editCarStartTime").val();
                        vc.component.editCarInfo.startTime = value;
                    });
                $('.editCarEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editCarEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editCarEndTime").val();
                        var start = Date.parse(new Date(vc.component.editCarInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结租时间必须大于起租时间")
                            $(".editCarEndTime").val('')
                        } else {
                            vc.component.editCarInfo.endTime = value;
                        }
                    });
            },

        }
    });

})(window.vc);