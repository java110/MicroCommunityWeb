(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportCustomComponentRelInfo: {
                relId: '',
                componentId: '',
                name: '',
                customId: '',
                seq: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addReportCustomComponentRel', 'openAddReportCustomComponentRelModal', function (_param) {
                $that.addReportCustomComponentRelInfo.customId = _param.customId;
            });
        },
        methods: {
            addReportCustomComponentRelValidate() {
                return vc.validate.validate({
                    addReportCustomComponentRelInfo: vc.component.addReportCustomComponentRelInfo
                }, {
                    'addReportCustomComponentRelInfo.componentId': [
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
                    'addReportCustomComponentRelInfo.customId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报表编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "报表编号不能超过30"
                        },
                    ],
                    'addReportCustomComponentRelInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件序号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "组件序号不能超过11"
                        },
                    ],
                });
            },
            saveReportCustomComponentRelInfo: function () {
                if (!vc.component.addReportCustomComponentRelValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportCustomComponentRelInfo);
                    $('#addReportCustomComponentRelModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomComponentRel.saveReportCustomComponentRel',
                    JSON.stringify(vc.component.addReportCustomComponentRelInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.component.clearAddReportCustomComponentRelInfo();
                            vc.emit('reportCustomComponentRelManage', 'listReportCustomComponentRel', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            _closeAddReportCustomComponentRelInfo: function () {
                vc.emit('reportCustomComponentRelManage', 'listReportCustomComponentRel', {});
            },
            clearAddReportCustomComponentRelInfo: function () {
                vc.component.addReportCustomComponentRelInfo = {
                    componentId: '',
                    customId: '',
                    seq: '',
                    name: ''
                };
            },
            chooseReportComponent: function () {
                vc.emit('chooseReportCustomComponent', 'openChooseReportCustomComponentModel', $that.addReportCustomComponentRelInfo);
            }
        }
    });

})(window.vc);
