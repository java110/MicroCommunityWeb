(function (vc) {
    vc.extends({
        data: {
            addChargeMonthOrderInfo: {
                orderId: '',
                cardId: '',
                personName: '',
                personTel: '',
                communityId: '',
                primeRate: '',
                receivableAmount: '',
                receivedAmount: '',
                startTime: '',
                endTime: '',
                remark: '',
                cards: [],
                primeRates: []
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                $that.addChargeMonthOrderInfo.primeRates = _data;
            });
        },
        _initEvent: function () {
            vc.on('addChargeMonthOrder', 'openAddChargeMonthOrderModal', function () {
                $that._listChargeMonthCards();
                $('#addChargeMonthOrderModel').modal('show');
            });
        },
        methods: {
            addChargeMonthOrderValidate() {
                return vc.validate.validate({
                    addChargeMonthOrderInfo: $that.addChargeMonthOrderInfo
                }, {
                    'addChargeMonthOrderInfo.personTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "充电电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "充电电话不能超过11"
                        }
                    ],
                    'addChargeMonthOrderInfo.primeRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "支付方式不能为空"
                        }
                    ],
                    'addChargeMonthOrderInfo.receivedAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "实收金额不能为空"
                        }
                    ],
                    'addChargeMonthOrderInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ]
                });
            },
            saveChargeMonthOrderInfo: function () {
                if (!$that.addChargeMonthOrderValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addChargeMonthOrderInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeCard.saveChargeMonthOrder',
                    JSON.stringify($that.addChargeMonthOrderInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChargeMonthOrderModel').modal('hide');
                            $that.clearAddChargeMonthOrderInfo();
                            vc.emit('chargeMonthOrderManage', 'listChargeMonthOrder', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddChargeMonthOrderInfo: function () {
                let _primeRates = $that.addChargeMonthOrderInfo.primeRates;
                $that.addChargeMonthOrderInfo = {
                    cardId: '',
                    personName: '',
                    personTel: '',
                    communityId: '',
                    primeRate: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    cards: [],
                    primeRates: _primeRates
                };
            },
            _listChargeMonthCards: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/chargeCard.listChargeMonthCard',
                    param,
                    function (json, res) {
                        let _chargeMonthCardManageInfo = JSON.parse(json);
                        $that.addChargeMonthOrderInfo.cards = _chargeMonthCardManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeCard: function () {
                $that.addChargeMonthOrderInfo.cards.forEach(item => {
                    if (item.cardId == item.cardId) {
                        $that.addChargeMonthOrderInfo.receivedAmount = item.cardPrice;
                    }
                });
            }
        }
    });
})(window.vc);