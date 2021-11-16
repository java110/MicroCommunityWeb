(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportCustomComponentInfo: {
                componentId: '',
                name: '',
                componentType: '',
                queryModel: '',
                componentSql: '',
                javaScript: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addReportCustomComponent', 'openAddReportCustomComponentModal', function () {
                $('#addReportCustomComponentModel').modal('show');
            });
        },
        methods: {
            addReportCustomComponentValidate() {
                return vc.validate.validate({
                    addReportCustomComponentInfo: vc.component.addReportCustomComponentInfo
                }, {
                    'addReportCustomComponentInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "组件名称不能超过64"
                        },
                    ],
                    'addReportCustomComponentInfo.componentType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "组件类型不能超过12"
                        },
                    ],
                    'addReportCustomComponentInfo.queryModel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1",
                            errInfo: "查询方式不能超过1"
                        },
                    ],
                    'addReportCustomComponentInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        },
                    ],
                });
            },
            saveReportCustomComponentInfo: function () {
                if (!vc.component.addReportCustomComponentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportCustomComponentInfo);
                    $('#addReportCustomComponentModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomComponent.saveReportCustomComponent',
                    JSON.stringify(vc.component.addReportCustomComponentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportCustomComponentModel').modal('hide');
                            vc.component.clearAddReportCustomComponentInfo();
                            vc.emit('reportCustomComponentManage', 'listReportCustomComponent', {});
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddReportCustomComponentInfo: function () {
                vc.component.addReportCustomComponentInfo = {
                    name: '',
                    componentType: '',
                    queryModel: '',
                    componentSql: '',
                    javaScript: '',
                    remark: '',
                };
            }
        }
    });

})(window.vc);
