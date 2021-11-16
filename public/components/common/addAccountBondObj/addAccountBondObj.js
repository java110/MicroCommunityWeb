(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAccountBondObjInfo: {
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
            vc.on('addAccountBondObj', 'openAddAccountBondObjModal', function () {
                $('#addAccountBondObjModel').modal('show');
            });
        },
        methods: {
            addAccountBondObjValidate() {
                return vc.validate.validate({
                    addAccountBondObjInfo: vc.component.addAccountBondObjInfo
                }, {
                    'addAccountBondObjInfo.bondId': [
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
                    'addAccountBondObjInfo.objId': [
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
                    'addAccountBondObjInfo.receivableAmount': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "不是有效数字格式"
                        },
                    ],
                    'addAccountBondObjInfo.receivedAmount': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "不是有效数字格式"
                        },
                    ],




                });
            },
            saveAccountBondObjInfo: function () {
                if (!vc.component.addAccountBondObjValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAccountBondObjInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAccountBondObjInfo);
                    $('#addAccountBondObjModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/accountBondObj/saveAccountBondObj',
                    JSON.stringify(vc.component.addAccountBondObjInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAccountBondObjModel').modal('hide');
                            vc.component.clearAddAccountBondObjInfo();
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
            clearAddAccountBondObjInfo: function () {
                vc.component.addAccountBondObjInfo = {
                    bondId: '',
                    objId: '',
                    receivableAmount: '',
                    receivedAmount: '',

                };
            }
        }
    });

})(window.vc);
