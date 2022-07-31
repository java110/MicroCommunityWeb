(function (vc) {
    vc.extends({
        data: {
            selectFeeConfigInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                feeTypeCd: '',
                configId: '',
                configName:'',
                locationTypeCdName: '',
                startTime: '',
                endTime: '',
                computingFormula: '',
                amount: '',
                call:null,
            }
        },
        _initMethod: function () {
            $that._initSelectFeeConfigInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                var _datanew = [];
                _data.forEach((item, index) => {
                    if (item.statusCd != "888800010015" && item.statusCd != "888800010016") {
                        _datanew.push(item);
                    }
                });
                $that.selectFeeConfigInfo.feeTypeCds = _datanew;
            });
        },
        _initEvent: function () {
            vc.on('selectFeeConfig', 'openSelectFeeConfigModal',
                function (_room) {
                    $that.clearAddFeeConfigInfo();
                    vc.copyObject(_room,$that.selectFeeConfigInfo);
                    $('#selectFeeConfigModel').modal('show');
                });
        },
        methods: {
            _initSelectFeeConfigInfo: function () {

                vc.initDate('roomCreateFeeStartTime', function (_startTime) {
                    $that.selectFeeConfigInfo.startTime = _startTime;
                });
                vc.initDate('roomCreateFeeEndTime', function (_endTime) {
                    $that.selectFeeConfigInfo.endTime = _endTime;
                    let start = Date.parse(new Date($that.selectFeeConfigInfo.startTime))
                    let end = Date.parse(new Date($that.selectFeeConfigInfo.endTime))
                    if (start - end >= 0) {
                        vc.toast("结束时间必须大于开始时间")
                        $that.selectFeeConfigInfo.endTime = '';
                    }
                });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control roomCreateFeeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            selectFeeConfigValidate() {
                return vc.validate.validate({
                    selectFeeConfigInfo: $that.selectFeeConfigInfo
                }, {

                    'selectFeeConfigInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'selectFeeConfigInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项目不能为空"
                    }],
                    'selectFeeConfigInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费起始时间不能为空"
                    },
                    {
                        limit: "datetime",
                        param: "",
                        errInfo: "计费起始时间格式错误 YYYY-MM-DD hh:mm:ss"
                    }
                    ]
                });
            },
            saveRoomCreateFeeInfo: function () {
                if (!$that.selectFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.emit($that.selectFeeConfigInfo.call,'notifyFeeConfig',$that.selectFeeConfigInfo)
                $('#selectFeeConfigModel').modal('hide');

            },
            clearAddFeeConfigInfo: function () {
                var _feeTypeCds = $that.selectFeeConfigInfo.feeTypeCds;
                $that.selectFeeConfigInfo = {
                    feeTypeCds: _feeTypeCds,
                    feeConfigs: [],
                    feeTypeCd: '',
                    configId: '',
                    locationTypeCdName: '',
                    startTime: '',
                    endTime: '',
                    computingFormula: '',
                    amount: '',
                    call:null,
                };
                $that.selectFeeConfigInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCdX: function (_feeTypeCd) {
                $that.selectFeeConfigInfo.configId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: 'F',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.selectFeeConfigInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _selectFeeConfigIfOnceFee(_configId) {
                $that.selectFeeConfigInfo.endTime = '';
                $that.selectFeeConfigInfo.feeConfigs.forEach(item => {
                    if (_configId == item.configId) {
                        $that.selectFeeConfigInfo.feeName = item.feeName;
                        $that.selectFeeConfigInfo.feeFlag = item.feeFlag;
                        $that.selectFeeConfigInfo.computingFormula = item.computingFormula;
                        return;
                    }
                });
            }
        }
    });
})(window.vc);