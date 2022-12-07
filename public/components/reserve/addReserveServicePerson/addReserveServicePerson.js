(function (vc) {

    vc.extends({
        data: {
            addReserveServicePersonInfo: {
                goodsId: '',
                paramsId: '',
                personName: '',
                personTel: '',
                appointmentTime: '',
                receivableAmount: '',
                receivedAmount: '',
                payWay: '',
                state: 'S',
                remark: '',
                openTime: '',
                price: 0.0,
                hoursMaxQuantity:1,
                quantity:1,
                type:'2002',
                openTimes: [],
            }
        },
        _initMethod: function () {
            vc.initDate('appointmentTime', function (_value) {
                $that.addReserveServicePersonInfo.appointmentTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addReserveServicePerson', 'openAddReserveServicePersonModal', function (_param) {
                $that.clearAddReserveServicePersonInfo();
                vc.copyObject(_param, $that.addReserveServicePersonInfo);
                $that._computeMoney();
                $that._listReserveParamss();
                $('#addReserveServicePersonModel').modal('show');
            });
        },
        methods: {
            addReserveServicePersonValidate() {
                return vc.validate.validate({
                    addReserveServicePersonInfo: vc.component.addReserveServicePersonInfo
                }, {
                    'addReserveServicePersonInfo.goodsId': [{
                        limit: "required",
                        param: "",
                        errInfo: "商品不能为空"
                    },
                    ],
                    'addReserveServicePersonInfo.personName': [{
                        limit: "required",
                        param: "",
                        errInfo: "预约人不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "64",
                        errInfo: "预约人不能超过64"
                    },
                    ],
                    'addReserveServicePersonInfo.personTel': [{
                        limit: "required",
                        param: "",
                        errInfo: "预约电话不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "11",
                        errInfo: "预约电话不能超过11"
                    },
                    ],
                    'addReserveServicePersonInfo.appointmentTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "预约时间不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "64",
                        errInfo: "预约时间不能超过64"
                    },
                    ],
                    'addReserveServicePersonInfo.receivableAmount': [{
                        limit: "required",
                        param: "",
                        errInfo: "应收金额不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "10",
                        errInfo: "应收金额不能超过10"
                    },
                    ],
                    'addReserveServicePersonInfo.receivedAmount': [{
                        limit: "required",
                        param: "",
                        errInfo: "实收金额不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "10",
                        errInfo: "实收金额不能超过10"
                    },
                    ],
                    'addReserveServicePersonInfo.payWay': [{
                        limit: "required",
                        param: "",
                        errInfo: "支付方式不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "12",
                        errInfo: "支付方式不能超过12"
                    },
                    ],
                    'addReserveServicePersonInfo.state': [{
                        limit: "required",
                        param: "",
                        errInfo: "state不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "12",
                        errInfo: "state不能超过12"
                    },
                    ],
                    'addReserveServicePersonInfo.remark': [{
                        limit: "required",
                        param: "",
                        errInfo: "remark不能为空"
                    }
                    ],
                });
            },
            saveCommunitySpacePersonInfo: function () {
                if (!vc.component.addReserveServicePersonValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addReserveServicePersonInfo.communityId = vc.getCurrentCommunity().communityId;

                let _times = [{
                    hours:$that.addReserveServicePersonInfo.openTime,
                    quantity:$that.addReserveServicePersonInfo.quantity,
                }]
                vc.component.addReserveServicePersonInfo.times = _times;

                vc.http.apiPost(
                    '/reserveOrder.saveReserveGoodsOrder',
                    JSON.stringify(vc.component.addReserveServicePersonInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReserveServicePersonModel').modal('hide');
                            vc.component.clearAddReserveServicePersonInfo();
                            vc.emit('communitySpacePersonManage', 'listCommunitySpacePerson', {});
                            vc.emit('communitySpaceManage', 'listCommunitySpacePerson', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddReserveServicePersonInfo: function () {
                vc.component.addReserveServicePersonInfo = {
                    goodsId: '',
                    paramsId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    payWay: '',
                    state: 'S',
                    remark: '',
                    openTime: '',
                    price: 0.0,
                    hoursMaxQuantity:1,
                    quantity:1,
                    type:'2002',
                    openTimes: [],
                };
            },
            _listReserveParamss: function () {

                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        paramsId: $that.addReserveServicePersonInfo.paramsId
                    }
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveParams',
                    param,
                    function (json, res) {
                        let _reserveParamsManageInfo = JSON.parse(json);
                        vc.component.addReserveServicePersonInfo.openTimes = _reserveParamsManageInfo.data[0].openTimes;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeMoney:function(){
                let _money = parseFloat($that.addReserveServicePersonInfo.price) * parseFloat($that.addReserveServicePersonInfo.quantity);
                $that.addReserveServicePersonInfo.receivableAmount = _money.toFixed(2);
                $that.addReserveServicePersonInfo.receivedAmount = _money.toFixed(2);

            }

        }
    });

})(window.vc);