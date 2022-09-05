(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addDataPrivilegeInfo: {
                dpId: '',
                name: '',
                code: '',
                communityId: vc.getCurrentCommunity().communityId,
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addDataPrivilege', 'openAddDataPrivilegeModal', function() {
                $('#addDataPrivilegeModel').modal('show');
            });
        },
        methods: {
            addDataPrivilegeValidate() {
                return vc.validate.validate({
                    addDataPrivilegeInfo: vc.component.addDataPrivilegeInfo
                }, {
                    'addDataPrivilegeInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        },
                    ],
                    'addDataPrivilegeInfo.code': [{
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "编号不能超过30"
                        },
                    ],
                    'addDataPrivilegeInfo.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "communityId不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "communityId不能超过30"
                        },
                    ],
                    'addDataPrivilegeInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "备注不能超过256"
                        },
                    ],




                });
            },
            saveDataPrivilegeInfo: function() {
                if (!vc.component.addDataPrivilegeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addDataPrivilegeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addDataPrivilegeInfo);
                    $('#addDataPrivilegeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/dataPrivilege.saveDataPrivilege',
                    JSON.stringify(vc.component.addDataPrivilegeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addDataPrivilegeModel').modal('hide');
                            vc.component.clearAddDataPrivilegeInfo();
                            vc.emit('dataPrivilegeManage', 'listDataPrivilege', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddDataPrivilegeInfo: function() {
                vc.component.addDataPrivilegeInfo = {
                    name: '',
                    code: '',
                    communityId: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);