(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addTempCarFeeConfigInfo: {
                configId: '',
                feeName: '',
                paId: '',
                carType: '',
                ruleId: '',
                startTime: '',
                endTime: '',
                rules: [],
                attrs: [],
                carTypes: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('temp_car_fee_config', "car_type", function (_data) {
                vc.component.addTempCarFeeConfigInfo.carTypes = _data;
            });
            vc.component._initAddTempCarFeeConfigDateInfo();
        },
        _initEvent: function () {
            vc.on('addTempCarFeeConfig', 'openAddTempCarFeeConfigModal', function () {
                $that._loadAddTempCarFeeRules();
                $('#addTempCarFeeConfigModel').modal('show');
            });
            $('#addTempCarFeeConfigModel').on('show.bs.modal', function (e) {
                $(this).css('display', 'block');
                let modalWidth = $(window).width() * 0.7;
                $(this).find('.modal-dialog').css({
                    'max-width': modalWidth
                });
            });
            vc.on('addTempCarFeeConfig', 'notify',
                function (_param) {
                    if (_param.hasOwnProperty('paId')) {
                        $that.addTempCarFeeConfigInfo.paId = _param.paId;
                    }
                });
        },
        methods: {
            _initAddTempCarFeeConfigDateInfo: function () {
                $('.addTempCarFeeConfigStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addTempCarFeeConfigStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addTempCarFeeConfigStartTime").val();
                        var start = Date.parse(new Date(value))
                        var end = Date.parse(new Date(vc.component.addTempCarFeeConfigInfo.endTime))
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".addTempCarFeeConfigStartTime").val('');
                            vc.component.addTempCarFeeConfigInfo.startTime = "";
                        } else {
                            vc.component.addTempCarFeeConfigInfo.startTime = value;
                        }
                    });
                $('.addTempCarFeeConfigEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addTempCarFeeConfigEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addTempCarFeeConfigEndTime").val();
                        var start = Date.parse(new Date(vc.component.addTempCarFeeConfigInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".addTempCarFeeConfigEndTime").val('');
                            vc.component.addTempCarFeeConfigInfo.endTime = "";
                        } else {
                            vc.component.addTempCarFeeConfigInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addTempCarFeeConfigStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addTempCarFeeConfigEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addTempCarFeeConfigValidate() {
                return vc.validate.validate({
                    addTempCarFeeConfigInfo: vc.component.addTempCarFeeConfigInfo
                }, {
                    'addTempCarFeeConfigInfo.feeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标准名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "标准名称格式错误"
                        }
                    ],
                    'addTempCarFeeConfigInfo.paId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "停车场错误"
                        }
                    ],
                    'addTempCarFeeConfigInfo.carType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车辆类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "车辆类型错误"
                        }
                    ],
                    'addTempCarFeeConfigInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费规则不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "收费规则错误"
                        }
                    ],
                    'addTempCarFeeConfigInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "开始时间错误"
                        }
                    ],
                    'addTempCarFeeConfigInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "结束时间错误"
                        }
                    ]
                });
            },
            saveTempCarFeeConfigInfo: function () {
                if (!vc.component.addTempCarFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                var decide = true;
                if (vc.component.addTempCarFeeConfigInfo.attrs && vc.component.addTempCarFeeConfigInfo.attrs.length > 0) {
                    for (var index = 0; index < vc.component.addTempCarFeeConfigInfo.attrs.length; index++) {
                        if (vc.component.addTempCarFeeConfigInfo.attrs[index].value == null || vc.component.addTempCarFeeConfigInfo.attrs[index].value == ""
                            || vc.component.addTempCarFeeConfigInfo.attrs[index].value == undefined) {
                            vc.toast(vc.component.addTempCarFeeConfigInfo.attrs[index].specName + "不能为空");
                            decide = false;
                            break;
                        }
                    }
                }
                if (!decide) {
                    return;
                }
                vc.component.addTempCarFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addTempCarFeeConfigInfo);
                    $('#addTempCarFeeConfigModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/fee.saveTempCarFeeConfig',
                    JSON.stringify(vc.component.addTempCarFeeConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addTempCarFeeConfigModel').modal('hide');
                            vc.component.clearAddTempCarFeeConfigInfo();
                            vc.emit('tempCarFeeConfigManage', 'listTempCarFeeConfig', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddTempCarFeeConfigInfo: function () {
                vc.component.addTempCarFeeConfigInfo = {
                    feeName: '',
                    paId: '',
                    carType: '',
                    ruleId: '',
                    startTime: '',
                    endTime: '',
                    rules: [],
                    attrs: []
                };
            },
            _loadAddTempCarFeeRules: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        token: '123'
                    }
                };
                //发送get请求
                vc.http.apiGet('/tempCarFee/queryTempCarFeeRules',
                    param,
                    function (json, res) {
                        let _feeDiscountManageInfo = JSON.parse(json);
                        $that.addTempCarFeeConfigInfo.rules = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeAddTempCarFeeConfigRule: function () {
                $that.addTempCarFeeConfigInfo.rules.forEach(item => {
                    if ($that.addTempCarFeeConfigInfo.ruleId == item.ruleId) {
                        item.tempCarFeeRuleSpecs.forEach(spec => {
                            spec.value = '';
                            spec.specCd = spec.specId;
                        })
                        $that.addTempCarFeeConfigInfo.attrs = item.tempCarFeeRuleSpecs;
                    }
                });
            }
        }
    });
})(window.vc);
