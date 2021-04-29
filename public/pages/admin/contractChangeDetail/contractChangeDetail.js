/**
    合同信息 组件
**/
(function (vc) {

    vc.extends({

        data: {
            contractChangeDetailInfo: {
                contractId: '',
                contractName: '',
                contractCode: '',
                contractType: '',
                partyA: '',
                partyB: '',
                aContacts: '',
                bContacts: '',
                aLink: '',
                bLink: '',
                operator: '',
                operatorLink: '',
                amount: '',
                startTime: '',
                endTime: '',
                signingTime: '',
                param: '',
                planType: '',
                rooms:[]

            },
            newContract: {
                changeRemark: ''
            }
        },
        _initMethod: function () {
            let param = vc.getParam('param');

            $that.contractChangeDetailInfo.param = param;
        },
        _initEvent: function () {
            vc.on('contractChangeDetailInfo', 'chooseContract', function (_app) {
                vc.copyObject(_app, vc.component.contractChangeDetailInfo);
                if($that.contractChangeDetailInfo.param == 'contractChangeAssets'){
                    vc.emit('contractChangeAssets','contractInfo',vc.component.contractChangeDetailInfo);
                }
            });
            vc.on('contractChangeDetailInfo', 'notice', function (item) {
                let _changeRemark = $that.newContract.changeRemark;
                $that.newContract = vc.deepClone($that.contractChangeDetailInfo);
                $that.newContract.changeRemark = _changeRemark;
                if(item.hasOwnProperty('rooms')){
                    $that.newContract.rooms = item.rooms;
                }
                vc.copyObject(item, $that.newContract);
            });

        },
        methods: {

            _openSelectContractInfoModel() {
                vc.emit('chooseContract', 'openChooseContractModel', {});
            },
            addContractChangeValidate() {
                return vc.validate.validate({
                    newContract: vc.component.newContract
                }, {
                    'newContract.contractName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "合同名称不能超过64位"
                        },
                    ],
                    'newContract.contractCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "合同编号错误"
                        },
                    ],
                    'newContract.contractType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "合同类型格式错误"
                        },
                    ],
                    'newContract.partyA': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "甲方名称太长"
                        },
                    ],
                    'newContract.partyB': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "乙方名称太长"
                        },
                    ],
                    'newContract.aContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "甲方联系人长度超过64位"
                        },
                    ],
                    'newContract.bContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "甲方联系人长度超过64位"
                        },
                    ],
                    'newContract.aLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "甲方联系电话错误"
                        },
                    ],
                    'newContract.bLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "乙方联系电话错误"
                        },
                    ],
                    'newContract.operator': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "经办人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "经办人超过64位"
                        },
                    ],
                    'newContract.operatorLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "经办人联系电话格式错误"
                        },
                    ],
                    'newContract.amount': [
                        {
                            limit: "money",
                            param: "",
                            errInfo: "合同金额格式错误，如1.50"
                        },
                    ],
                    'newContract.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同开始时间格式错误"
                        },
                    ],
                    'newContract.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同结束时间格式错误"
                        },
                    ],
                    'newContract.signingTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "签订时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同签订时间格式错误"
                        },
                    ],
                    'newContract.changeRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "变更原因不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1000",
                            errInfo: "变更原因太长"
                        },
                    ]


                });
            },
            _submitChangeContract: function () {
                if (!vc.component.addContractChangeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/contract/saveContractChangePlan',
                    JSON.stringify($that.newContract),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.toast("提交成功")
                            vc.goBack();
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });

})(window.vc);
