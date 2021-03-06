(function (vc, vm) {
    vc.extends({
        data: {
            deleteRoomRenovationRecordInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteRoomDecorationRecord', 'openDeleteRoomDecorationRecordModal', function (_params) {
                vc.component.deleteRoomRenovationRecordInfo = _params;
                $('#deleteRoomRenovationRecordModel').modal('show');
            });
        },
        methods: {
            deleteRoomRenovationRecord: function () {
                vc.component.deleteRoomRenovationRecordInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/roomRenovation/deleteRoomRenovationRecord',
                    JSON.stringify(vc.component.deleteRoomRenovationRecordInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRoomRenovationRecordModel').modal('hide');
                            vc.emit('listRoomDecorationRecord', 'listRoomRenovationRecords', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteRoomRenovationRecordModel: function () {
                $('#deleteRoomRenovationRecordModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
