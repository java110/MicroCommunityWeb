(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportCustomGroupInfo: {
                groupId: '',
                name: '',
                url: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addReportCustomGroup', 'openAddReportCustomGroupModal', function () {
                $('#addReportCustomGroupModel').modal('show');
            });
        },
        methods: {
            addReportCustomGroupValidate() {
                return vc.validate.validate({
                    addReportCustomGroupInfo: vc.component.addReportCustomGroupInfo
                }, {
                    'addReportCustomGroupInfo.name': [
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
                    'addReportCustomGroupInfo.url': [
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
                    'addReportCustomGroupInfo.remark': [
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




                });
            },
            saveReportCustomGroupInfo: function () {
                if (!vc.component.addReportCustomGroupValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportCustomGroupInfo);
                    $('#addReportCustomGroupModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomGroup.saveReportCustomGroup',
                    JSON.stringify(vc.component.addReportCustomGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportCustomGroupModel').modal('hide');
                            vc.component.clearAddReportCustomGroupInfo();
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
            clearAddReportCustomGroupInfo: function () {
                vc.component.addReportCustomGroupInfo = {
                    name: '',
                    url: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
