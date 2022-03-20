(function(vc, vm) {

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
                contractTypeSpecs: [],
                tempfile: '',
                contractFilePo: []
            }
        },
        _initMethod: function() {
            vc.initDateTime('editStartTime', function(_value) {
                $that.editContractInfo.startTime = _value;
            });
            vc.initDateTime('editEndTime', function(_value) {
                $that.editContractInfo.endTime = _value;
            });

            vc.initDateTime('editSigningTime', function(_value) {
                $that.editContractInfo.signingTime = _value;
            });

            $that._loadEditContractType();
        },
        _initEvent: function() {
            vc.on('editContract', 'openEditContractModal', function(_params) {
                vc.component.refreshEditContractInfo();
                $('#editContractModel').modal('show');
                vc.copyObject(_params, vc.component.editContractInfo);
                $that._loadContractType(_params);
                $that._loadFiles();
            });
            $('#editContractModel').on('show.bs.modal', function(e) {
                $(this).css('display', 'block');
                let modalWidth = $(window).width() * 0.7;
                $(this).find('.modal-dialog').css({
                    'max-width': modalWidth
                });
            });
        },
        methods: {
            editContractValidate: function() {
                return vc.validate.validate({
                    editContractInfo: vc.component.editContractInfo
                }, {
                    'editContractInfo.contractName': [{
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
                    'editContractInfo.contractCode': [{
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
                    'editContractInfo.contractType': [{
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
                    'editContractInfo.partyA': [{
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
                    'editContractInfo.partyB': [{
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
                    'editContractInfo.aContacts': [{
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
                    'editContractInfo.bContacts': [{
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
                    'editContractInfo.aLink': [{
                        limit: "required",
                        param: "",
                        errInfo: "甲方联系电话不能为空"
                    }],
                    'editContractInfo.bLink': [{
                        limit: "required",
                        param: "",
                        errInfo: "乙方联系电话不能为空"
                    }],
                    'editContractInfo.operator': [{
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
                    'editContractInfo.operatorLink': [{
                        limit: "required",
                        param: "",
                        errInfo: "联系电话不能为空"
                    }],
                    'editContractInfo.amount': [{
                        limit: "money",
                        param: "",
                        errInfo: "合同金额格式错误，如1.50"
                    }, ],
                    'editContractInfo.startTime': [{
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
                    'editContractInfo.endTime': [{
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
                    'editContractInfo.signingTime': [{
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
                    'editContractInfo.contractId': [{
                        limit: "required",
                        param: "",
                        errInfo: "合同ID不能为空"
                    }]

                });
            },
            editContract: function() {
                if (!vc.component.editContractValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/contract/updateContract',
                    JSON.stringify(vc.component.editContractInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editContractModel').modal('hide');
                            vc.emit('newContractManage', 'listContract', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditContractInfo: function() {
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
                    contractTypeSpecs: [],
                    tempfile: '',
                    contractFilePo: []
                }
            },
            _loadEditContractType: function() {
                let param = {
                        params: {
                            page: 1,
                            row: 100
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function(json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        vc.component.editContractInfo.contractTypes = _contractTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadContractType: function(_params) {
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
                    function(json, res) {
                        let _contractTypeSpecManageInfo = JSON.parse(json);
                        _contractTypeSpecManageInfo.data.forEach(item => {
                            _attrs.forEach(_attrItem => {
                                if (item.specCd == _attrItem.specCd) {
                                    item.value = _attrItem.value;
                                } else {
                                    item.value = '';
                                }

                            })
                            if (item.specShow == 'Y') {
                                item.values = [];
                                //$that._loadAttrValue(item.specCd, item.values);
                                $that.editContractInfo.contractTypeSpecs.push(item);
                            }
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadFiles: function() {
                let param = {
                        params: {
                            contractId: vc.component.editContractInfo.contractId,
                            page: 1,
                            row: 100
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/contractFile/queryContractFile',
                    param,
                    function(json, res) {
                        var _contractTFile = JSON.parse(json);
                        let _steps = [];
                        for (let stepIndex = 0; stepIndex < _contractTFile.data.length; stepIndex++) {
                            let _fileStep = _contractTFile.data[stepIndex];
                            let _step = {
                                seq: stepIndex,
                                fileSaveName: _fileStep.fileSaveName,
                                fileRealName: _fileStep.fileRealName
                            };
                            _steps.push(_step);
                        }
                        vc.component.editContractInfo.contractFilePo = _steps;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            addEditFileStep: function() {
                let _file = {
                    seq: $that.editContractInfo.contractFilePo.length,
                    fileSaveName: '',
                    fileRealName: ''
                }
                $that.editContractInfo.contractFilePo.push(_file);
            },
            deleteEditStep: function(_step) {
                for (var i = 0; i < $that.editContractInfo.contractFilePo.length; i++) {
                    if ($that.editContractInfo.contractFilePo[i].seq == _step.seq) {

                        $that.editContractInfo.contractFilePo.splice(i, 1);
                    }
                }
            },
            getEditFile: function(e, index) {
                vc.component.editContractInfo.tempfile = e.target.files[0];
                $that.editContractInfo.contractFilePo[index].fileRealName = vc.component.editContractInfo.tempfile.name;
                this._importEditData(index);
            },
            _importEditData: function(index) {
                // 导入数据
                if (!vc.component.checkFileType(vc.component.editContractInfo.tempfile.name.split('.')[1])) {
                    vc.toast('操作失败，请上传图片、PDF格式的文件');
                    return;
                }

                var param = new FormData();
                param.append("uploadFile", vc.component.editContractInfo.tempfile);
                vc.http.upload(
                    'importRoomFee',
                    'uploadContactFile',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            $that.editContractInfo.contractFilePo[index].fileSaveName = json;
                            vc.toast("上传成功");
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            checkEditFileType: function(fileType) {
                const acceptTypes = ['png', 'pdf', 'jpg'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            }

            ,

            _loadFilesddd: function(_data) {

                $that.workflowSettingInfo.describle = _data.describle;
                let _steps = [];
                if (!_data.hasOwnProperty("workflowSteps")) {
                    return;
                }



            },
        }
    });

})(window.vc, window.vc.component);