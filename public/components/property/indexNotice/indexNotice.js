(function(vc) {
    vc.extends({
        data: {
            indexNoticeInfo: {
                notices:[]
            }
        },
        _initMethod: function() {
            $that._loadPropertyIndexNotices();
        },
        _initEvent: function() {
        },
        methods: {
            _loadPropertyIndexNotices: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/notice.listNotices',
                    param,
                    function (json, res) {
                        let _res = JSON.parse(json);
                       
                       $that.indexNoticeInfo.notices = _res.notices;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                       
                    }
                );
            }
        }
    })
})(window.vc);