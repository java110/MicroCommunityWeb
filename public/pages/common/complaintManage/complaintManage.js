/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            complaintManageInfo: {
                complaints: [],
                total: 0,
                records: 1,
                moreCondition: false,
                complaintName: '',
                conditions: {
                    complaintId: '',
                    typeCd: '',
                    complaintName: '',
                    tel: '',
                    roomId: '',
                    state: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function() {
            vc.component._initComplaintDate();
            vc.component._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('complaintManage', 'listComplaint', function(_param) {
                vc.component._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listComplaints(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initComplaintDate: function() {
                $(".start_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.start_time').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".start_time").val();
                        vc.component.complaintManageInfo.conditions.startTime = value;
                    });
                $(".end_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.end_time').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".end_time").val();
                        var start = Date.parse(new Date(vc.component.complaintManageInfo.conditions.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".end_time").val('')
                        } else {
                            vc.component.complaintManageInfo.conditions.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName("form-control start_time")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control end_time")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listComplaints: function(_page, _rows) {
                vc.component.complaintManageInfo.conditions.page = _page;
                vc.component.complaintManageInfo.conditions.row = _rows;
                vc.component.complaintManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.complaintManageInfo.conditions
                };
                param.params.complaintId = param.params.complaintId.trim();
                param.params.complaintName = param.params.complaintName.trim();
                param.params.tel = param.params.tel.trim();
                param.params.roomId = param.params.roomId.trim();
                //发送get请求
                vc.http.get('complaintManage',
                    'list',
                    param,
                    function(json, res) {
                        var _complaintManageInfo = JSON.parse(json);
                        vc.component.complaintManageInfo.total = _complaintManageInfo.total;
                        vc.component.complaintManageInfo.records = _complaintManageInfo.records;
                        vc.component.complaintManageInfo.complaints = _complaintManageInfo.complaints;
                        vc.emit('pagination', 'init', {
                            total: vc.component.complaintManageInfo.records,
                            dataCount: vc.component.complaintManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddComplaintModal: function() {
                //vc.emit('addComplaint', 'openAddComplaintModal', {});
                vc.jumpToPage("/#/pages/common/addComplaintStep")
            },
            _openEditComplaintModel: function(_complaint) {
                vc.emit('editComplaint', 'openEditComplaintModal', _complaint);
            },
            _openDeleteComplaintModel: function(_complaint) {
                vc.emit('deleteComplaint', 'openDeleteComplaintModal', _complaint);
            },
            //查询
            _queryComplaintMethod: function() {
                vc.component._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetComplaintMethod: function() {
                vc.component.complaintManageInfo.conditions.complaintId = "";
                vc.component.complaintManageInfo.conditions.typeCd = "";
                vc.component.complaintManageInfo.conditions.complaintName = "";
                vc.component.complaintManageInfo.conditions.tel = "";
                vc.component.complaintManageInfo.conditions.roomId = "";
                vc.component.complaintManageInfo.conditions.state = "";
                vc.component.complaintManageInfo.conditions.startTime = "";
                vc.component.complaintManageInfo.conditions.endTime = "";
                vc.component._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openComplaintDetailModel: function(_complaint) {
                vc.emit('complaintDetail', 'openComplaintDetailModal', _complaint);
            },
            _moreCondition: function() {
                if (vc.component.complaintManageInfo.moreCondition) {
                    vc.component.complaintManageInfo.moreCondition = false;
                } else {
                    vc.component.complaintManageInfo.moreCondition = true;
                }
            },
            _openRunWorkflowImage: function(_complaint) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _complaint.complaintId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function(json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);

                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);