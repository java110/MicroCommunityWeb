(function (vc) {
    vc.extends({
        data: {
            editFeeRuleInfo: {
                ruleId: '',
                maxTime: '',
                curYearMonth: '',
                oldCurYearMonth: '',
            
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
            vc.on('editFeeRule', 'openEditFeeRuleModal',
                function (_fee) {
                    $that._initEditFeeRuleDateInfo();
                    $that.clearEditFeeRuleInfoData();
                    vc.copyObject(_fee, $that.editFeeRuleInfo);
                    $that.editFeeRuleInfo.oldCurYearMonth = _fee.curYearMonth;
                    $('#editFeeRuleModel').modal('show');
                });
        },
        methods: {
            _initEditFeeRuleDateInfo: function () {
                vc.initDate('editMaxTime',function(_value){
                        $that.editFeeRuleInfo.maxTime = _value;
                });
                vc.initDate('editCurYearMonth',function(_value){
                    let start = Date.parse(new Date($that.editFeeRuleInfo.oldCurYearMonth))
                    let end = Date.parse(new Date(_value))
                    if (start - end >= 0) {
                        vc.toast("账单日应大于"+$that.editFeeRuleInfo.oldCurYearMonth);
                        $(".editCurYearMonth").val('');
                        $that.editFeeRuleInfo.curYearMonth = "";
                    } else {
                        $that.editFeeRuleInfo.curYearMonth = _value;
                    }
                })
            },
            editFeeRuleValidate() {
                return vc.validate.validate({
                    editFeeRuleInfo: $that.editFeeRuleInfo
                }, {
                    'editFeeRuleInfo.maxTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "账单结束时间不能为空"
                    }],
                    'editFeeRuleInfo.curYearMonth': [{
                        limit: "required",
                        param: "",
                        errInfo: "账单日不能为空"
                    }]
                });
            },
            _doEidtFee: function () {
                if (!$that.editFeeRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editFeeRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost('/payFeeRule.updatePayFeeRule', JSON.stringify($that.editFeeRuleInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeRuleModel').modal('hide');
                            $that.clearEditFeeRuleInfoData();
                            vc.emit('feeDetailFeeRule', 'notify', {});
                          
                            vc.toast("操作成功");
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
            clearEditFeeRuleInfoData: function () {
                $that.editFeeRuleInfo = {
                    ruleId: '',
                    maxTime: '',
                    curYearMonth: '',
                    oldCurYearMonth: '',
                
                };
            }
        }
    });
})(window.vc);