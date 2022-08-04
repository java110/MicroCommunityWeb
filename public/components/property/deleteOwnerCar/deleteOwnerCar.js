(function (vc) {
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string
        },
        data: {
            deleteOwnerCarInfo: {}
        },
        _initEvent: function () {
            vc.on('deleteOwnerCar', 'openOwnerCarModel', function (_ownerInfo) {
                vc.component.deleteOwnerCarInfo = _ownerInfo;
                $('#deleteOwnerCarModel').modal('show');
            });
        },
        methods: {
            closedeleteOwnerCarModel: function () {
                $('#deleteOwnerCarModel').modal('hide');
            },
            deleteOwnerCar: function () {
                vc.component.deleteOwnerCarInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'owner.deleteOwnerCars',
                    JSON.stringify(vc.component.deleteOwnerCarInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOwnerCarModel').modal('hide');
                            vc.toast("删除成功");
                            vc.emit($props.notifyLoadDataComponentName, 'listOwnerCarData', {});
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                        // vc.component.deleteOwnerCarnfo.errorInfo = errInfo;
                    }
                );
            }
        }
    });
})(window.vc);