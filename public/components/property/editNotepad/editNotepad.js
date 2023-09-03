(function (vc, vm) {
    vc.extends({
        data: {
            editNotepadInfo: {
                noteId: '',
                noteType: '',
                title: '',
                roomName: '',
                roomId: '',
                objId: '',
                objName: '',
                objType: '',
                link: '',
                noteTypes: []
            }
        },
        _initMethod: function () {
            vc.getDict('notepad', 'note_type', function (_data) {
                $that.editNotepadInfo.noteTypes = _data;
            })
        },
        _initEvent: function () {
            vc.on('editNotepad', 'openEditNotepadModal', function (_params) {
                vc.component.refreshEditNotepadInfo();
                $('#editNotepadModel').modal('show');
                vc.copyObject(_params, vc.component.editNotepadInfo);
                vc.component.editNotepadInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editNotepadValidate: function () {
                return vc.validate.validate({
                    editNotepadInfo: vc.component.editNotepadInfo
                }, {
                    'editNotepadInfo.noteId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ],
                    'editNotepadInfo.roomName': [
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
                    'editNotepadInfo.objName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        }
                    ],
                    'editNotepadInfo.link': [
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
                    'editNotepadInfo.noteType': [
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
                    'editNotepadInfo.title': [
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
            editNotepad: function () {
                if (!vc.component.editNotepadValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'notepad.updateNotepad',
                    JSON.stringify(vc.component.editNotepadInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editNotepadModel').modal('hide');
                            vc.emit('notepadManage', 'listNotepad', {});
                            vc.emit('simplifyNotepadManage', 'listNotepad', {});
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
            refreshEditNotepadInfo: function () {
                let _noteTypes = $that.editNotepadInfo.noteTypes
                vc.component.editNotepadInfo = {
                    noteId: '',
                    noteType: '',
                    title: '',
                    roomName: '',
                    roomId: '',
                    objId: '',
                    objName: '',
                    objType: '',
                    link: '',
                    noteTypes: _noteTypes
                }
            }
        }
    });
})(window.vc, window.vc.component);