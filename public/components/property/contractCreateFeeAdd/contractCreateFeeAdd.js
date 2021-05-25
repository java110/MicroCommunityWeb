(function (vc) {
    vc.extends({
        data: {
            contractCreateFeeAddInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                contractId: '',
                feeTypeCd: '',
                configId: '',
                contractState: ['2001'],
                isMore: false,
                startTime: '',
                feeFlag: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            $that._initContractCreateFeeAddInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                var _datanew = [];
                _data.forEach((item, index) => {
                    if (item.statusCd != "888800010015" && item.statusCd != "888800010016") {
                        _datanew.push(item);
                    }
                });
                $that.contractCreateFeeAddInfo.feeTypeCds = _datanew;
            });
        },
        _initEvent: function () {
            vc.on('contractCreateFeeAdd', 'openContractCreateFeeAddModal',
                function (_room) {
                    $that.contractCreateFeeAddInfo.isMore = _room.isMore;
                    if(_room.contract != null && _room.contract != undefined){
                        $that.contractCreateFeeAddInfo.contractId = _room.contract.contractId;
                    }
                    $('#contractCreateFeeAddModel').modal('show');
                });
        },
        methods: {
            _initContractCreateFeeAddInfo: function () {

                vc.initDate('contractCreateFeeStartTime', function (_startTime) {
                    $that.contractCreateFeeAddInfo.startTime = _startTime;
                });
                vc.initDate('contractCreateFeeEndTime', function (_endTime) {
                    $that.contractCreateFeeAddInfo.endTime = _endTime;
                    let start = Date.parse(new Date($that.contractCreateFeeAddInfo.startTime))
                    let end = Date.parse(new Date($that.contractCreateFeeAddInfo.endTime))
                    if (start - end >= 0) {
                        vc.toast("结束时间必须大于开始时间")
                        $that.contractCreateFeeAddInfo.endTime = '';
                    }
                });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control contractCreateFeeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            contractCreateFeeAddValidate() {
                return vc.validate.validate({
                    contractCreateFeeAddInfo: $that.contractCreateFeeAddInfo
                },
                    {
                        'contractCreateFeeAddInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }],
                        'contractCreateFeeAddInfo.configId': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用项目不能为空"
                        }],
                        'contractCreateFeeAddInfo.contractState': [{
                            limit: "required",
                            param: "",
                            errInfo: "合同状态不能为空"
                        }],
                        'contractCreateFeeAddInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "计费起始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "计费起始时间格式错误 YYYY-MM-DD hh:mm:ss"
                        }]
                    });
            },
            saveContractCreateFeeInfo: function () {
                $that.contractCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!$that.contractCreateFeeAddValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.contractCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                let _contractCreateFeeAddInfo = JSON.parse(JSON.stringify($that.contractCreateFeeAddInfo));

                _contractCreateFeeAddInfo.contractState = _contractCreateFeeAddInfo.contractState.join(',');
                vc.http.apiPost('/fee.saveContractCreateFee',
                    JSON.stringify(_contractCreateFeeAddInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            var _json = JSON.parse(json);
                            $('#contractCreateFeeAddModel').modal('hide');
                            $that.clearAddFeeConfigInfo();
                            vc.toast("创建收费成功，总共[" + _json.totalRoom + "]合同，成功[" + _json.successRoom + "],失败[" + _json.errorRoom + "]", 8000);
                            vc.emit('listContractFee', 'notify', {});
                            vc.emit('simplifyContractFee', 'notify', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeConfigInfo: function () {
                var _feeTypeCds = $that.contractCreateFeeAddInfo.feeTypeCds;
                $that.contractCreateFeeAddInfo = {
                    feeTypeCds: [],
                    feeConfigs: [],
                    contractId: '',
                    feeTypeCd: '',
                    configId: '',
                    contractState: ['2001'],
                    isMore: false,
                    startTime: '',
                    feeFlag: '',
                    endTime: ''
                };
                $that.contractCreateFeeAddInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCdX: function (_feeTypeCd) {
                $that.contractCreateFeeAddInfo.configId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 50,
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
                        $that.contractCreateFeeAddInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _createFeeAddChangeRoomType: function () {
                if ($that.contractCreateFeeAddInfo.roomType == '1010301') {
                    $that.contractCreateFeeAddInfo.contractState = ['2001'];
                } else {
                    $that.contractCreateFeeAddInfo.contractState = ['2006'];
                }
            },
            _changeFeeLayer: function () {
                let _feeLayer = $that.contractCreateFeeAddInfo.feeLayer;
                if (_feeLayer == '全部') {
                    $that.contractCreateFeeAddInfo.feeLayer = ''
                } else {
                    $that.contractCreateFeeAddInfo.feeLayer = '全部'
                }
            },
            _contractCreateFeeAddIfOnceFee(_configId) {
                $that.contractCreateFeeAddInfo.endTime = '';
                $that.contractCreateFeeAddInfo.feeConfigs.forEach(item => {
                    if (_configId == item.configId) {
                        $that.contractCreateFeeAddInfo.feeFlag = item.feeFlag;
                        return;
                    }
                });
            }
        }
    });
})(window.vc);