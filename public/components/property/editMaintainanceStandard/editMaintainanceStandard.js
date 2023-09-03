(function(vc, vm) {

    vc.extends({
        data: {
            editMaintainanceStandardInfo: {
                standardId: '',
                standardName: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editMaintainanceStandard', 'openEditMaintainanceStandardModal', function(_params) {
                vc.component.refreshEditMaintainanceStandardInfo();
                $('#editMaintainanceStandardModel').modal('show');
                vc.copyObject(_params, vc.component.editMaintainanceStandardInfo);
                vc.component.editMaintainanceStandardInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMaintainanceStandardValidate: function() {
                return vc.validate.validate({
                    editMaintainanceStandardInfo: vc.component.editMaintainanceStandardInfo
                }, {
                    'editMaintainanceStandardInfo.standardName': [{
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
                    'editMaintainanceStandardInfo.remark': [{
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
                    'editMaintainanceStandardInfo.standardId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editMaintainanceStandard: function() {
                if (!vc.component.editMaintainanceStandardValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/maintainance.updateMaintainanceStandard',
                    JSON.stringify(vc.component.editMaintainanceStandardInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMaintainanceStandardModel').modal('hide');
                            vc.emit('maintainanceStandardManage', 'listMaintainanceStandard', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditMaintainanceStandardInfo: function() {
                vc.component.editMaintainanceStandardInfo = {
                    standardId: '',
                    standardName: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);