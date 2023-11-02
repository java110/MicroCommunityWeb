(function (vc) {
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
                startTime: vc.dateFormat(new Date().getTime()),
                endTime: '2050-01-01',
                computingFormula: '',
                squarePrice: '',
                additionalAmount: '',
                feeTypeCds: [],
                computingFormulas: [],
                feeFlags: [],
                paymentCds: [],
                billTypes: [],
                billType: '002',
                paymentCycle: '',
                paymentCd: '1200',
                computingFormulaText: '',
                deductFrom: 'Y',
                payOnline: 'Y',
                scale: '1',
                decimalPlace: '2',
                units: '元',
                prepaymentPeriod: '1'
            }
        },
        _initMethod: function () {
            $that._initAddFeeConfigDateInfo();
            //与字典表费用类型关联
            vc.getDict('pay_fee_config', "fee_type_cd_show", function (_data) {
                $that.addFeeConfigInfo.feeTypeCds = _data;
            });
            //与字典表计算公式关联
            vc.getDict('pay_fee_config', "computing_formula", function (_data) {
                $that.addFeeConfigInfo.computingFormulas = _data;
            });
            //与字典表费用标识关联
            vc.getDict('pay_fee_config', 'fee_flag', function (_data) {
                $that.addFeeConfigInfo.feeFlags = _data;
            });
            //与字典表付费类型关联
            vc.getDict('pay_fee_config', 'payment_cd', function (_data) {
                $that.addFeeConfigInfo.paymentCds = _data;
            });
            //与字典表出账类型关联
            vc.getDict('pay_fee_config', 'bill_type', function (_data) {
                $that.addFeeConfigInfo.billTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addFeeConfig', 'openAddFeeConfigModal',
                function () {
                    $('#addFeeConfigModel').modal('show');
                });
        },
        methods: {
            _initAddFeeConfigDateInfo: function () {
                $('.addFeeConfigStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addFeeConfigStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addFeeConfigStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date($that.addFeeConfigInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("计费起始时间必须小于计费终止时间");
                            $(".addFeeConfigStartTime").val('');
                            $that.addFeeConfigInfo.startTime = "";
                        } else {
                            $that.addFeeConfigInfo.startTime = value;
                        }
                    });
                $('.addFeeConfigEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addFeeConfigEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addFeeConfigEndTime").val();
                        var start = Date.parse(new Date($that.addFeeConfigInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".addFeeConfigEndTime").val('');
                            $that.addFeeConfigInfo.endTime = "";
                        } else {
                            $that.addFeeConfigInfo.endTime = value;
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
                    addFeeConfigInfo: $that.addFeeConfigInfo
                }, {
                    'addFeeConfigInfo.feeTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用类型格式错误"
                        }
                    ],
                    'addFeeConfigInfo.feeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费项目不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "收费项目不能超过100位"
                        }
                    ],
                    'addFeeConfigInfo.feeFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用标识不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用类型格式错误"
                        }
                    ],
                    'addFeeConfigInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计费起始时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "计费起始时间不是有效的时间格式"
                        }
                    ],
                    'addFeeConfigInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计费终止时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "计费终止时间不是有效的时间格式"
                        }
                    ],
                    'addFeeConfigInfo.computingFormula': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计算公式不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "计算公式格式错误"
                        }
                    ],
                    'addFeeConfigInfo.squarePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计费单价不能为空"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "计费单价格式错误，如1.5000"
                        }
                    ],
                    'addFeeConfigInfo.additionalAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "附加费用不能为空"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "附加费用格式错误"
                        }
                    ],
                    'addFeeConfigInfo.billType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "出账类型不能为空"
                        }
                    ],
                    'addFeeConfigInfo.paymentCycle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费周期不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "缴费周期必须为数字 单位月"
                        }
                    ],
                    'addFeeConfigInfo.prepaymentPeriod': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预付期不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "预付期必须为数字 单位天"
                        }
                    ],
                    'addFeeConfigInfo.paymentCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "付费类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "付费类型格式错误"
                        }
                    ]
                });
            },
            saveFeeConfigInfo: function () {
                //固定费用
                if ($that.addFeeConfigInfo.computingFormula == '2002') {
                    $that.addFeeConfigInfo.squarePrice = "0.00";
                }
                //自定义费用
                if ($that.addFeeConfigInfo.computingFormula == '7007' ||
                    $that.addFeeConfigInfo.computingFormula == '4004' ||
                    $that.addFeeConfigInfo.computingFormula == '1101' ||
                    $that.addFeeConfigInfo.computingFormula == '1102' ||
                    $that.addFeeConfigInfo.computingFormula == '9009') {
                    $that.addFeeConfigInfo.squarePrice = "0.00";
                    $that.addFeeConfigInfo.additionalAmount = "0.00";
                }
                if ($that.addFeeConfigInfo.feeFlag == '2006012') {
                    $that.addFeeConfigInfo.paymentCycle = '1';
                }
                if (!$that.addFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if ($that.addFeeConfigInfo.paymentCd != '1200') { //如果不是预付费
                    $that.addFeeConfigInfo.prepaymentPeriod = '';
                }
                //收费项目去空
                $that.addFeeConfigInfo.feeName = $that.addFeeConfigInfo.feeName.trim();
                //缴费周期去空
                $that.addFeeConfigInfo.paymentCycle = $that.addFeeConfigInfo.paymentCycle.trim();
                //计费单价去空
                $that.addFeeConfigInfo.squarePrice = $that.addFeeConfigInfo.squarePrice.trim();
                //附加费用去空
                $that.addFeeConfigInfo.additionalAmount = $that.addFeeConfigInfo.additionalAmount.trim();
                $that.addFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, $that.addFeeConfigInfo);
                    $('#addFeeConfigModel').modal('hide');
                    return;
                }
                vc.http.apiPost('/feeConfig.saveFeeConfig', JSON.stringify($that.addFeeConfigInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeConfigModel').modal('hide');
                            $that.clearAddFeeConfigInfo();
                            vc.emit('feeConfigManage', 'listFeeConfig', {});
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
            clearAddFeeConfigInfo: function () {
                var _feeTypeCds = $that.addFeeConfigInfo.feeTypeCds;
                var _computingFormulas = $that.addFeeConfigInfo.computingFormulas;
                var _feeFlags = $that.addFeeConfigInfo.feeFlags;
                var _paymentCds = $that.addFeeConfigInfo.paymentCds;
                var _billTypes = $that.addFeeConfigInfo.billTypes;
                $that.addFeeConfigInfo = {
                    feeTypeCd: '',
                    feeName: '',
                    feeFlag: '',
                    startTime: vc.dateFormat(new Date().getTime()),
                    endTime: '2050-01-01',
                    computingFormula: '',
                    squarePrice: '',
                    additionalAmount: '',
                    feeTypeCds: _feeTypeCds,
                    computingFormulas: _computingFormulas,
                    feeFlags: _feeFlags,
                    paymentCds: _paymentCds,
                    billTypes: _billTypes,
                    billType: '002',
                    paymentCycle: '',
                    paymentCd: '1200',
                    computingFormulaText: '',
                    deductFrom: 'Y',
                    payOnline: 'Y',
                    scale: '1',
                    decimalPlace: '2',
                    units: '元',
                    prepaymentPeriod: '1'
                };
            },
            _changeAddFeeTypeCd: function () { // 主要为了解决有些盲测的小伙伴 乱设置的问题
                let _feeTypeCd = $that.addFeeConfigInfo.feeTypeCd;
                $that.addFeeConfigInfo.feeFlag = '';
                $that.addFeeConfigInfo.computingFormula = '';
                $that.addFeeConfigInfo.paymentCd = '1200';

                // todo 水费，电费和煤气费一般都是 一次性费用，推荐设置
                if (_feeTypeCd == '888800010015' || _feeTypeCd == '888800010016' || _feeTypeCd == '888800010009') {
                    $that.addFeeConfigInfo.feeFlag = '2006012';
                    $that.addFeeConfigInfo.computingFormula = '5005';
                    $that.addFeeConfigInfo.paymentCd = '2100';
                }

                 

                // todo 押金一般是一次性费用
                if (_feeTypeCd == '888800010006') {
                    $that.addFeeConfigInfo.feeFlag = '2006012';
                }
                // todo 取暖费一般是间接性费用
                if (_feeTypeCd == '888800010011') {
                    $that.addFeeConfigInfo.feeFlag = '4012024';
                    $that.addFeeConfigInfo.computingFormula = '3003';
                }
                //todo 物业费一般是周期性费用
                if (_feeTypeCd == '888800010001') {
                    $that.addFeeConfigInfo.feeFlag = '1003006';
                    $that.addFeeConfigInfo.computingFormula = '1001';
                }
                //todo 租金一般是周期性费用
                if (_feeTypeCd == '888800010018') {
                    $that.addFeeConfigInfo.feeFlag = '1003006';
                    $that.addFeeConfigInfo.computingFormula = '1101';
                }

                //todo 停车费一般为周期性费用
                if (_feeTypeCd == '888800010008') {
                    $that.addFeeConfigInfo.feeFlag = '1003006';
                    $that.addFeeConfigInfo.computingFormula = '2002';
                    $that.addFeeConfigInfo.paymentCycle = '1';
                }

                // todo 公摊费
                if (_feeTypeCd == '888800010017') {
                    $that.addFeeConfigInfo.feeFlag = '2006012';
                    $that.addFeeConfigInfo.computingFormula = '4004';
                    $that.addFeeConfigInfo.paymentCd = '2100';
                }

            }
        }
    });
})(window.vc);