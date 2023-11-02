/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            examineStaffValueInfo: {
                values: [],
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
            vc.component._listExamineStaffValues(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listExamineStaffValues(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listExamineStaffValues: function (_page, _rows) {
                vc.component.examineStaffValueInfo.conditions.page = _page;
                vc.component.examineStaffValueInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.examineStaffValueInfo.conditions
                };
                param.params.staffName = param.params.staffName.trim();
                param.params.projectName = param.params.projectName.trim();
                //发送get请求
                vc.http.apiGet('/examine.listExamineStaffValue',
                    param,
                    function (json, res) {
                        var _examineStaffValueInfo = JSON.parse(json);
                        vc.component.examineStaffValueInfo.total = _examineStaffValueInfo.total;
                        vc.component.examineStaffValueInfo.records = _examineStaffValueInfo.records;
                        vc.component.examineStaffValueInfo.values = _examineStaffValueInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.examineStaffValueInfo.records,
                            dataCount: vc.component.examineStaffValueInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryExamineStaffMethod: function () {
                vc.component._listExamineStaffValues(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetExamineStaffMethod: function () {
                vc.component.examineStaffValueInfo.conditions.staffName = "";
                vc.component.examineStaffValueInfo.conditions.projectName = "";
                vc.component._listExamineStaffValues(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.examineStaffValueInfo.moreCondition) {
                    vc.component.examineStaffValueInfo.moreCondition = false;
                } else {
                    vc.component.examineStaffValueInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);