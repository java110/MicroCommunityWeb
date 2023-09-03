(function (vc, vm) {
    vc.extends({
        data: {
            deleteApplyRoomDiscountRecordInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteApplyRoomDiscountRecord', 'openDeleteApplyRoomDiscountRecordModal', function (_params) {
                vc.component.deleteApplyRoomDiscountRecordInfo = _params;
                $('#deleteApplyRoomDiscountRecordModel').modal('show');
            });
        },
        methods: {
            deleteApplyRoomDiscountRecord: function () {
                vc.component.deleteApplyRoomDiscountRecordInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/applyRoomDiscountRecord/cutApplyRoomDiscountRecord',
                    JSON.stringify(vc.component.deleteApplyRoomDiscountRecordInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteApplyRoomDiscountRecordModel').modal('hide');
                            vc.emit('listApplyRoomDiscountRecord', 'listApplyRoomDiscountRecords', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteApplyRoomDiscountRecordModel: function () {
                $('#deleteApplyRoomDiscountRecordModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
