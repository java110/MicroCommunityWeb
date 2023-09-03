(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMaintainanceStandardInfo: {
                standardId: '',
                standardName: '',
                remark: '',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addMaintainanceStandard', 'openAddMaintainanceStandardModal', function() {
                $('#addMaintainanceStandardModel').modal('show');
            });
        },
        methods: {
            addMaintainanceStandardValidate() {
                return vc.validate.validate({
                    addMaintainanceStandardInfo: vc.component.addMaintainanceStandardInfo
                }, {
                    'addMaintainanceStandardInfo.standardName': [{
                            limit: "required",
                            param: "",
                            errInfo: "保养项目不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "保养项目不能超过256"
                        },
                    ],
                    'addMaintainanceStandardInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveMaintainanceStandardInfo: function() {
                if (!vc.component.addMaintainanceStandardValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addMaintainanceStandardInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/maintainance.saveMaintainanceStandard',
                    JSON.stringify(vc.component.addMaintainanceStandardInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMaintainanceStandardModel').modal('hide');
                            vc.component.clearAddMaintainanceStandardInfo();
                            vc.emit('maintainanceStandardManage', 'listMaintainanceStandard', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddMaintainanceStandardInfo: function() {
                vc.component.addMaintainanceStandardInfo = {
                    standardName: '',
                    remark: '',
                };
            }
        }
    });

})(window.vc);