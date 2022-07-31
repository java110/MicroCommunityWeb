(function (vc, vm) {
    vc.extends({
        data: {
            editActivitiesTypeInfo: {
                typeCd: '',
                typeName: '',
                typeDesc: '',
                seq: '',
                defaultShow: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editActivitiesType', 'openEditActivitiesTypeModal', function (_params) {
                vc.component.refreshEditActivitiesTypeInfo();
                $('#editActivitiesTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editActivitiesTypeInfo);
                vc.component.editActivitiesTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editActivitiesTypeValidate: function () {
                return vc.validate.validate({
                    editActivitiesTypeInfo: vc.component.editActivitiesTypeInfo
                }, {
                    'editActivitiesTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "大类名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "大类名称超过100位"
                        },
                    ],
                    'editActivitiesTypeInfo.typeDesc': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "描述超过500位"
                        },
                    ],
                    'editActivitiesTypeInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "显示序号不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "显示序号不是有效数字"
                        },
                    ],
                    'editActivitiesTypeInfo.defaultShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2",
                            errInfo: "是否显示格式错误"
                        },
                    ],
                    'editActivitiesTypeInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "大类编码不能为空"
                        }
                    ]
                });
            },
            editActivitiesType: function () {
                if (!vc.component.editActivitiesTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/activitiesType/updateActivitiesType',
                    JSON.stringify(vc.component.editActivitiesTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editActivitiesTypeModel').modal('hide');
                            vc.emit('activitiesTypeManage', 'listActivitiesType', {});
                            vc.toast("修改成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditActivitiesTypeInfo: function () {
                vc.component.editActivitiesTypeInfo = {
                    typeCd: '',
                    typeName: '',
                    typeDesc: '',
                    seq: '',
                    defaultShow: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
