/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            noticeManageInfo: {
                notices: [],
                total: 0,
                records: 1,
                moreCondition: false,
                componentShow: 'noticeList',
                conditions: {
                    title: '',
                    noticeTypeCd: '',
                    state: '',
                    noticeId: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function() {
            vc.component._initNoticeDateInfo();
            vc.component._listNotices(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('noticeManage', 'listNotice', function(_param) {
                vc.component.noticeManageInfo.componentShow = 'noticeList';
                vc.component._listNotices(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listNotices(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initNoticeDateInfo: function() {
                $('.noticeStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.noticeStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".noticeStartTime").val();
                        vc.component.noticeManageInfo.conditions.startTime = value;
                    });
                $('.noticeEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.noticeEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".noticeEndTime").val();
                        vc.component.noticeManageInfo.conditions.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control noticeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control noticeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listNotices: function(_page, _rows) {
                vc.component.noticeManageInfo.conditions.page = _page;
                vc.component.noticeManageInfo.conditions.row = _rows;
                vc.component.noticeManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.noticeManageInfo.conditions
                };
                param.params.noticeId = param.params.noticeId.trim();
                param.params.title = param.params.title.trim();
                //发送get请求
                vc.http.get('noticeManage',
                    'list',
                    param,
                    function(json, res) {
                        var _noticeManageInfo = JSON.parse(json);
                        vc.component.noticeManageInfo.total = _noticeManageInfo.total;
                        vc.component.noticeManageInfo.records = _noticeManageInfo.records;
                        vc.component.noticeManageInfo.notices = _noticeManageInfo.notices;
                        vc.emit('pagination', 'init', {
                            total: vc.component.noticeManageInfo.records,
                            dataCount: vc.component.noticeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddNoticeModal: function() {
                vc.component.noticeManageInfo.componentShow = 'addNoticeView';
                vc.emit('addNoticeView', 'openAddNoticeView', {});
            },
            _openEditNoticeModel: function(_notice) {
                vc.emit('editNoticeView', 'noticeEditNoticeInfo', _notice);
                vc.component.noticeManageInfo.componentShow = 'editNoticeView';
            },
            _openDeleteNoticeModel: function(_notice) {
                vc.emit('deleteNotice', 'openDeleteNoticeModal', _notice);
            },
            _openNoticeDetail: function(_notice) {
                vc.jumpToPage("/#/pages/common/noticeDetail?noticeId=" + _notice.noticeId);
            },
            //查询
            _queryNoticeMethod: function() {
                vc.component._listNotices(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetNoticeMethod: function() {
                vc.component.noticeManageInfo.conditions.noticeId = "";
                vc.component.noticeManageInfo.conditions.noticeTypeCd = "";
                vc.component.noticeManageInfo.conditions.state = "";
                vc.component.noticeManageInfo.conditions.title = "";
                vc.component.noticeManageInfo.conditions.startTime = "";
                vc.component.noticeManageInfo.conditions.endTime = "";
                vc.component._listNotices(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.noticeManageInfo.moreCondition) {
                    vc.component.noticeManageInfo.moreCondition = false;
                } else {
                    vc.component.noticeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);