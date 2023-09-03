/**
 权限组
 **/
(function(vc) {
    vc.extends({
        propTypes: {
            callBackComponent: vc.propTypes.string,
            callBackFunction: vc.propTypes.string
        },
        data: {
            addCarInfo: {
                flowComponent: 'addCar',
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                remark: "",
                startTime: '',
                endTime: '',
                leaseType: '',
                carAttrs: '',
                attrs: [],
                value: ''
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
        watch: {
            addCarInfo: {
                deep: true,
                handler: function() {
                    vc.component.saveAddCarInfo();
                }
            }
        },
        _initMethod: function() {

            vc.getDict('owner_car', "car_type", function(_data) {
                vc.component.carTypes = _data;
            });
            vc.component._initDateInfo();
            $that._loadCarAttrSpec();
            // vc.component._listCarAttrs();
        },
        _initEvent: function() {
            vc.on('addCar', 'onIndex', function(_index) {
                vc.component.addCarInfo.index = _index;
            });
            vc.on('addCar', 'showErrMsg', function() {
                vc.component.saveAddCarInfo();
            });
        },
        methods: {
            addCarValidate: function() {
                return vc.validate.validate({
                    addCarInfo: vc.component.addCarInfo
                }, {

                    'addCarInfo.carNum': [{
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        }
                    ],
                    'addCarInfo.carBrand': [{
                        limit: "maxLength",
                        param: "50",
                        errInfo: "车品牌超出限制"
                    }],

                    'addCarInfo.carType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车类型不能为空"
                    }],
                    'addCarInfo.leaseType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车牌类型不能为空"
                    }],
                    //                    'addCarInfo.value': [{
                    //                        limit: "required",
                    //                        param: "",
                    //                        errInfo: "是否是预约车不能为空"
                    //                    }],
                    'addCarInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "起租时间不能为空"
                    }],
                    'addCarInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结租时间不能为空"
                    }],
                    'addCarInfo.carColor': [{
                        limit: "maxLength",
                        param: "12",
                        errInfo: "车颜色超出限制"
                    }]
                });
            },
            _loadCarAttrSpec: function() {
                $that.addCarInfo.attrs = [];
                vc.getAttrSpec('owner_car_attr', function(data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addCarInfo.attrs.push(item);
                        }
                        console.log('attrs : ', $that.addCarInfo.attrs);
                    });
                });
            },
            _loadAttrValue: function(_specCd, _values) {
                vc.getAttrValue(_specCd, function(data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                });
            },
            saveAddCarInfo: function() {
                let _leaseType = $that.addCarInfo.leaseType;
                if (_leaseType != 'H') {
                    $that.addCarInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                    $that.addCarInfo.endTime = '2037-01-01';
                }
                // 验证attr必填项
                let msg = '';
                vc.component.addCarInfo.attrs.forEach((item) => {
                    if (item.required == 'Y' && item.value == "") {
                        msg = item.specHoldplace;
                    }
                })
                if (msg) {
                    return;
                }
                if (vc.component.addCarValidate()) {
                    //侦听回传
                    vc.emit($props.callBackComponent, $props.callBackFunction, vc.component.addCarInfo);
                    return;
                }else{
                    if(vc.component.addCarInfo.index && vc.component.addCarInfo.index == 2){
                        vc.emit($props.callBackComponent, $props.callBackFunction, null);
                        vc.toast(vc.validate.errInfo);
                    }
                }
            },
            _initDateInfo: function() {
                // vc.component.addCarInfo.startTime = vc.dateFormat(new Date().getTime());
                $('.startTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".startTime").val();
                        vc.component.addCarInfo.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.addCarInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结租时间必须大于起租时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.addCarInfo.endTime = value;
                        }
                    });
            },
            // 查询repair_types
            // _listCarAttrs: function (_page, _rows) {
            //     var param = {
            //         params: {
            //             page: 1,
            //             row: 10,
            //             specCd: "6443000036"
            //         }
            //     };
            //     //发送get请求
            //     vc.http.apiGet('/attrValue/queryAttrValue',
            //         param,
            //         function (json, res) {
            //             var _carAttrInfo = JSON.parse(json);
            //             vc.component.addCarInfo.carAttrs = _carAttrInfo.data;
            //         }, function (errInfo, error) {
            //             console.log('请求失败处理');
            //         }
            //     );
            // },
        }
    });
})(window.vc);