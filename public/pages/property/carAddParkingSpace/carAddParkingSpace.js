/**
    入驻小区
**/
(function (vc) {
    vc.extends({
        data: {
            carAddParkingSpaceInfo: {
                carNum: '',
                remark: "",
                startTime: '',
                endTime: '',
                carId: '',
                communityId: vc.getCurrentCommunity().communityId,
                psId: ''
            }
        },
        _initMethod: function () {
            $that.carAddParkingSpaceInfo.carId = vc.getParam('carId');
            $that._loadCarInfo();
            $that._initDateInfo();
        },

        _initEvent: function () {
            vc.on("carAddParkingSpace", "notify", function (_info) {
                $that.carAddParkingSpaceInfo.psId = _info.psId;
            });
        },
        methods: {
            _initDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.carAddParkingSpaceInfo.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.carAddParkingSpaceInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结租时间必须大于起租时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.carAddParkingSpaceInfo.endTime = value;
                        }
                    });
            },
            _validate: function () {
                return vc.validate.validate({
                    carAddParkingSpaceInfo: vc.component.carAddParkingSpaceInfo
                }, {

                    'carAddParkingSpaceInfo.carNum': [
                        {
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
                    'carAddParkingSpaceInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "起租时间不能为空"
                        }
                    ],
                    'carAddParkingSpaceInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结租时间不能为空"
                        }
                    ],
                    'carAddParkingSpaceInfo.psId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车位不能为空"
                        }
                    ]
                });
            },

            _loadCarInfo: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        carId: $that.carAddParkingSpaceInfo.carId
                    }
                }

                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        let data = _json.data[0];
                        data.psId = '';
                        vc.copyObject(data, $that.carAddParkingSpaceInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _submit: function () {
                if (!$that._validate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'owner.carAddParkingSpace',
                    JSON.stringify($that.carAddParkingSpaceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            vc.toast("请记得收费哦！");
                            //关闭model
                            vc.jumpToPage("/admin.html#/pages/property/listOwnerCar");
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);