(function (vc, vm) {
    vc.extends({
        data: {
            deleteLocationInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteLocation', 'openDeleteLocationModal', function (_params) {
                vc.component.deleteLocationInfo = _params;
                $('#deleteLocationModel').modal('show');
            });
        },
        methods: {
            deleteLocation: function () {
                vc.component.deleteLocationInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'communityLocation.deleteCommunityLocation',
                    JSON.stringify(vc.component.deleteLocationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteLocationModel').modal('hide');
                            vc.emit('locationManage', 'listLocation', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteLocationModel: function () {
                $('#deleteLocationModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
