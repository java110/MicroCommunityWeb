(function (vc, vm) {

    vc.extends({
        data: {
            editReserveParamsInfo: {
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
            vc.initHourMinute('editReserveParamsStartTime', function (_value) {
                $that.editReserveParamsInfo.startTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('editReserveParams', 'openEditReserveParamsModal', function (_params) {
                vc.component.refreshEditReserveParamsInfo();
                $('#editReserveParamsModel').modal('show');
                vc.copyObject(_params, vc.component.editReserveParamsInfo);
                if ($that.editReserveParamsInfo.paramWay == '1') {
                    $that.editReserveParamsInfo.days = _params.paramWayText.split(',');
                } else {
                    $that.editReserveParamsInfo.workdays = _params.paramWayText.split(',');
                }
                vc.component.editReserveParamsInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editReserveParamsValidate: function () {
                return vc.validate.validate({
                    editReserveParamsInfo: vc.component.editReserveParamsInfo
                }, {
                    'editReserveParamsInfo.name': [
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
                    'editReserveParamsInfo.paramWay': [
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
                    'editReserveParamsInfo.paramWayText': [
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
                    'editReserveParamsInfo.startTime': [
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
                    'editReserveParamsInfo.maxQuantity': [
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
                    'editReserveParamsInfo.hoursMaxQuantity': [
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
                    'editReserveParamsInfo.paramsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "参数不能为空"
                        }]

                });
            },
            editReserveParams: function () {

                if ($that.editReserveParamsInfo.paramWay == '1') {
                    $that.editReserveParamsInfo.paramWayText = $that.editReserveParamsInfo.days.join(',');
                } else {
                    $that.editReserveParamsInfo.paramWayText = $that.editReserveParamsInfo.workdays.join(',');
                }

                if (!vc.component.editReserveParamsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }



                vc.http.apiPost(
                    '/reserve.updateReserveParams',
                    JSON.stringify(vc.component.editReserveParamsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReserveParamsModel').modal('hide');
                            vc.emit('reserveParamsManage', 'listReserveParams', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditReserveParamsInfo: function () {
                vc.component.editReserveParamsInfo = {
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
            _changeEditParamWay: function () {
                $that.editReserveParamsInfo.days = [];
                $that.editReserveParamsInfo.workdays = [];
                if ($that.editReserveParamsInfo.paramWay == '1') {
                    for (let _day = 1; _day < 32; _day++) {
                        $that.editReserveParamsInfo.days.push(_day);
                    }
                } else {
                    for (let _day = 1; _day < 8; _day++) {
                        $that.editReserveParamsInfo.workdays.push(_day);
                    }
                }
            },
        }
    });

})(window.vc, window.vc.component);
