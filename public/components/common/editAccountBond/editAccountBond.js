(function(vc, vm) {

    vc.extends({
        data: {
            editAccountBondInfo: {
                bondId: '',
                bondName: '',
                amount: '',
                bondMonth: '',
                bondType: '6006',
                objId: '',
                remark: ''

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editAccountBond', 'openEditAccountBondModal', function(_params) {
                vc.component.refreshEditAccountBondInfo();
                $('#editAccountBondModel').modal('show');
                vc.copyObject(_params, vc.component.editAccountBondInfo);
            });
        },
        methods: {
            editAccountBondValidate: function() {
                return vc.validate.validate({
                    editAccountBondInfo: vc.component.editAccountBondInfo
                }, {
                    'editAccountBondInfo.bondName': [{
                            limit: "required",
                            param: "",
                            errInfo: "保证金名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,20",
                            errInfo: "保证金名称超长了"
                        },
                    ],
                    'editAccountBondInfo.amount': [{
                            limit: "required",
                            param: "",
                            errInfo: "保证金金额不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,10",
                            errInfo: "保证金金额格式有误"
                        },
                    ],
                    'editAccountBondInfo.bondMonth': [{
                        limit: "num",
                        param: "",
                        errInfo: "有效月份格式错误"
                    }, ],
                    'editAccountBondInfo.objId': [{
                        limit: "maxin",
                        param: "1,30",
                        errInfo: "类型ID超长了"
                    }, ],
                    'editAccountBondInfo.bondId': [{
                        limit: "required",
                        param: "",
                        errInfo: "保证金ID不能为空"
                    }]

                });
            },
            editAccountBond: function() {
                if (!vc.component.editAccountBondValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/accountBond/updateAccountBond',
                    JSON.stringify(vc.component.editAccountBondInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAccountBondModel').modal('hide');
                            vc.emit('accountBondManage', 'listAccountBond', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditAccountBondInfo: function() {
                vc.component.editAccountBondInfo = {
                    bondId: '',
                    bondName: '',
                    amount: '',
                    bondMonth: '',
                    bondType: '6006',
                    objId: '',
                    remark: ''

                }
            }
        }
    });

})(window.vc, window.vc.component);