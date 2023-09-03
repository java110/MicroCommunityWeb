(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPrestoreFeeInfo: {
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
            vc.on('addPrestoreFee', 'openAddPrestoreFeeModal', function () {
                $('#addPrestoreFeeModel').modal('show');
            });
        },
        methods: {
            addPrestoreFeeValidate() {
                return vc.validate.validate({
                    addPrestoreFeeInfo: vc.component.addPrestoreFeeInfo
                }, {
                    'addPrestoreFeeInfo.roomId': [
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
                    'addPrestoreFeeInfo.prestoreFeeType': [
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
                    'addPrestoreFeeInfo.prestoreFeeObjType': [
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
                    'addPrestoreFeeInfo.prestoreFeeAmount': [
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
                    'addPrestoreFeeInfo.state': [
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
                    'addPrestoreFeeInfo.remark': [
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




                });
            },
            savePrestoreFeeInfo: function () {
                if (!vc.component.addPrestoreFeeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addPrestoreFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addPrestoreFeeInfo);
                    $('#addPrestoreFeeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/prestoreFee/savePrestoreFee',
                    JSON.stringify(vc.component.addPrestoreFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPrestoreFeeModel').modal('hide');
                            vc.component.clearAddPrestoreFeeInfo();
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
            clearAddPrestoreFeeInfo: function () {
                vc.component.addPrestoreFeeInfo = {
                    roomId: '',
                    prestoreFeeType: '',
                    prestoreFeeObjType: '',
                    prestoreFeeAmount: '',
                    state: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
