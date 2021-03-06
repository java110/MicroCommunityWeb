(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            roomDecorationAcceptanceInfo: {
                rId: '',
                roomName: '',
                state: '',
                remark: '',
                roomId: '',
                userId: '',
                detailType: '1001'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomDecorationAcceptance', 'openRoomDecorationAcceptanceModal', function (_param) {
                $that.clearRoomDecorationAcceptanceInfo();
                $that.roomDecorationAcceptanceInfo.rId = _param.rId;
                $that.roomDecorationAcceptanceInfo.roomName = _param.roomName;
                $that.roomDecorationAcceptanceInfo.roomId = _param.roomId;
                $that.roomDecorationAcceptanceInfo.userId = _param.userId;
                $('#roomDecorationAcceptanceModel').modal('show');
            });
        },
        methods: {
            roomDecorationAcceptanceValidate() {
                return vc.validate.validate({
                    roomDecorationAcceptanceInfo: vc.component.roomDecorationAcceptanceInfo
                }, {
                    'roomDecorationAcceptanceInfo.state': [
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
                    'roomDecorationAcceptanceInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "说明错误"
                        },
                    ],
                    'roomDecorationAcceptanceInfo.rId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修Id不能为空"
                        }
                    ]
                });
            },
            saveRoomDecorationAcceptanceInfo: function () {
                if (!vc.component.roomDecorationAcceptanceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.roomDecorationAcceptanceInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.roomDecorationAcceptanceInfo);
                    $('#roomDecorationAcceptanceModel').modal('hide');
                    return;
                }
                vc.component.roomDecorationAcceptanceInfo.roomName = vc.component.roomDecorationAcceptanceInfo.roomName.trim();
                vc.component.roomDecorationAcceptanceInfo.remark = vc.component.roomDecorationAcceptanceInfo.remark.trim();
                vc.http.apiPost(
                    '/roomRenovation/saveRoomRenovationDetail',
                    JSON.stringify(vc.component.roomDecorationAcceptanceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#roomDecorationAcceptanceModel').modal('hide');
                            vc.component.clearRoomDecorationAcceptanceInfo();
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
            clearRoomDecorationAcceptanceInfo: function () {
                vc.component.roomDecorationAcceptanceInfo = {
                    rId: '',
                    roomId: '',
                    state: '',
                    remark: '',
                    detailType: '1001'
                };
            },
        }
    });
})(window.vc);
