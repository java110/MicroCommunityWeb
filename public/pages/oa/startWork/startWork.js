/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            startWorkInfo: {
                works: [],
                states:[{
                    name:'全部',
                    state:''
                },{
                    name:'待处理',
                    state:'W'
                },{
                    name:'处理中',
                    state:'D'
                },{
                    name:'处理完成',
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
            $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('startWork', 'listStartWork', function (_param) {
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listStartWorks(_currentPage, DEFAULT_ROWS);
            });
            vc.initDateTime('queryStartTime',function(_value){
                $that.startWorkInfo.conditions.queryStartTime = _value;
            })
            vc.initDateTime('queryEndTime',function(_value){
                $that.startWorkInfo.conditions.queryEndTime = _value;
            })
        },
        methods: {
            _listStartWorks: function (_page, _rows) {
                $that.startWorkInfo.conditions.page = _page;
                $that.startWorkInfo.conditions.row = _rows;
                var param = {
                    params: $that.startWorkInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/work.queryStartWork',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.startWorkInfo.total = _json.total;
                        $that.startWorkInfo.records = _json.records;
                        $that.startWorkInfo.works = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.startWorkInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddStartWorkModal: function () {
                vc.jumpToPage('/#/pages/oa/addWork');
            },
            _openEditStartWorkModel: function (_startWork) {
                vc.jumpToPage('/#/pages/oa/editWork?workId='+_startWork.workId);
            },
            _openDeleteStartWorkModel: function (_startWork) {
                vc.emit('deleteWork','openDeleteWorkModal', _startWork);
            },
            _queryStartWorkMethod: function () {
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchWorkState:function(_state){
                $that.startWorkInfo.conditions.state = _state.state;
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);
