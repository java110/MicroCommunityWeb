(function (vc, vm) {

    vc.extends({
        data: {
            editContractInfo: {
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
                contractTypes: [],
                contractTypeSpecs: []

            }
        },
        _initMethod: function () {
            vc.initDateTime('editStartTime', function (_value) {
                $that.editContractInfo.startTime = _value;
            });
            vc.initDateTime('editEndTime', function (_value) {
                $that.editContractInfo.endTime = _value;
            });

            vc.initDateTime('editSigningTime', function (_value) {
                $that.editContractInfo.signingTime = _value;
            });

            $that._loadEditContractType();
        },
        _initEvent: function () {
            vc.on('editContract', 'openEditContractModal', function (_params) {
                vc.component.refreshEditContractInfo();
                $('#editContractModel').modal('show');
                vc.copyObject(_params, vc.component.editContractInfo);
                $that._loadContractType(_params);
            });
            $('#editContractModel').on('show.bs.modal', function (e) {
                $(this).css('display', 'block');
                let modalWidth = $(window).width() * 0.7;
                $(this).find('.modal-dialog').css({
                    'max-width': modalWidth
                });
            });
        },
        methods: {
            editContractValidate: function () {
                return vc.validate.validate({
                    editContractInfo: vc.component.editContractInfo
                }, {
                    'editContractInfo.contractName': [
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
                    'editContractInfo.contractCode': [
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
                    'editContractInfo.contractType': [
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
                    'editContractInfo.partyA': [
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
                    'editContractInfo.partyB': [
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
                    'editContractInfo.aContacts': [
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
                    'editContractInfo.bContacts': [
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
                    'editContractInfo.aLink': [
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
                    'editContractInfo.bLink': [
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
                    'editContractInfo.operator': [
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
                    'editContractInfo.operatorLink': [
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
                    'editContractInfo.amount': [
                        {
                            limit: "money",
                            param: "",
                            errInfo: "合同金额格式错误，如1.50"
                        },
                    ],
                    'editContractInfo.startTime': [
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
                    'editContractInfo.endTime': [
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
                    'editContractInfo.signingTime': [
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
                    'editContractInfo.contractId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同ID不能为空"
                        }]

                });
            },
            editContract: function () {
                if (!vc.component.editContractValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/contract/updateContract',
                    JSON.stringify(vc.component.editContractInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editContractModel').modal('hide');
                            vc.emit('contractManage', 'listContract', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditContractInfo: function () {
                let _contractTypes = $that.editContractInfo.contractTypes;
                vc.component.editContractInfo = {
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
                    contractTypes: _contractTypes,
                    contractTypeSpecs: []
                }
            },
            _loadEditContractType: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        vc.component.editContractInfo.contractTypes = _contractTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadContractType: function (_params) {
                let _attrs = _params.attrs;
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        contractTypeId: $that.editContractInfo.contractType
                    }
                }
                $that.editContractInfo.contractTypeSpecs = [];
                vc.http.apiGet('/contract/queryContractTypeSpec',
                    param,
                    function (json, res) {
                        let _contractTypeSpecManageInfo = JSON.parse(json);
                        _contractTypeSpecManageInfo.data.forEach(item => {
                            _attrs.forEach(_attrItem => {
                                if(item.specCd == _attrItem.specCd){
                                    item.value = _attrItem.value;
                                }else{
                                    item.value = '';
                                }
                               
                            })
                            if (item.specShow == 'Y') {
                                item.values = [];
                                //$that._loadAttrValue(item.specCd, item.values);
                                $that.editContractInfo.contractTypeSpecs.push(item);
                            }
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc, window.vc.component);
