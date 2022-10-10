(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunityShopInfo: {
                shopName: '',
                link: '',
                password: '',
                communityId: vc.getCurrentCommunity().communityId,
            }
        },
        _initMethod: function() {
            
        },
        _initEvent: function() {
            vc.on('addCommunityShop', 'openAddCommunityShopModal', function() {
                $('#addCommunityShopModel').modal('show');
            });
        },
        methods: {
            addCommunityShopValidate() {
                return vc.validate.validate({
                    addCommunityShopInfo: vc.component.addCommunityShopInfo
                }, {
                    'addCommunityShopInfo.shopName': [{
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
                    'addCommunityShopInfo.link': [{
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "手机号不能超过12"
                        },
                    ],
                    'addCommunityShopInfo.password': [{
                            limit: "required",
                            param: "",
                            errInfo: "密码不能为空"
                        }
                    ],
                });
            },
            saveCommunityShopInfo: function() {
                if (!vc.component.addCommunityShopValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.http.apiPost(
                    '/store.propertySaveStoreAndShop',
                    JSON.stringify(vc.component.addCommunityShopInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunityShopModel').modal('hide');
                            vc.component.clearAddCommunityShopInfo();
                            vc.emit('communityShop', 'listCommunityShop', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddCommunityShopInfo: function() {
                vc.component.addCommunityShopInfo = {
                    shopName: '',
                    link: '',
                    password: '',
                    communityId: vc.getCurrentCommunity().communityId,
                };
            },
            
        }
    });

})(window.vc);