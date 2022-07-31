(function (vc, vm) {

    vc.extends({
        data: {
            editTempCarFeeConfigInfo: {
                configId: '',
                feeName: '',
                paId: '',
                carType: '',
                ruleId: '',
                startTime: '',
                endTime: '',
                areaNum: '',
                rules: [],
                attrs: []
            }
        },
        _initMethod: function () {
            vc.initDate('editTempCarFeeConfigStartTime', function (_startTime) {
                $that.editTempCarFeeConfigInfo.startTime = _startTime;
            });
            vc.initDate('editTempCarFeeConfigEndTime', function (_endTime) {
                $that.editTempCarFeeConfigInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.editTempCarFeeConfigInfo.startTime))
                let end = Date.parse(new Date($that.editTempCarFeeConfigInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.editTempCarFeeConfigInfo.endTime = '';
                }
            });
        },
        _initEvent: function () {
            vc.on('editTempCarFeeConfig', 'openEditTempCarFeeConfigModal', function (_params) {
                vc.component.refreshEditTempCarFeeConfigInfo();
                vc.copyObject(_params, vc.component.editTempCarFeeConfigInfo);
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
                        },
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
                        },
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
                        },
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
                        },
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
                        },
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
                        },
                    ],
                    'editTempCarFeeConfigInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标准ID不能为空"
                        }]

                });
            },
            editTempCarFeeConfig: function () {
                if (!vc.component.editTempCarFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
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
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditTempCarFeeConfigInfo: function () {
                vc.component.editTempCarFeeConfigInfo = {
                    configId: '',
                    feeName: '',
                    paId: '',
                    carType: '',
                    ruleId: '',
                    startTime: '',
                    endTime: '',
                    areaNum: '',
                    rules: [],
                    attrs: []
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
                $that.editTempCarFeeConfigInfo.attrs.forEach(item => {
                    _attrs.forEach(attrItem =>{
                        if (item.specCd == attrItem.specId) {
                            item.specName = attrItem.specName;
                        }
                    })
                });
            }
        }
    });

})(window.vc, window.vc.component);
