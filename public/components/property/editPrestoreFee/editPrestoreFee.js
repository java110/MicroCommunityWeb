(function (vc, vm) {

    vc.extends({
        data: {
            editPrestoreFeeInfo: {
                prestoreFeeId: '',
                roomId: '',
                prestoreFeeType: '',
                prestoreFeeObjType: '',
                prestoreFeeAmount: '',
                state: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editPrestoreFee', 'openEditPrestoreFeeModal', function (_params) {
                vc.component.refreshEditPrestoreFeeInfo();
                $('#editPrestoreFeeModel').modal('show');
                vc.copyObject(_params, vc.component.editPrestoreFeeInfo);
                vc.component.editPrestoreFeeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editPrestoreFeeValidate: function () {
                return vc.validate.validate({
                    editPrestoreFeeInfo: vc.component.editPrestoreFeeInfo
                }, {
                    'editPrestoreFeeInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "标题太长 超过100位"
                        },
                    ],
                    'editPrestoreFeeInfo.prestoreFeeType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预付类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editPrestoreFeeInfo.prestoreFeeObjType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预存对象类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "预存对象类型格式错误"
                        },
                    ],
                    'editPrestoreFeeInfo.prestoreFeeAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预付金额不能为空"
                        },
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预付金额格式错误"
                        },
                    ],
                    'editPrestoreFeeInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "8",
                            errInfo: "状态格式错误"
                        },
                    ],
                    'editPrestoreFeeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "备注格式错误"
                        },
                    ],
                    'editPrestoreFeeInfo.prestoreFeeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预付费用ID不能为空"
                        }]

                });
            },
            editPrestoreFee: function () {
                if (!vc.component.editPrestoreFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/prestoreFee/updatePrestoreFee',
                    JSON.stringify(vc.component.editPrestoreFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPrestoreFeeModel').modal('hide');
                            vc.emit('prestoreFeeManage', 'listPrestoreFee', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditPrestoreFeeInfo: function () {
                vc.component.editPrestoreFeeInfo = {
                    prestoreFeeId: '',
                    roomId: '',
                    prestoreFeeType: '',
                    prestoreFeeObjType: '',
                    prestoreFeeAmount: '',
                    state: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
