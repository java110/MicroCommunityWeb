(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeConfigInfo: {
                configId: '',
                feeTypeCd: '',
                feeName: '',
                feeFlag: '',
                startTime: '2010-01-01',
                endTime: '2050-01-01',
                computingFormula: '',
                squarePrice: '',
                additionalAmount: '',
                feeTypeCds: [],
                computingFormulas: [],
                feeFlags: [],
                paymentCds: [],
                billTypes: [],
                billType: '',
                paymentCycle: '',
                paymentCd: '',
                computingFormulaText: '',
                deductFrom: 'Y'
            }
        },
        _initMethod: function() {
            vc.component._initAddFeeConfigDateInfo();
            //与字典表费用类型关联
            vc.getDict('pay_fee_config', "fee_type_cd_show", function(_data) {
                vc.component.addFeeConfigInfo.feeTypeCds = _data;
            });
            //与字典表计算公式关联
            vc.getDict('pay_fee_config', "computing_formula", function(_data) {
                vc.component.addFeeConfigInfo.computingFormulas = _data;
            });
            //与字典表费用标识关联
            vc.getDict('pay_fee_config', 'fee_flag', function(_data) {
                vc.component.addFeeConfigInfo.feeFlags = _data;
            });
            //与字典表付费类型关联
            vc.getDict('pay_fee_config', 'payment_cd', function(_data) {
                vc.component.addFeeConfigInfo.paymentCds = _data;
            });
            //与字典表出账类型关联
            vc.getDict('pay_fee_config', 'bill_type', function(_data) {
                vc.component.addFeeConfigInfo.billTypes = _data;
            });
        },
        _initEvent: function() {
            vc.on('addFeeConfig', 'openAddFeeConfigModal',
                function() {
                    $('#addFeeConfigModel').modal('show');
                });
        },
        methods: {
            _initAddFeeConfigDateInfo: function() {
                vc.initDate('addFeeConfigStartTime', function(_value) {
                    vc.component.addFeeConfigInfo.startTime = _value;
                });
                vc.initDate('addFeeConfigEndTime', function(_value) {
                    var start = Date.parse(new Date(vc.component.addFeeConfigInfo.startTime))
                    var end = Date.parse(new Date(_value))
                    if (start - end >= 0) {
                        vc.toast("计费终止时间必须大于计费起始时间")
                        $(".addFeeConfigEndTime").val('')
                    } else {
                        vc.component.addFeeConfigInfo.endTime = _value;
                    }
                });
                //防止多次点击时间插件失去焦点
                document.getElementsByName('startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByName("endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addFeeConfigValidate() {
                return vc.validate.validate({
                    addFeeConfigInfo: vc.component.addFeeConfigInfo
                }, {
                    'addFeeConfigInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用类型格式错误"
                        },
                    ],
                    'addFeeConfigInfo.feeName': [{
                            limit: "required",
                            param: "",
                            errInfo: "收费项目不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "收费项目不能超过100位"
                        },
                    ],
                    'addFeeConfigInfo.feeFlag': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用标识不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用类型格式错误"
                        },
                    ],
                    'addFeeConfigInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "计费起始时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "计费起始时间不是有效的时间格式"
                        },
                    ],
                    'addFeeConfigInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "计费终止时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "计费终止时间不是有效的时间格式"
                        },
                    ],
                    'addFeeConfigInfo.computingFormula': [{
                            limit: "required",
                            param: "",
                            errInfo: "计算公式不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "计算公式格式错误"
                        },
                    ],
                    'addFeeConfigInfo.squarePrice': [{
                            limit: "required",
                            param: "",
                            errInfo: "计费单价不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "计费单价格式错误"
                        },
                    ],
                    'addFeeConfigInfo.additionalAmount': [{
                            limit: "required",
                            param: "",
                            errInfo: "附加费用不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "附加费用格式错误"
                        },
                    ],
                    'addFeeConfigInfo.billType': [{
                        limit: "required",
                        param: "",
                        errInfo: "出账类型不能为空"
                    }],
                    'addFeeConfigInfo.paymentCycle': [{
                            limit: "required",
                            param: "",
                            errInfo: "缴费周期不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "缴费周期必须为数字 单位月"
                        },
                    ],
                    'addFeeConfigInfo.paymentCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "付费类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "付费类型格式错误"
                        },
                    ]
                });
            },
            saveFeeConfigInfo: function() {

                //固定费用
                if (vc.component.addFeeConfigInfo.computingFormula == '2002') {
                    vc.component.addFeeConfigInfo.squarePrice = "0.00";
                }
                //自定义费用
                if (vc.component.addFeeConfigInfo.computingFormula == '7007' ||
                    vc.component.addFeeConfigInfo.computingFormula == '4004' ||
                    vc.component.addFeeConfigInfo.computingFormula == '1101' ||
                    vc.component.addFeeConfigInfo.computingFormula == '1102' ||
                    vc.component.addFeeConfigInfo.computingFormula == '9009') {
                    vc.component.addFeeConfigInfo.squarePrice = "0.00";
                    vc.component.addFeeConfigInfo.additionalAmount = "0.00";
                }
                if (vc.component.addFeeConfigInfo.feeFlag == '2006012') {
                    vc.component.addFeeConfigInfo.paymentCycle = '1';
                }
                //收费项目去空
                vc.component.addFeeConfigInfo.feeName = vc.component.addFeeConfigInfo.feeName.trim();
                //缴费周期去空
                vc.component.addFeeConfigInfo.paymentCycle = vc.component.addFeeConfigInfo.paymentCycle.trim();
                //计费单价去空
                vc.component.addFeeConfigInfo.squarePrice = vc.component.addFeeConfigInfo.squarePrice.trim();
                //附加费用去空
                vc.component.addFeeConfigInfo.additionalAmount = vc.component.addFeeConfigInfo.additionalAmount.trim();
                if (!vc.component.addFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeConfigInfo);
                    $('#addFeeConfigModel').modal('hide');
                    return;
                }
                vc.http.apiPost('/feeConfig.saveFeeConfig', JSON.stringify(vc.component.addFeeConfigInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeConfigModel').modal('hide');
                            vc.component.clearAddFeeConfigInfo();
                            vc.emit('feeConfigManage', 'listFeeConfig', {});
                            vc.toast("添加成功");
                            return;
                        }
                        vc.toast(_json.msg)
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeConfigInfo: function() {
                var _feeTypeCds = vc.component.addFeeConfigInfo.feeTypeCds;
                var _computingFormulas = vc.component.addFeeConfigInfo.computingFormulas;
                var _feeFlags = vc.component.addFeeConfigInfo.feeFlags;
                var _paymentCds = vc.component.addFeeConfigInfo.paymentCds;
                var _billTypes = vc.component.addFeeConfigInfo.billTypes;
                vc.component.addFeeConfigInfo = {
                    feeTypeCd: '',
                    feeName: '',
                    feeFlag: '',
                    startTime: '',
                    endTime: '',
                    computingFormula: '',
                    squarePrice: '',
                    additionalAmount: '',
                    feeTypeCds: _feeTypeCds,
                    computingFormulas: _computingFormulas,
                    feeFlags: _feeFlags,
                    paymentCds: _paymentCds,
                    billTypes: _billTypes,
                    billType: '',
                    paymentCycle: '',
                    paymentCd: '',
                    computingFormulaText: '',
                    deductFrom: 'Y'
                };
            }
        }
    });
})(window.vc);