(function (vc, vm) {

    vc.extends({
        data: {
            editReportCustomGroupInfo: {
                groupId: '',
                name: '',
                url: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editReportCustomGroup', 'openEditReportCustomGroupModal', function (_params) {
                vc.component.refreshEditReportCustomGroupInfo();
                $('#editReportCustomGroupModel').modal('show');
                vc.copyObject(_params, vc.component.editReportCustomGroupInfo);
            });
        },
        methods: {
            editReportCustomGroupValidate: function () {
                return vc.validate.validate({
                    editReportCustomGroupInfo: vc.component.editReportCustomGroupInfo
                }, {
                    'editReportCustomGroupInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "组名称不能超过128"
                        },
                    ],
                    'editReportCustomGroupInfo.url': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组url不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "组url不能超过512"
                        },
                    ],
                    'editReportCustomGroupInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        },
                    ],
                    'editReportCustomGroupInfo.groupId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组ID不能为空"
                        }]

                });
            },
            editReportCustomGroup: function () {
                if (!vc.component.editReportCustomGroupValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomGroup.updateReportCustomGroup',
                    JSON.stringify(vc.component.editReportCustomGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportCustomGroupModel').modal('hide');
                            vc.emit('reportCustomGroupManage', 'listReportCustomGroup', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditReportCustomGroupInfo: function () {
                vc.component.editReportCustomGroupInfo = {
                    groupId: '',
                    name: '',
                    url: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
