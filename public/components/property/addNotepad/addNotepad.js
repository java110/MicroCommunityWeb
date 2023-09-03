(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addNotepadInfo: {
                noteId: '',
                noteType: '',
                title: '',
                roomName: '',
                roomId: '',
                objId: '',
                objName: '',
                objType: '3309',
                link: '',
                noteTypes: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addNotepad', 'openAddNotepadModal', function (_param) {
                vc.getDict('notepad', 'note_type', function (_data) {
                    $that.addNotepadInfo.noteTypes = _data;
                })
                vc.copyObject(_param, $that.addNotepadInfo);
                $that.listNotepadRoom();
                $('#addNotepadModel').modal('show');
            });
        },
        methods: {
            addNotepadValidate() {
                return vc.validate.validate({
                    addNotepadInfo: vc.component.addNotepadInfo
                }, {
                    'addNotepadInfo.roomName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "房屋不能超过128"
                        }
                    ],
                    'addNotepadInfo.objName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        }
                    ],
                    'addNotepadInfo.link': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系电话格式错误"
                        }
                    ],
                    'addNotepadInfo.noteType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "类型不能超过12"
                        }
                    ],
                    'addNotepadInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "内容不能超过256"
                        }
                    ]
                });
            },
            saveNotepadInfo: function () {
                if (!vc.component.addNotepadValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addNotepadInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addNotepadInfo);
                    $('#addNotepadModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'notepad.saveNotepad',
                    JSON.stringify(vc.component.addNotepadInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addNotepadModel').modal('hide');
                            vc.component.clearAddNotepadInfo();
                            vc.emit('notepadManage', 'listNotepad', {});
                            vc.emit('simplifyNotepadManage', 'listNotepad', {});
                            vc.toast("添加成功");
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
            listNotepadRoom: function (_page, _row) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: $that.addNotepadInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        vc.copyObject(listRoomData.rooms[0], $that.addNotepadInfo);
                        $that.addNotepadInfo.objId = listRoomData.rooms[0].ownerId;
                        $that.addNotepadInfo.objName = listRoomData.rooms[0].ownerName;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddNotepadInfo: function () {
                vc.component.addNotepadInfo = {
                    noteId: '',
                    noteType: '',
                    title: '',
                    roomName: '',
                    roomId: '',
                    objId: '',
                    objName: '',
                    objType: '3309',
                    link: '',
                    noteTypes: []
                };
            }
        }
    });
})(window.vc);