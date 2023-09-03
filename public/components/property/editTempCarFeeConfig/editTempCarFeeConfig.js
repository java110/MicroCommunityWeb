(function (vc, vm) {
    vc.extends({
        data: {
            editTempCarFeeConfigInfo: {
                configId: '',
                feeConfigId: '',
                feeName: '',
                paId: '',
                carType: '',
                ruleId: '',
                startTime: '',
                endTime: '',
                areaNum: '',
                rules: [],
                attrs: [],
                carTypes: []
            }
        },
        _initMethod: function () {
            vc.component._initEditTempCarFeeConfigDateInfo();
        },
        _initEvent: function () {
            vc.on('editTempCarFeeConfig', 'openEditTempCarFeeConfigModal', function (_params) {
                vc.component.refreshEditTempCarFeeConfigInfo();
                vc.copyObject(_params, vc.component.editTempCarFeeConfigInfo);
                //与字典表关联
                vc.getDict('temp_car_fee_config', "car_type", function (_data) {
                    vc.component.editTempCarFeeConfigInfo.carTypes = _data;
                });
                $that.editTempCarFeeConfigInfo.attrs = _params.tempCarFeeConfigAttrs;
                $that.editTempCarFeeConfigInfo.startTime = vc.dateFormat($that.editTempCarFeeConfigInfo.startTime);
                $that.editTempCarFeeConfigInfo.endTime = vc.dateFormat($that.editTempCarFeeConfigInfo.endTime);
                $that._loadEditTempCarFeeRules();
                $('#editTempCarFeeConfigModel').modal('show');
                vc.component.editTempCarFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            $('#editTempCarFeeConfigModel').on('show.bs.modal', function (e) {
                $(this).css('display', 'block');
                let modalWidth = $(window).width() * 0.7;
                $(this).find('.modal-dialog').css({
                    'max-width': modalWidth
                });
            });
        },
        methods: {
            _initEditTempCarFeeConfigDateInfo: function () {
                $('.editTempCarFeeConfigStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editTempCarFeeConfigStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editTempCarFeeConfigStartTime").val();
                        var start = Date.parse(new Date(value))
                        var end = Date.parse(new Date(vc.component.editTempCarFeeConfigInfo.endTime))
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".editTempCarFeeConfigStartTime").val('');
                            vc.component.editTempCarFeeConfigInfo.startTime = "";
                        } else {
                            vc.component.editTempCarFeeConfigInfo.startTime = value;
                        }
                    });
                $('.editTempCarFeeConfigEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editTempCarFeeConfigEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editTempCarFeeConfigEndTime").val();
                        var start = Date.parse(new Date(vc.component.editTempCarFeeConfigInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".editTempCarFeeConfigEndTime").val('');
                            vc.component.editTempCarFeeConfigInfo.endTime = "";
                        } else {
                            vc.component.editTempCarFeeConfigInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editTempCarFeeConfigStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editTempCarFeeConfigEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editTempCarFeeConfigValidate: function () {
                return vc.validate.validate({
                    editTempCarFeeConfigInfo: vc.component.editTempCarFeeConfigInfo
                }, {
                    'editTempCarFeeConfigInfo.feeName': [
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
                    'editTempCarFeeConfigInfo.paId': [
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
                    'editTempCarFeeConfigInfo.carType': [
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
                    'editTempCarFeeConfigInfo.ruleId': [
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
                    'editTempCarFeeConfigInfo.startTime': [
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
                    'editTempCarFeeConfigInfo.endTime': [
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
                    ],
                    'editTempCarFeeConfigInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标准ID不能为空"
                        }
                    ]
                });
            },
            editTempCarFeeConfig: function () {
                if (!vc.component.editTempCarFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                var decide = true;
                if (vc.component.editTempCarFeeConfigInfo.attrs && vc.component.editTempCarFeeConfigInfo.attrs.length > 0) {
                    for (var index = 0; index < vc.component.editTempCarFeeConfigInfo.attrs.length; index++) {
                        if (vc.component.editTempCarFeeConfigInfo.attrs[index].value == null || vc.component.editTempCarFeeConfigInfo.attrs[index].value == ""
                            || vc.component.editTempCarFeeConfigInfo.attrs[index].value == undefined) {
                            vc.toast(vc.component.editTempCarFeeConfigInfo.attrs[index].specName + "不能为空");
                            decide = false;
                            break;
                        }
                    }
                }
                if (!decide) {
                    return;
                }
                if (vc.component.editTempCarFeeConfigInfo.startTime == null || vc.component.editTempCarFeeConfigInfo.startTime == ""
                    || vc.component.editTempCarFeeConfigInfo.startTime == undefined) {
                    vc.toast("开始时间不能为空");
                    return;
                }
                if (vc.component.editTempCarFeeConfigInfo.endTime == null || vc.component.editTempCarFeeConfigInfo.endTime == ""
                    || vc.component.editTempCarFeeConfigInfo.endTime == undefined) {
                    vc.toast("结束时间不能为空");
                    return;
                }
                vc.http.apiPost(
                    'fee.updateTempCarFeeConfig',
                    JSON.stringify(vc.component.editTempCarFeeConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editTempCarFeeConfigModel').modal('hide');
                            vc.emit('tempCarFeeConfigManage', 'listTempCarFeeConfig', {});
                            vc.toast("修改成功");
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
            refreshEditTempCarFeeConfigInfo: function () {
                vc.component.editTempCarFeeConfigInfo = {
                    configId: '',
                    feeConfigId: '',
                    feeName: '',
                    paId: '',
                    carType: '',
                    ruleId: '',
                    startTime: '',
                    endTime: '',
                    areaNum: '',
                    rules: [],
                    attrs: [],
                    carTypes: []
                }
            },
            _loadEditTempCarFeeRules: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        ruleId: $that.editTempCarFeeConfigInfo.ruleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/tempCarFee/queryTempCarFeeRules',
                    param,
                    function (json, res) {
                        let _feeDiscountManageInfo = JSON.parse(json);
                        $that.editTempCarFeeConfigInfo.rules = _feeDiscountManageInfo.data;
                        $that._freshCarFeeConfigRule($that.editTempCarFeeConfigInfo.rules[0].tempCarFeeRuleSpecs)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _freshCarFeeConfigRule: function (_attrs) {
                if ($that.editTempCarFeeConfigInfo.attrs && $that.editTempCarFeeConfigInfo.attrs.length > 0) {
                    $that.editTempCarFeeConfigInfo.attrs.forEach(item => {
                        _attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specId) {
                                item.specName = attrItem.specName;
                            }
                        })
                    });
                }
            }
        }
    });
})(window.vc, window.vc.component);
