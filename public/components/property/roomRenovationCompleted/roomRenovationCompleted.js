(function (vc, vm) {
    vc.extends({
        data: {
            roomRenovationCompletedInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomRenovationCompleted', 'openRoomRenovationCompletedModal', function (_params) {
                vc.component.roomRenovationCompletedInfo = _params;
                $('#roomRenovationCompletedModel').modal('show');
            });
        },
        methods: {
            roomRenovationCompleted: function () {
                vc.http.apiPost(
                    '/roomRenovation/updateRoomRenovationState',
                    JSON.stringify(vc.component.roomRenovationCompletedInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#roomRenovationCompletedModel').modal('hide');
                            vc.emit('roomRenovationManage', 'listRoomRenovation', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            closeRoomRenovationCompletedModel: function () {
                $('#roomRenovationCompletedModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
