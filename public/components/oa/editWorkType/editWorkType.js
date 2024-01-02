(function (vc, vm) {

    vc.extends({
        data: {
            editWorkTypeInfo: {
                wtId: '',
                typeName: '',
                smsWay: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editWorkType', 'openEditWorkTypeModal', function (_params) {
                $that.refreshEditWorkTypeInfo();
                $('#editWorkTypeModel').modal('show');
                vc.copyObject(_params, $that.editWorkTypeInfo);
                $that.editWorkTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editWorkTypeValidate: function () {
                return vc.validate.validate({
                    editWorkTypeInfo: $that.editWorkTypeInfo
                }, {
                    'editWorkTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "类型名称不能超过200"
                        },
                    ],
                    'editWorkTypeInfo.smsWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通知方式不能为空"
                        },
                    ],
                    'editWorkTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "备注不能超过500"
                        },
                    ],
                    'editWorkTypeInfo.wtId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editWorkType: function () {
                if (!$that.editWorkTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/workType.updateWorkType',
                    JSON.stringify($that.editWorkTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editWorkTypeModel').modal('hide');
                            vc.emit('workType', 'listWorkType', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditWorkTypeInfo: function () {
                $that.editWorkTypeInfo = {
                    wtId: '',
                    typeName: '',
                    smsWay: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.$that);
