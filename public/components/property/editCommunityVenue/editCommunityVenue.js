(function (vc, vm) {

    vc.extends({
        data: {
            editCommunityVenueInfo: {
                venueId: '',
                name: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editCommunityVenue', 'openEditCommunityVenueModal', function (_params) {
                vc.component.refreshEditCommunityVenueInfo();
                $('#editCommunityVenueModel').modal('show');
                vc.copyObject(_params, vc.component.editCommunityVenueInfo);
                $that._listEditCommunityVenues();
                vc.component.editCommunityVenueInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCommunityVenueValidate: function () {
                return vc.validate.validate({
                    editCommunityVenueInfo: vc.component.editCommunityVenueInfo
                }, {
                    'editCommunityVenueInfo.name': [
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
                    'editCommunityVenueInfo.remark': [
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
                    'editCommunityVenueInfo.venueId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            _listEditCommunityVenues: function() {
                let param = {
                    params: {
                        page:1,
                        row:1,
                        communityId:vc.getCurrentCommunity().communityId,
                        venueId:$that.editCommunityVenueInfo.venueId
                    }
                };

                //发送get请求
                vc.http.apiGet('/communityVenue.listCommunityVenue',
                    param,
                    function(json, res) {
                        let _communityVenue= JSON.parse(json);
                       vc.copyObject(_communityVenue.data[0],$that.editCommunityVenueInfo);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            editCommunityVenue: function () {
                if (!vc.component.editCommunityVenueValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/communityVenue.updateCommunityVenue',
                    JSON.stringify(vc.component.editCommunityVenueInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunityVenueModel').modal('hide');
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
            refreshEditCommunityVenueInfo: function () {
                vc.component.editCommunityVenueInfo = {
                    venueId: '',
                    name: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
