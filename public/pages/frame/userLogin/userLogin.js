(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            userLoginInfo: {
                moreCondition: false,
                logs: [],
                conditions: {
                    name: '',
                    tel: '',
                    userLoginId: ''
                }
            },
        },
        _initMethod: function () {
            $that.loadData(1, 10);

        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that.loadData(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            loadData: function (_page, _rows) {
                $that.userLoginInfo.conditions.page = _page;
                $that.userLoginInfo.conditions.rows = _rows;
                $that.userLoginInfo.conditions.row = _rows;
                var param = {
                    params: $that.userLoginInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/userLogin/queryUserLogin',
                    param,
                    function (json) {
                        let _userLoginInfo = JSON.parse(json);
                        $that.userLoginInfo.logs = _userLoginInfo.data;
                        vc.emit('pagination', 'init', {
                            total: _userLoginInfo.records,
                            dataCount: _userLoginInfo.total,
                            currentPage: _page
                        });

                    }, function () {
                        console.log('请求失败处理');
                    }
                );

            },
           

            _moreCondition: function () {
                if ($that.userLoginInfo.moreCondition) {
                    $that.userLoginInfo.moreCondition = false;
                } else {
                    $that.userLoginInfo.moreCondition = true;
                }
            },
           

            _queryuserLoginMethod: function () {
                $that.loadData(DEFAULT_PAGE, DEFAULT_ROWS)
            }


        },



    });

})(window.vc);