(function (vc, vm) {
    vc.extends({
        data: {
            editCommunitySpaceOpenTimeInfo: {
                openTimes: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editCommunitySpaceOpenTime', 'openEditCommunitySpaceModal', function (_params) {
                $that.editCommunitySpaceOpenTimeInfo.openTimes = _params.openTimes;
                $('#editCommunitySpaceOpenTimeModel').modal('show');
            });
        },
        methods: {
            _changeOpenTime: function (_item) {
                vc.http.apiPost(
                    '/communitySpaceOpenTime.updateCommunitySpaceOpenTime',
                    JSON.stringify(_item), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('communitySpaceManage', 'listCommunitySpace', {});
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
        }
    });
})(window.vc, window.vc.component);