(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunityVenueInfo: {
                venueId: '',
                name: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addCommunityVenue', 'openAddCommunityVenueModal', function () {
                $('#addCommunityVenueModel').modal('show');
            });
        },
        methods: {
            addCommunityVenueValidate() {
                return vc.validate.validate({
                    addCommunityVenueInfo: vc.component.addCommunityVenueInfo
                }, {
                    'addCommunityVenueInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "场馆名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "场馆名称不能超过30"
                        },
                    ],
                    'addCommunityVenueInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        },
                    ],




                });
            },
            saveCommunityVenueInfo: function () {
                if (!vc.component.addCommunityVenueValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.addCommunityVenueInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/communityVenue.saveCommunityVenue',
                    JSON.stringify(vc.component.addCommunityVenueInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunityVenueModel').modal('hide');
                            vc.component.clearAddCommunityVenueInfo();
                            vc.emit('communitySpaceManage', 'listCommunityVenue', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddCommunityVenueInfo: function () {
                vc.component.addCommunityVenueInfo = {
                    name: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
