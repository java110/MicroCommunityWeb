(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            userLoginInfo: {
                moreCondition: false,
                logs: [],
                stores:[],
                conditions: {
                    name: '',
                    tel: '',
                    userLoginId: '',
                    storeId:'',
                    startTime:'',
                    endTime:''
                }
            },
        },
        _initMethod: function () {
            $that.loadData(1, DEFAULT_ROWS);
            $that._listListStores();

            vc.initDateTime('startTime',function(_value){
                $that.userLoginInfo.conditions.startTime = _value;
            });
            vc.initDateTime('endTime',function(_value){
                $that.userLoginInfo.conditions.endTime = _value;
            })

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
           

            _queryUserLoginMethod: function () {
                $that.loadData(DEFAULT_PAGE, DEFAULT_ROWS)
            },
            _listListStores: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };

                $that.userLoginInfo.stores = [{
                    storeId: '',
                    name: '全部'
                }];

                //发送get请求
                vc.http.apiGet('/store.listStores',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        _json.data.forEach(item => {
                            $that.userLoginInfo.stores.push(item);
                        });
                     
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            swatchStore:function(_app){
                $that.userLoginInfo.conditions.storeId = _app.storeId;
                $that.loadData(1, DEFAULT_ROWS);
            },


        },



    });

})(window.vc);