(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addBusinessTableHisInfo: {
                hisId: '',
                businessTypeCd: '',
                action: '',
                actionObj: '',
                actionObjHis: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addBusinessTableHis', 'openAddBusinessTableHisModal', function () {
                $('#addBusinessTableHisModel').modal('show');
            });
        },
        methods: {
            addBusinessTableHisValidate() {
                return vc.validate.validate({
                    addBusinessTableHisInfo: vc.component.addBusinessTableHisInfo
                }, {
                    'addBusinessTableHisInfo.businessTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "业务类型不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "业务类型超过30位"
                        },
                    ],
                    'addBusinessTableHisInfo.action': [{
                        limit: "required",
                        param: "",
                        errInfo: "动作不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "动作不能为空"
                        },
                    ],
                    'addBusinessTableHisInfo.actionObj': [{
                        limit: "required",
                        param: "",
                        errInfo: "表名不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "表名超过64位"
                        },
                    ],
                    'addBusinessTableHisInfo.actionObjHis': [{
                        limit: "required",
                        param: "",
                        errInfo: "轨迹表名不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "轨迹表名超过64位"
                        },
                    ],
                    'addBusinessTableHisInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注内容不能超过200"
                    }]
                });
            },
            saveBusinessTableHisInfo: function () {
                if (!vc.component.addBusinessTableHisValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addBusinessTableHisInfo);
                    $('#addBusinessTableHisModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/businessTableHis.saveBusinessTableHis',
                    JSON.stringify(vc.component.addBusinessTableHisInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addBusinessTableHisModel').modal('hide');
                            vc.component.clearAddBusinessTableHisInfo();
                            vc.emit('businessTableHisManage', 'listBusinessTableHis', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddBusinessTableHisInfo: function () {
                vc.component.addBusinessTableHisInfo = {
                    businessTypeCd: '',
                    action: '',
                    actionObj: '',
                    actionObjHis: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);