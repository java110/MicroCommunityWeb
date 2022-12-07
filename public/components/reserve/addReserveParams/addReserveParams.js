(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReserveParamsInfo: {
                paramsId: '',
                name: '',
                paramWay: '',
                paramWayText: '',
                startTime: '',
                maxQuantity: '',
                hoursMaxQuantity: '',
                days:[],
                workdays:[]
            }
        },
        _initMethod: function () {
            vc.initHourMinute('addReserveParamsStartTime', function (_value) {
                $that.addReserveParamsInfo.startTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addReserveParams', 'openAddReserveParamsModal', function () {
                $('#addReserveParamsModel').modal('show');
            });
        },
        methods: {
            addReserveParamsValidate() {
                return vc.validate.validate({
                    addReserveParamsInfo: vc.component.addReserveParamsInfo
                }, {
                    'addReserveParamsInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "参数名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "参数名称不能超过128"
                        },
                    ],
                    'addReserveParamsInfo.paramWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "预约方式不能超过12"
                        },
                    ],
                    'addReserveParamsInfo.paramWayText': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约方式值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "预约方式值不能超过512"
                        },
                    ],
                    'addReserveParamsInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始预约时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "开始预约时间不能超过12"
                        },
                    ],
                    'addReserveParamsInfo.maxQuantity': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约次数不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "当天最大预约次数不能超过12"
                        },
                    ],
                    'addReserveParamsInfo.hoursMaxQuantity': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "同一次预约数量不能超过12"
                        },
                    ],

                });
            },
            saveReserveParamsInfo: function () {
                if ($that.addReserveParamsInfo.paramWay == '1') {
                    $that.addReserveParamsInfo.paramWayText = $that.addReserveParamsInfo.days.join(',');
                } else {
                    $that.addReserveParamsInfo.paramWayText = $that.addReserveParamsInfo.workdays.join(',');
                }
                if (!vc.component.addReserveParamsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addReserveParamsInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reserve.saveReserveParams',
                    JSON.stringify(vc.component.addReserveParamsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReserveParamsModel').modal('hide');
                            vc.component.clearAddReserveParamsInfo();
                            vc.emit('reserveParamsManage', 'listReserveParams', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddReserveParamsInfo: function () {
                vc.component.addReserveParamsInfo = {
                    name: '',
                    paramWay: '',
                    paramWayText: '',
                    startTime: '',
                    maxQuantity: '',
                    hoursMaxQuantity: '',
                    days:[],
                    workdays:[]
                };
            },
            _changeAddParamWay: function () {
                $that.addReserveParamsInfo.days = [];
                $that.addReserveParamsInfo.workdays = [];
                if ($that.addReserveParamsInfo.paramWay == '1') {
                    for (let _day = 1; _day < 32; _day++) {
                        $that.addReserveParamsInfo.days.push(_day);
                    }
                } else {
                    for (let _day = 1; _day < 8; _day++) {
                        $that.addReserveParamsInfo.workdays.push(_day);
                    }
                }
            },
        }
    });

})(window.vc);
