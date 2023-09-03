(function (vc) {
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string
        },
        data: {
            deleteOwnerInfo: {}
        },
        _initEvent: function () {
            vc.on('deleteOwner', 'openOwnerModel', function (_ownerInfo) {
                vc.component.deleteOwnerInfo = _ownerInfo;
                $('#deleteOwnerModel').modal('show');
            });
        },
        methods: {
            closeDeleteOwnerModel: function () {
                $('#deleteOwnerModel').modal('hide');
            },
            deleteOwner: function () {
                vc.component.deleteOwnerInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/owner.deleteOwner',
                    JSON.stringify(vc.component.deleteOwnerInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOwnerModel').modal('hide');
                            vc.emit($props.notifyLoadDataComponentName, 'listOwnerData', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                        // vc.component.deleteOwnernfo.errorInfo = errInfo;
                    });
            }
        }
    });
})(window.vc);