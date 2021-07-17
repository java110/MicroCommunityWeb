(function (vc, vm) {

    vc.extends({
        data: {
            editAccountBondObjInfo: {
                bobjId: '',
                bondId: '',
                objId: '',
                receivableAmount: '',
                receivedAmount: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editAccountBondObj', 'openEditAccountBondObjModal', function (_params) {
                vc.component.refreshEditAccountBondObjInfo();
                $('#editAccountBondObjModel').modal('show');
                vc.copyObject(_params, vc.component.editAccountBondObjInfo);
                vc.component.editAccountBondObjInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editAccountBondObjValidate: function () {
                return vc.validate.validate({
                    editAccountBondObjInfo: vc.component.editAccountBondObjInfo
                }, {
                    'editAccountBondObjInfo.bondId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "保证金不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,20",
                            errInfo: "保证金名称超长了"
                        },
                    ],
                    'editAccountBondObjInfo.objId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "保证金对象ID不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "保证金金额格式有误"
                        },
                    ],
                    'editAccountBondObjInfo.receivableAmount': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "不是有效数字格式"
                        },
                    ],
                    'editAccountBondObjInfo.receivedAmount': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "不是有效数字格式"
                        },
                    ],
                    'editAccountBondObjInfo.bobjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "保证金对象ID不能为空"
                        }]

                });
            },
            editAccountBondObj: function () {
                if (!vc.component.editAccountBondObjValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/accountBondObj/updateAccountBondObj',
                    JSON.stringify(vc.component.editAccountBondObjInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAccountBondObjModel').modal('hide');
                            vc.emit('accountBondObjManage', 'listAccountBondObj', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditAccountBondObjInfo: function () {
                vc.component.editAccountBondObjInfo = {
                    bobjId: '',
                    bondId: '',
                    objId: '',
                    receivableAmount: '',
                    receivedAmount: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
