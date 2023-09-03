/**
 系统配置 组件
 **/
(function (vc) {
    vc.extends({
        data: {
            registerProtocolInfo: {
                userProtocol:'',
                merchantProtocol:'',
                protolcolId:'',
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            $that.initTextArea();
            vc.component._listRegisterProtocols();
        },
        _initEvent: function () {
 
        },
        methods: {
            initTextArea:function(){
                $that._initSummernote('userProtocolSummernote',function(content){
                    $that.registerProtocolInfo.userProtocol = content;
                });
                $that._initSummernote('merchantProtocolSummernote',function(content){
                    $that.registerProtocolInfo.merchantProtocol = content;
                });   
            },
            _initSummernote:function(_textClass,_callFunc){
                let $summernote = $('.'+_textClass).summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onChange: function (contents, $editable) {
                            _callFunc(contents);
                        }
                    },
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['table', ['table']],
                        ['insert', ['link']],
                        ['help', ['help']]
                    ],
                });
            },
            _listRegisterProtocols: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/system.listRegisterProtocol',
                    param,
                    function (json, res) {
                        let _systemInfoManageInfo = JSON.parse(json);
                        vc.copyObject(_systemInfoManageInfo.data[0], $that.registerProtocolInfo);
                        $(".userProtocolSummernote").summernote('code', $that.registerProtocolInfo.userProtocol);
                        $(".merchantProtocolSummernote").summernote('code', $that.registerProtocolInfo.merchantProtocol);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _updateRegisterProtocol:function(){
                vc.http.apiPost(
                    '/system.updateRegisterProtocol',
                    JSON.stringify($that.registerProtocolInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $that._listRegisterProtocols();
                            vc.toast("修改成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);