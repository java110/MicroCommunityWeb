(function(vc, vm) {

    vc.extends({
        data: {
            editConvenienceMenusInfo: {
                convenienceMenusId: '',
                name: '',
                icon: '',
                url: '',
                seq: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editConvenienceMenus', 'openEditConvenienceMenusModal', function(_params) {
                vc.component.refreshEditConvenienceMenusInfo();
                $('#editConvenienceMenusModel').modal('show');
                vc.copyObject(_params, vc.component.editConvenienceMenusInfo);
                let _photos = [];
                _photos.push(vc.component.editConvenienceMenusInfo.icon);
                vc.emit('editIconCover', 'uploadImage', 'notifyPhotos', _photos);
            });

            vc.on("editIcon", "notifyUploadCoverImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.editConvenienceMenusInfo.icon = _param[0];
                } else {
                    vc.component.editConvenienceMenusInfo.icon = '';
                }

            });
        },
        methods: {
            editConvenienceMenusValidate: function() {
                return vc.validate.validate({
                    editConvenienceMenusInfo: vc.component.editConvenienceMenusInfo
                }, {
                    'editConvenienceMenusInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "菜单名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "菜单名称太长"
                        },
                    ],
                    'editConvenienceMenusInfo.url': [{
                        limit: "maxLength",
                        param: "100",
                        errInfo: "页面路径太长"
                    }, ],
                    'editConvenienceMenusInfo.seq': [{
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
                    'editConvenienceMenusInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注太长"
                    }, ],
                    'editConvenienceMenusInfo.convenienceMenusId': [{
                        limit: "required",
                        param: "",
                        errInfo: "资产ID不能为空"
                    }]

                });
            },
            editConvenienceMenus: function() {
                if (!vc.component.editConvenienceMenusValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/convenienceMenus/updateConvenienceMenus',
                    JSON.stringify(vc.component.editConvenienceMenusInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editConvenienceMenusModel').modal('hide');
                            vc.emit('convenienceMenusManage', 'listConvenienceMenus', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditConvenienceMenusInfo: function() {
                vc.component.editConvenienceMenusInfo = {
                    convenienceMenusId: '',
                    name: '',
                    icon: '',
                    url: '',
                    seq: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);