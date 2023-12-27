/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            copyWorkInfo: {
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
                audit:{
                    copyId:'',
                    auditMessage:'',
                },
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
            $that._listCopyWorks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('copyWork', 'listCopyWork', function (_param) {
                $that._listCopyWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listCopyWorks(_currentPage, DEFAULT_ROWS);
            });
            vc.initDateTime('queryStartTime',function(_value){
                $that.copyWorkInfo.conditions.queryStartTime = _value;
            })
            vc.initDateTime('queryEndTime',function(_value){
                $that.copyWorkInfo.conditions.queryEndTime = _value;
            })
        },
        methods: {
            _listCopyWorks: function (_page, _rows) {
                $that.copyWorkInfo.conditions.page = _page;
                $that.copyWorkInfo.conditions.row = _rows;
                var param = {
                    params: $that.copyWorkInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/work.queryCopyWork',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.copyWorkInfo.total = _json.total;
                        $that.copyWorkInfo.records = _json.records;
                        $that.copyWorkInfo.works = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.copyWorkInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openCopyWorkModel:function(_work){
                $('#auditModel').modal('show');
                $that.copyWorkInfo.audit.copyId = _work.copyId;
            },
            _queryCopyWorkMethod: function () {
                $that._listCopyWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchWorkState:function(_state){
                $that.copyWorkInfo.conditions.state = _state.state;
                $that._listCopyWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toWorkDetailPage:function(_work){
                vc.jumpToPage('/#/pages/oa/workDetail?workId='+_work.workId);
            },
            _auditSubmit: function () {
                vc.http.apiPost(
                    '/work.finishWorkCopy',
                    JSON.stringify($that.copyWorkInfo.audit), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('添加成功');
                            $('#auditModel').modal('hide');
                            $that._listCopyWorks(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);
