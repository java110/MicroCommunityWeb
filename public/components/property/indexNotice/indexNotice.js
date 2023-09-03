(function (vc) {
    vc.extends({
        data: {
            indexNoticeInfo: {
                notices: [],
                scrollInterval: null,
                scrollTopValue: 0,
                scrollDirection: true,
            }
        },
        _initMethod: function () {
            $that._loadPropertyIndexNotices();
        },
        _initEvent: function() {},
        methods: {
            _loadPropertyIndexNotices: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/notepad.listNotepad',
                    param,
                    function(json, res) {
                        let _res = JSON.parse(json);

                        $that.indexNoticeInfo.notices = _res.data;
                        $that.$nextTick(function() {
                            setInterval($that.checkPoolScroll, 2000);
                        })
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                    }
                );
            },
            checkPoolScroll: function() {
                let element = document.getElementById("pool");
                if (!element) { return; }
                let clientHeight = element.clientHeight;
                let scrollHeight = element.scrollHeight;
                if (scrollHeight > clientHeight) {
                    if (!$that.indexNoticeInfo.scrollInterval) {
                        $that.indexNoticeInfo.scrollInterval = setInterval($that.poolScroll, 5000);
                    }
                } else {
                    clearInterval($that.indexNoticeInfo.scrollInterval);
                    $that.indexNoticeInfo.scrollInterval = null;
                }
            },
            poolScroll: function() {
                let element = document.getElementById("pool");
                if (!element) { return; }
                var clientHeight = element.clientHeight;
                var scrollHeight = element.scrollHeight;
                var canScrollHeight = scrollHeight - clientHeight;
                // var preScrollHeight = canScrollHeight / 3.7;
                // 向下滾動
                if ($that.indexNoticeInfo.scrollTopValue <= 0) {
                    $that.indexNoticeInfo.scrollDirection = true;
                }
                if ($that.indexNoticeInfo.scrollDirection) {
                    $that.indexNoticeInfo.scrollTopValue += canScrollHeight / 1200;
                } else {
                    $that.indexNoticeInfo.scrollTopValue -= canScrollHeight / 1200;
                }
                // 觸底改變方向
                if (canScrollHeight <= $that.indexNoticeInfo.scrollTopValue) {
                    $that.indexNoticeInfo.scrollDirection = !$that.indexNoticeInfo.scrollDirection;
                }
            }
        }
    })
})(window.vc);