(function(vc, vm) {

    vc.extends({
        data: {
            editFeeConfigInfo: {
                configId: '',
                feeTypeCd: '',
                feeName: '',
                feeFlag: '',
                startTime: '',
                endTime: '',
                computingFormula: '',
                squarePrice: '',
                additionalAmount: '0.00',
                isDefault:'',
                feeTypeCds:[],
                computingFormulas:[],
                billType:'',
                paymentCycle:'',
                paymentCd:''
            }
        },
        _initMethod: function() {
            vc.component._initEditFeeConfigDateInfo();
            vc.getDict('pay_fee_config',"fee_type_cd",function(_data){
                vc.component.editFeeConfigInfo.feeTypeCds = _data;
            });
            vc.getDict('pay_fee_config',"computing_formula",function(_data){
                vc.component.editFeeConfigInfo.computingFormulas = _data;
            });
        },
        _initEvent: function() {
            vc.on('editFeeConfig', 'openEditFeeConfigModal',
            function(_params) {
                vc.component.refreshEditFeeConfigInfo();
                $('#editFeeConfigModel').modal('show');
                vc.copyObject(_params, vc.component.editFeeConfigInfo);
                vc.component.editFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEditFeeConfigDateInfo: function () {
                vc.component.editFeeConfigInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.editFeeConfigStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.editFeeConfigStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeConfigStartTime").val();
                        vc.component.editFeeConfigInfo.startTime = value;
                    });
                $('.editFeeConfigEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeConfigEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeConfigEndTime").val();
                        var start=Date.parse(new Date(vc.component.editFeeConfigInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if(start-end>=0){
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".editFeeConfigEndTime").val('')
                        }else{
                            vc.component.editFeeConfigInfo.endTime = value;
                        }
                    });
            },
            editFeeConfigValidate: function() {
                return vc.validate.validate({
                    editFeeConfigInfo: vc.component.editFeeConfigInfo
                },
                {
                    'editFeeConfigInfo.feeTypeCd': [{
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
                    'editFeeConfigInfo.feeName': [{
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
                    'editFeeConfigInfo.feeFlag': [{
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
                    'editFeeConfigInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费起始时间不能为空"
                    },
                    {
                        limit: "dateTime",
                        param: "",
                        errInfo: "计费起始时间不是有效的时间格式"
                    },
                    ],
                    'editFeeConfigInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费终止时间不能为空"
                    },
                    {
                        limit: "dateTime",
                        param: "",
                        errInfo: "计费终止时间不是有效的时间格式"
                    },
                    ],
                    'editFeeConfigInfo.computingFormula': [{
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
                    'editFeeConfigInfo.squarePrice': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费单价不能为空"
                    },
                    {
                        limit: "moneyModulus",
                        param: "",
                        errInfo: "计费单价格式错误，如1.5000"
                    },
                    ],
                    'editFeeConfigInfo.additionalAmount': [{
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
                    'editFeeConfigInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项ID不能为空"
                    }],
                    'editFeeConfigInfo.billType': [{
                        limit: "required",
                        param: "",
                        errInfo: "出账类型不能为空"
                    }],
                    'editFeeConfigInfo.paymentCycle': [{
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
                    'editFeeConfigInfo.paymentCd': [{
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
            editFeeConfig: function() {
            //固定费用
                if(vc.component.editFeeConfigInfo.computingFormula == '2002'){
                   vc.component.editFeeConfigInfo.squarePrice = "0.00";
                }

                if(vc.component.editFeeConfigInfo.feeFlag == '2006012'){
                    vc.component.editFeeConfigInfo.paymentCycle = '1';
                }
                if (!vc.component.editFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.post('editFeeConfig', 'update', JSON.stringify(vc.component.editFeeConfigInfo), {
                    emulateJSON: true
                },
                function(json, res) {
                    //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                    if (res.status == 200) {
                        //关闭model
                        $('#editFeeConfigModel').modal('hide');
                        vc.emit('feeConfigManage', 'listFeeConfig', {});
                        return;
                    }
                    vc.toast(json);
                },
                function(errInfo, error) {
                    console.log('请求失败处理');

                    vc.toast(errInfo);
                });
            },
            refreshEditFeeConfigInfo: function() {
                var _feeTypeCds = vc.component.editFeeConfigInfo.feeTypeCds;
                var _computingFormulas = vc.component.editFeeConfigInfo.computingFormulas;
                vc.component.editFeeConfigInfo = {
                    configId: '',
                    feeTypeCd: '',
                    feeName: '',
                    feeFlag: '',
                    startTime: '',
                    endTime: '',
                    computingFormula: '',
                    squarePrice: '',
                    additionalAmount: '',
                    isDefault:'',
                    paymentCycle:'',
                    paymentCd:'',
                    billType:''
                };
                vc.component.editFeeConfigInfo.feeTypeCds = _feeTypeCds;
                vc.component.editFeeConfigInfo.computingFormulas = _computingFormulas;
            }
        }
    });

})(window.vc, window.vc.component);