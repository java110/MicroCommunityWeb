(function(vc) {
    vc.extends({
        data: {
            prestoreAccountInfo: {
                tel: '',
                ownerId: '',
                owners: [],
                amount: '',
                remark: '',
                acctTypes: [],
                acctType: '2003',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('prestoreAccount', 'openAddModal', function() {
                $('#prestoreAccountModel').modal('show');
                //与字典表单位关联
                vc.getDict('account', "acct_type", function(_data) {
                    vc.component.prestoreAccountInfo.acctTypes = _data;
                });
            });

            vc.on('prestoreAccount', 'openAddModalWithParams', function(_param) {
                vc.component.prestoreAccountInfo.amount = _param.redepositAmount;
                $('#prestoreAccountModel').modal('show');
            });
        },
        methods: {
            prestoreAccountValidate() {
                return vc.validate.validate({
                    prestoreAccountInfo: vc.component.prestoreAccountInfo
                }, {
                    'prestoreAccountInfo.ownerId': [{
                        limit: "required",
                        param: "",
                        errInfo: "业主不能为空"
                    }],
                    'prestoreAccountInfo.amount': [{
                            limit: "required",
                            param: "",
                            errInfo: "金额不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "金额格式错误"
                        },
                    ],
                    'prestoreAccountInfo.acctType': [{
                        limit: "required",
                        param: "",
                        errInfo: "请选择账户类型"
                    }],
                    'prestoreAccountInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注长度不能超过200位"
                    }]
                });
            },
            savePrestoreAccountInfo: function() {
                if (!vc.component.prestoreAccountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.prestoreAccountInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/account/ownerPrestoreAccount',
                    JSON.stringify(vc.component.prestoreAccountInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#prestoreAccountModel').modal('hide');
                            vc.component.clearPrestoreAccountInfo();
                            vc.emit('accountManage', 'listshopAccount', {});
                            vc.toast('预存成功');
                            return;
                        }
                        vc.component.prestoreAccountInfo.errorInfo = json;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.prestoreAccountInfo.errorInfo = errInfo;
                    });
            },
            clearPrestoreAccountInfo: function() {
                vc.component.prestoreAccountInfo = {
                    tel: '',
                    ownerId: '',
                    owners: [],
                    amount: '',
                    remark: '',
                    acctTypes: [],
                    acctType: '2003',
                };
            },
            _changeTel: function() {
                var param = {
                        params: {
                            communityId: vc.getCurrentCommunity().communityId,
                            row: 50,
                            page: 1,
                            link: $that.prestoreAccountInfo.tel,
                            ownerTypeCd: '1001'
                        }
                    }
                    //发送get请求
                vc.http.get('listOwner',
                    'list',
                    param,
                    function(json, res) {
                        var listOwnerData = JSON.parse(json);
                        vc.component.prestoreAccountInfo.owners = listOwnerData.owners;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.prestoreAccountInfo.owners = [];
                    }
                );
            }
        }
    });
})(window.vc);