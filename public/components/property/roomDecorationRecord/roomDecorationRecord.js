(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            roomDecorationRecordInfo: {
                rId: '',
                roomName: '',
                state: '',
                stateName: '',
                remark: '',
                examineRemark: '',
                roomId: '',
                photos: [],
                videoName: '',
                url: '',
                detailType: '1001'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomDecorationRecord', 'openDecorationRecordModal', function (_param) {
                $that.clearRoomDecorationRecordInfo();
                $that.roomDecorationRecordInfo.rId = _param[0];
                $that.roomDecorationRecordInfo.roomId = _param[1];
                $that.roomDecorationRecordInfo.roomName = _param[2];
                $that.roomDecorationRecordInfo.state = _param[3];
                $that.roomDecorationRecordInfo.stateName = _param[4];
                $('#roomDecorationRecordModel').modal('show');
            });
            vc.on("roomDecorationRecord", "notifyUploadImage", function (_param) {
                vc.component.roomDecorationRecordInfo.photos = _param;
            });
            vc.on("roomDecorationRecord", "notifyUploadVedio", function (_param) {
                vc.component.roomDecorationRecordInfo.videoName = _param.realFileName;
            });
        },
        methods: {
            roomDecorationRecordValidate() {
                return vc.validate.validate({
                    roomDecorationRecordInfo: vc.component.roomDecorationRecordInfo
                }, {
                    'roomDecorationRecordInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "状态格式错误"
                        },
                    ],
                    'roomDecorationRecordInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注错误"
                        },
                    ],
                    'roomDecorationRecordInfo.rId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修Id不能为空"
                        }
                    ]
                });
            },
            saveRoomDecorationRecordInfo: function () {
                if (!vc.component.roomDecorationRecordValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.roomDecorationRecordInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.roomDecorationRecordInfo);
                    $('#roomDecorationRecordModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/roomRenovation/updateRoomDecorationRecord',
                    JSON.stringify(vc.component.roomDecorationRecordInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#roomDecorationRecordModel').modal('hide');
                            vc.component.clearRoomDecorationRecordInfo();
                            vc.emit('listRoomDecorationRecord', 'listRoomRenovationRecords', {});
                            location.reload();
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearRoomDecorationRecordInfo: function () {
                vc.component.roomDecorationRecordInfo = {
                    rId: '',
                    state: '',
                    remark: '',
                    examineRemark: '',
                    roomId: '',
                    photos: [],
                    videoName: '',
                    detailType: '1001'
                };
            },
        }
    });
})(window.vc);