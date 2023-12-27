/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            doWorkInfo: {
                works: [],
                states:[{
                    name:'全部',
                    state:''
                },{
                    name:'待处理',
                    state:'W'
                },{
                    name:'已处理',
                    state:'C'
                }],
                total: 0,
                records: 1,
                moreCondition: false,
                wtId: '',
                conditions: {
                    state:'',
                    typeName: '',
                    timeout: '',
                    queryEndTime:'',
                    queryStartTime:'',
                }
            }
        },
        _initMethod: function () {
            $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('doWork', 'listDoWork', function (_param) {
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listDoWorks(_currentPage, DEFAULT_ROWS);
            });
            vc.initDateTime('queryStartTime',function(_value){
                $that.doWorkInfo.conditions.queryStartTime = _value;
            })
            vc.initDateTime('queryEndTime',function(_value){
                $that.doWorkInfo.conditions.queryEndTime = _value;
            })
        },
        methods: {
            _listDoWorks: function (_page, _rows) {
                $that.doWorkInfo.conditions.page = _page;
                $that.doWorkInfo.conditions.row = _rows;
                var param = {
                    params: $that.doWorkInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/work.queryTaskWork',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.doWorkInfo.total = _json.total;
                        $that.doWorkInfo.records = _json.records;
                        $that.doWorkInfo.works = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.doWorkInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openTodoTaskDetail:function(_work){
                vc.jumpToPage('/#/pages/oa/workTaskDetail?workId='+_work.workId+"&taskId="+_work.taskId+"&todo=ON");
            },
            _queryDoWorkMethod: function () {
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchWorkState:function(_state){
                $that.doWorkInfo.conditions.state = _state.state;
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _toWorkDetailPage:function(_work){
                vc.jumpToPage('/#/pages/oa/workDetail?workId='+_work.workId);
            },
        }
    });
})(window.vc);
