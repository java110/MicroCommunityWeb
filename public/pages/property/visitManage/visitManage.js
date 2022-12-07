/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            visitManageInfo: {
                visits: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    vName: '',
                    visitStartTime: '',
                    visitEndTime: '',
                    phoneNumber: ''
                },
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listVisits(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('visitManage', 'listVisit', function (_param) {
                vc.component._listVisits(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listVisits(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".visitStartTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".visitEndTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.visitStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".visitStartTime").val();
                        vc.component.visitManageInfo.conditions.visitStartTime = value;
                    });
                $('.visitEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".visitEndTime").val();
                        vc.component.visitManageInfo.conditions.visitEndTime = value;
                        let start = Date.parse(new Date($that.visitManageInfo.conditions.visitStartTime))
                        let end = Date.parse(new Date($that.visitManageInfo.conditions.visitEndTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.visitManageInfo.conditions.visitEndTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control visitStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control visitEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listVisits: function (_page, _rows) {
                vc.component.visitManageInfo.conditions.page = _page;
                vc.component.visitManageInfo.conditions.row = _rows;
                vc.component.visitManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.visitManageInfo.conditions
                };
                param.params.vName = param.params.vName.trim();
                param.params.phoneNumber = param.params.phoneNumber.trim();
                param.params.channel = "PC";
                //发送get请求
                vc.http.apiGet('/visit.listVisits',
                    param,
                    function (json, res) {
                        var _visitManageInfo = JSON.parse(json);
                        vc.component.visitManageInfo.total = _visitManageInfo.total;
                        vc.component.visitManageInfo.records = _visitManageInfo.records;
                        vc.component.visitManageInfo.visits = _visitManageInfo.visits;
                        vc.component.visitManageInfo.visits.forEach((item) => {
                            if (item.url != undefined) {
                                item.url = photoUrl + "?fileId=" + item.url + "&communityId=-1&time=" + new Date();
                            }
                        })
                        vc.emit('pagination', 'init', {
                            total: _visitManageInfo.records,
                            dataCount: _visitManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryVisitManageInfoMethod: function () {
                vc.component._listVisits(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetVisitManageInfoMethod: function () {
                vc.component.visitManageInfo.conditions.vName = "";
                vc.component.visitManageInfo.conditions.visitStartTime = "";
                vc.component.visitManageInfo.conditions.visitEndTime = "";
                vc.component.visitManageInfo.conditions.phoneNumber = "";
                vc.component._listVisits(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.visitManageInfo.moreCondition) {
                    vc.component.visitManageInfo.moreCondition = false;
                } else {
                    vc.component.visitManageInfo.moreCondition = true;
                }
            },
            _openAddVisitModal: function () {
                vc.jumpToPage("/#/pages/property/addVisitSpace")
                // vc.emit('addVisit','openAddVisitModal',{});
            },
            //审核
            _openExamineVisitModel: function (_visit) {
                vc.emit('examineVisit', 'openExamineVisitModel', _visit);
            },
            _openEditVisitModel: function (_visit) {
                vc.emit('editVisit', 'openEditVisitModel', _visit);
                // vc.emit('deleteVisit','openDeleteVisitModal',_visit);
            },
            _openDeleteVisitModel: function (_visit) {
                vc.emit('deleteVisit', 'openVisitModel', _visit);
            },
            _toAuditPage:function(){
                vc.jumpToPage('/#/pages/property/workflowManage?tab=流程管理');
            },
            showImg: function(e) {
                if (!e) {
                    e = '/img/noPhoto.jpg';
                }
                vc.emit('viewImage', 'showImage', {url: e});
            }
        }
    });
})(window.vc);