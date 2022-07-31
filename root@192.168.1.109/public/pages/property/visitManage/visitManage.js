/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            appManageInfo: {
                apps: [],
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
            // location.reload();
            vc.component._initDate();
            vc.component._listApps(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('appManage', 'listApp', function (_param) {
                vc.component._listApps(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listApps(_currentPage, DEFAULT_ROWS);
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
                        vc.component.appManageInfo.conditions.visitStartTime = value;
                    });
                $('.visitEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".visitEndTime").val();
                        vc.component.appManageInfo.conditions.visitEndTime = value;
                        let start = Date.parse(new Date($that.appManageInfo.conditions.visitStartTime))
                        let end = Date.parse(new Date($that.appManageInfo.conditions.visitEndTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.appManageInfo.conditions.visitEndTime = '';
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
            _listApps: function (_page, _rows) {
                vc.component.appManageInfo.conditions.page = _page;
                vc.component.appManageInfo.conditions.row = _rows;
                vc.component.appManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.appManageInfo.conditions
                };
                param.params.vName = param.params.vName.trim();
                param.params.phoneNumber = param.params.phoneNumber.trim();
                //发送get请求
                vc.http.get('visitManage',
                    'list',
                    param,
                    function (json, res) {
                        var _visitManageInfo = JSON.parse(json);
                        vc.component.appManageInfo.total = _visitManageInfo.total;
                        vc.component.appManageInfo.records = _visitManageInfo.records;
                        vc.component.appManageInfo.visits = _visitManageInfo.visits;
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
            _queryAppManageInfoMethod: function () {
                vc.component._listApps(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAppManageInfoMethod: function () {
                vc.component.appManageInfo.conditions.vName = "";
                vc.component.appManageInfo.conditions.visitStartTime = "";
                vc.component.appManageInfo.conditions.visitEndTime = "";
                vc.component.appManageInfo.conditions.phoneNumber = "";
                vc.component._listApps(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.appManageInfo.moreCondition) {
                    vc.component.appManageInfo.moreCondition = false;
                } else {
                    vc.component.appManageInfo.moreCondition = true;
                }
            },
            _openAddVisitModal: function () {
                vc.jumpToPage("/#/pages/property/addVisitSpace")
                // vc.emit('addApp','openAddAppModal',{});
            },
            //审核
            _openExamineVisitModel: function (_app) {
                vc.emit('examineVisit', 'openExamineVisitModel', _app);
            },
            _openEditVisitModel: function (_app) {
                vc.emit('editVisit', 'openEditVisitModel', _app);
                // vc.emit('deleteApp','openDeleteAppModal',_app);
            },
            _openDeleteAppModel: function (_app) {
                vc.emit('deleteApp', 'openDeleteAppModel', _app);
            },
            showImg: function (e) {
                if (!e) {
                    e = '/img/noPhoto.jpg';
                }
                vc.emit('viewImage', 'showImage', {url: e});
            }
        }
    });
})(window.vc);