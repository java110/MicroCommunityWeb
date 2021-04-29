(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPayFeeConfigDiscountInfo: {
                configDiscountId: '',
                discountId: '',
                configId: '',
                discountType: '',
                discounts: [],
                startTime: '', // 新增开始时间
                endTime: '', // 结束时间
                payMaxEndTime: '', // 上次缴费最大时间
            }
        },
        _initMethod: function () {
            // 初始化方法（时间插件）
            vc.component._initAddPayFeeConfigDiscountDateInfo();
        },
        _initEvent: function () {
            vc.on('addPayFeeConfigDiscount', 'openAddPayFeeConfigDiscountModal', function (_param) {
                vc.copyObject(_param, $that.addPayFeeConfigDiscountInfo);
                $('#addPayFeeConfigDiscountModel').modal('show');
            });
        },
        methods: {
            // 新增初始化时间插件方法
            _initAddPayFeeConfigDiscountDateInfo: function () {
                // vc.component.addPayFeeConfigDiscountInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.addPayFeeConfigDiscountStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addPayFeeConfigDiscountStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addPayFeeConfigDiscountStartTime").val();
                        vc.component.addPayFeeConfigDiscountInfo.startTime = value;
                    });
                $('.addPayFeeConfigDiscountEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addPayFeeConfigDiscountEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addPayFeeConfigDiscountEndTime").val();
                        var start = Date.parse(new Date(vc.component.addPayFeeConfigDiscountInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".addPayFeeConfigDiscountEndTime").val('')
                        } else {
                            vc.component.addPayFeeConfigDiscountInfo.endTime = value;
                        }
                    });
                // 新增用于比较用户上次缴费时间字段
                $('.addPayFeeConfigDiscountPaymaxEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addPayFeeConfigDiscountPaymaxEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addPayFeeConfigDiscountPaymaxEndTime").val();
                        vc.component.addPayFeeConfigDiscountInfo.payMaxEndTime = value;
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

                document.getElementsByName("payMaxEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addPayFeeConfigDiscountValidate() {
                return vc.validate.validate({
                    addPayFeeConfigDiscountInfo: vc.component.addPayFeeConfigDiscountInfo
                }, {
                    'addPayFeeConfigDiscountInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用项不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用项格式错误"
                        },
                    ],
                    'addPayFeeConfigDiscountInfo.discountId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣名称不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "折扣格式错误"
                        },
                    ],
                    'addPayFeeConfigDiscountInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有效期起始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "有效期起始时间不是有效的时间格式"
                        },
                    ],
                    'addPayFeeConfigDiscountInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有效期终止时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "有效期终止时间不是有效的时间格式"
                        },
                    ]
                });
            },
            savePayFeeConfigDiscountInfo: function () {
                if (!vc.component.addPayFeeConfigDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addPayFeeConfigDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addPayFeeConfigDiscountInfo);
                    $('#addPayFeeConfigDiscountModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/payFeeConfigDiscount/savePayFeeConfigDiscount',
                    JSON.stringify(vc.component.addPayFeeConfigDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPayFeeConfigDiscountModel').modal('hide');
                            vc.component.clearAddPayFeeConfigDiscountInfo();
                            vc.emit('payFeeConfigDiscountManage', 'listPayFeeConfigDiscount', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddPayFeeConfigDiscountInfo: function () {
                vc.component.addPayFeeConfigDiscountInfo = {
                    configDiscountId: '',
                    discountId: '',
                    configId: '',
                    discountType: '',
                    discounts: []
                };
            },
            _changeAddPayFeeConfigDiscountType: function () {
                if ($that.addPayFeeConfigDiscountInfo.discountType == '') {
                    return;
                }
                $that.addPayFeeConfigDiscountInfo.discounts = [];
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        discountType: $that.addPayFeeConfigDiscountInfo.discountType
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscount',
                    param,
                    function (json, res) {
                        let _feeDiscountManageInfo = JSON.parse(json);
                        $that.addPayFeeConfigDiscountInfo.discounts = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
