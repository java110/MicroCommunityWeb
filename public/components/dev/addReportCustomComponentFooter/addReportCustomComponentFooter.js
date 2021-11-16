(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportCustomComponentFooterInfo: {
                footerId: '',
                componentId: '',
                name: '',
                queryModel: '',
                javaScript: '',
                componentSql: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addReportCustomComponentFooter', 'openAddReportCustomComponentFooterModal', function (_param) {
                $that.addReportCustomComponentFooterInfo.componentId = _param.componentId;
                $('#addReportCustomComponentFooterModel').modal('show');
            });
        },
        methods: {
            addReportCustomComponentFooterValidate() {
                return vc.validate.validate({
                    addReportCustomComponentFooterInfo: vc.component.addReportCustomComponentFooterInfo
                }, {
                    'addReportCustomComponentFooterInfo.componentId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "组件ID不能超过30"
                        },
                    ],
                    'addReportCustomComponentFooterInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'addReportCustomComponentFooterInfo.queryModel': [
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
                    'addReportCustomComponentFooterInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述'不能超过512"
                        },
                    ],
                });
            },
            saveReportCustomComponentFooterInfo: function () {
                if (!vc.component.addReportCustomComponentFooterValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportCustomComponentFooterInfo);
                    $('#addReportCustomComponentFooterModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomComponentFooter.saveReportCustomComponentFooter',
                    JSON.stringify(vc.component.addReportCustomComponentFooterInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportCustomComponentFooterModel').modal('hide');
                            vc.component.clearAddReportCustomComponentFooterInfo();
                            vc.emit('reportCustomComponentFooterManage', 'listReportCustomComponentFooter', {});
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddReportCustomComponentFooterInfo: function () {
                vc.component.addReportCustomComponentFooterInfo = {
                    componentId: '',
                    name: '',
                    queryModel: '',
                    javaScript: '',
                    componentSql: '',
                    remark: '',
                };
            }
        }
    });

})(window.vc);
