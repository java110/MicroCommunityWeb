/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            scheduleClassesStaffManageInfo: {
                scheduleClassesStaffs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                scsId: '',
                conditions: {
                    scheduleId: '',
                    storeId: '',
                    staffId: '',
                    staffName: '',

                }
            }
        },
        _initMethod: function () {
            $that.scheduleClassesStaffManageInfo.conditions.scheduleId = vc.getParam('scheduleId');
            vc.component._listScheduleClassesStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('scheduleClassesStaffManage', 'listScheduleClassesStaff', function (_param) {
                vc.component._listScheduleClassesStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listScheduleClassesStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listScheduleClassesStaffs: function (_page, _rows) {

                vc.component.scheduleClassesStaffManageInfo.conditions.page = _page;
                vc.component.scheduleClassesStaffManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.scheduleClassesStaffManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClassesStaff',
                    param,
                    function (json, res) {
                        var _scheduleClassesStaffManageInfo = JSON.parse(json);
                        vc.component.scheduleClassesStaffManageInfo.total = _scheduleClassesStaffManageInfo.total;
                        vc.component.scheduleClassesStaffManageInfo.records = _scheduleClassesStaffManageInfo.records;
                        vc.component.scheduleClassesStaffManageInfo.scheduleClassesStaffs = _scheduleClassesStaffManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.scheduleClassesStaffManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddScheduleClassesStaffModal: function () {
                vc.emit('addScheduleClassesStaff', 'openAddScheduleClassesStaffModal', {
                    scheduleId:$that.scheduleClassesStaffManageInfo.conditions.scheduleId
                });
            },
            _openDeleteScheduleClassesStaffModel: function (_scheduleClassesStaff) {
                vc.emit('deleteScheduleClassesStaff', 'openDeleteScheduleClassesStaffModal', _scheduleClassesStaff);
            },
            _queryScheduleClassesStaffMethod: function () {
                vc.component._listScheduleClassesStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.scheduleClassesStaffManageInfo.moreCondition) {
                    vc.component.scheduleClassesStaffManageInfo.moreCondition = false;
                } else {
                    vc.component.scheduleClassesStaffManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
