/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffAttendanceManageInfo: {
                staffs: [],
                classesId: '',
                orgId: '',
                orgName: '',
                curDate: vc.dateFormat(new Date()),
                curYear: '',
                curMonth: '',
                maxDay: '',
            }
        },
        _initMethod: function() {
            vc.component._loadStaffs();
            $that.initStaffDate();
        },
        _initEvent: function() {
            vc.on('monthAttendanceManage', 'listMonthAttendance', function(_param) {
                vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMonthAttendances(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadStaffs: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        orgId: $that.staffAttendanceManageInfo.orgId,
                    }
                }
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function(json) {
                        let _staffInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        let staffList = _staffInfo.staffs;
                        $that.staffAttendanceManageInfo.staffs = staffList;

                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            initStaffDate: function() {
                let _date = new Date($that.staffAttendanceManageInfo.curDate);
                $that.staffAttendanceManageInfo.curMonth = _date.getMonth() + 1
                $that.staffAttendanceManageInfo.curYear = _date.getFullYear();
                $that.staffAttendanceManageInfo.maxDay = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();
            },
            _getAttendanceState: function() {

            },
            _getBgColor: function(_curDay) {

                return "#fff"
            },

            _staffAttendanceChangeOrg: function() {

            }
        }
    });
})(window.vc);