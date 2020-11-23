(function (vc, vm) {

    vc.extends({
        data: {
            editCommunityAreaInfo: {
                communityId: '',
                name: '',
                address: '',
                nearbyLandmarks: '',
                cityCode: '',
                mapX: '101.33',
                mapY: '101.33',
                communityArea: ''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editCommunityArea', 'openEditCommunityModal',
                function (_params) {
                    vc.component.refreshEditCommunityInfo();
                    $('#editCommunityAreaModel').modal('show');
                    vc.copyObject(_params, vc.component.editCommunityAreaInfo);
                    //vc.component.editCommunityAreaInfo.communityId = vc.getCurrentCommunity().communityId;
                });
        },
        methods: {
            editCommunityAreaValidate: function () {
                return vc.validate.validate({
                    editCommunityAreaInfo: vc.component.editCommunityAreaInfo
                },
                    {

                        'editCommunityAreaInfo.communityArea': [{
                            limit: "required",
                            param: "",
                            errInfo: "小区面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "小区面积必须是3.00 格式"
                        },
                        ],
                        'editCommunityAreaInfo.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "小区ID不能为空"
                        }]

                    });
            },
            editCommunityArea: function () {
                if (!vc.component.editCommunityAreaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.post('editCommunity', 'update', JSON.stringify(vc.component.editCommunityAreaInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editCommunityAreaModel').modal('hide');
                            vc.emit('enterCommunity','listMyCommunity', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditCommunityInfo: function () {
                vc.component.editCommunityAreaInfo = {
                    communityId: '',
                    name: '',
                    address: '',
                    nearbyLandmarks: '',
                    cityCode: '',
                    mapX: '101.33',
                    mapY: '101.33',
                    communityArea: ''

                }
            }
        }
    });

})(window.vc, window.vc.component);