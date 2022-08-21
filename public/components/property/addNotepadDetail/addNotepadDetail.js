(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addNotepadDetailInfo: {
                noteId: '',
                content: '',
                state: 'W',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('addNotepadDetail', 'openAddNotepadModal', function(_param) {
                vc.copyObject(_param, $that.addNotepadDetailInfo);

                $('#addNotepadDetailModel').modal('show');
            });
        },
        methods: {
            addNotepadDetailValidate() {
                return vc.validate.validate({
                    addNotepadDetailInfo: vc.component.addNotepadDetailInfo
                }, {

                    'addNotepadDetailInfo.content': [{
                        limit: "required",
                        param: "",
                        errInfo: "内容不能为空"
                    }, ],
                    'addNotepadDetailInfo.noteId': [{
                        limit: "required",
                        param: "",
                        errInfo: "登记不能为空"
                    }],
                });
            },
            saveNotepadDetailInfo: function() {
                if (!vc.component.addNotepadDetailValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addNotepadDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理

                vc.http.apiPost(
                    '/notepad.saveNotepadDetail',
                    JSON.stringify(vc.component.addNotepadDetailInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addNotepadDetailModel').modal('hide');
                            vc.component.clearAddNotepadDetailInfo();
                            vc.emit('notepadManage', 'listNotepad', {});
                            vc.emit('simplifyNotepadManage', 'listNotepad', {});
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            clearAddNotepadDetailInfo: function() {
                vc.component.addNotepadDetailInfo = {
                    noteId: '',
                    content: '',
                    state: 'W',
                };
            }
        }
    });

})(window.vc);