(function (vc, vm) {
    vc.extends({
        data: {
            editSystemInfoInfo: {
                systemId: '',
                systemTitle: '',
                subSystemTitle: '',
                companyName: '',
                logoUrl: '',
                imgUrl: '',
                defaultCommunityId: '',
                ownerTitle: '',
                propertyTitle: '',
                qqMapKey: '',
                mallUrl: '',
                systemSimpleTitle: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editSystemInfo', 'openEditSystemInfoModal', function (_params) {
                vc.component.refreshEditSystemInfoInfo();
                $('#editSystemInfoModel').modal('show');
                vc.copyObject(_params, vc.component.editSystemInfoInfo);
                vc.component.editSystemInfoInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editSystemInfoValidate: function () {
                return vc.validate.validate({
                    editSystemInfoInfo: vc.component.editSystemInfoInfo
                }, {
                    'editSystemInfoInfo.systemId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "id不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "id不能超过11"
                        }
                    ],
                    'editSystemInfoInfo.systemTitle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标题名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "标题名称不能超过64"
                        }
                    ],
                    'editSystemInfoInfo.subSystemTitle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "副标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "副标题不能超过64"
                        },
                    ],
                    'editSystemInfoInfo.companyName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公司名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "公司名称不能超过128"
                        }
                    ],
                    'editSystemInfoInfo.logoUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "logo地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "logo地址不能超过200"
                        }
                    ],
                    'editSystemInfoInfo.imgUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "静态url不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "静态url不能超过512"
                        }
                    ],
                    'editSystemInfoInfo.defaultCommunityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "默认小区编号不能为空"
                        }
                    ],
                    'editSystemInfoInfo.ownerTitle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "业主标题不能超过64"
                        }
                    ],
                    'editSystemInfoInfo.propertyTitle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物业手机标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "物业手机标题不能超过64"
                        }
                    ],
                    'editSystemInfoInfo.qqMapKey': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "qq地图key不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "qq地图key不能超过64"
                        }
                    ],
                    'editSystemInfoInfo.mallUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商城地址'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "商城地址'不能超过128"
                        }
                    ]
                });
            },
            editSystemInfo: function () {
                if (!vc.component.editSystemInfoValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/system.updateSystemInfo',
                    JSON.stringify(vc.component.editSystemInfoInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editSystemInfoModel').modal('hide');
                            vc.emit('viewSystemInfo', 'load', {});
                            vc.toast("修改成功");
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
            refreshEditSystemInfoInfo: function () {
                vc.component.editSystemInfoInfo = {
                    systemId: '',
                    systemTitle: '',
                    subSystemTitle: '',
                    companyName: '',
                    logoUrl: '',
                    imgUrl: '',
                    defaultCommunityId: '',
                    ownerTitle: '',
                    propertyTitle: '',
                    qqMapKey: '',
                    mallUrl: '',
                    systemSimpleTitle: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);