/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            examineStaffManageInfo: {
                examineStaffs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                esId: '',
                conditions: {
                    staffId: '',
                    staffName: '',
                    projectName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listExamineStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('examineStaffManage', 'listExamineStaff', function (_param) {
                vc.component._listExamineStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listExamineStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listExamineStaffs: function (_page, _rows) {
                vc.component.examineStaffManageInfo.conditions.page = _page;
                vc.component.examineStaffManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.examineStaffManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/examine.listExamineStaff',
                    param,
                    function (json, res) {
                        var _examineStaffManageInfo = JSON.parse(json);
                        vc.component.examineStaffManageInfo.total = _examineStaffManageInfo.total;
                        vc.component.examineStaffManageInfo.records = _examineStaffManageInfo.records;
                        vc.component.examineStaffManageInfo.examineStaffs = _examineStaffManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.examineStaffManageInfo.records,
                            dataCount: vc.component.examineStaffManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddExamineStaffModal: function () {
                vc.jumpToPage('/#/pages/examine/addExamineStaff')
            },
            _openEditExamineStaffModel: function (_examineStaff) {
                vc.jumpToPage('/#/pages/examine/editExamineStaff?esId=' + _examineStaff.esId);
            },
            _openDeleteExamineStaffModel: function (_examineStaff) {
                vc.emit('deleteExamineStaff', 'openDeleteExamineStaffModal', _examineStaff);
            },
            _queryExamineStaffMethod: function () {
                vc.component._listExamineStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetExamineStaffMethod: function () {
                vc.component.examineStaffManageInfo.conditions.staffName = "";
                vc.component.examineStaffManageInfo.conditions.projectName = "";
                vc.component._listExamineStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.examineStaffManageInfo.moreCondition) {
                    vc.component.examineStaffManageInfo.moreCondition = false;
                } else {
                    vc.component.examineStaffManageInfo.moreCondition = true;
                }
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