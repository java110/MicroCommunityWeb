/**
 入驻小区
 **/
 (function(vc) {
    vc.extends({
        data: {
            ssoInfo: {
                errMsg:''
            }
        },
        _initMethod: function() {
            let _hcAccessToken = vc.getParam('hcAccessToken');
            if(!_hcAccessToken){
                $that.ssoInfo.errMsg = '未包含hcAccessToken，请联系系统管理员';
                return;
            }

            let _targetUrl = vc.getParam('targetUrl');
            if(!_targetUrl){
                $that.ssoInfo.errMsg = '未包含targetUrl 或者未用 targetUrl 未用encodeURIComponent 编码';
            }
            $that._authLogin(_hcAccessToken,_targetUrl);
        },
        _initEvent: function() {

        },
        methods: {
            _authLogin:function(_hcAccessToken,_targetUrl){
                console.log(_targetUrl)
                let _dataObj = {
                        hcAccessToken: _hcAccessToken,
                    }
                    //发送get请求
                vc.http.apiPost('/login.accessTokenLogin',
                    JSON.stringify(_dataObj),
                    {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            $that.ssoInfo.errMsg = _data.msg;
                            return;
                        }
                        vc.emit('initData', 'loadCommunityInfo', {
                            url: decodeURIComponent(_targetUrl)
                        });
                        //vc.jumpToPage(decodeURIComponent(_targetUrl));
                    },
                    function(errInfo, error) {
                        console.log(errInfo);
                    }
                );
            },
            
        }
    });
})(window.vc);