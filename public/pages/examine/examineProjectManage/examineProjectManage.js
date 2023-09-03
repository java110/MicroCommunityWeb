/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            examineProjectManageInfo: {
                examineProjects: [],
                total: 0,
                records: 1,
                moreCondition: false,
                projectId: '',
                conditions: {
                    name: '',
                    post: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listExamineProjects(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('examineProjectManage', 'listExamineProject', function(_param) {
                vc.component._listExamineProjects(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listExamineProjects(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listExamineProjects: function(_page, _rows) {

                vc.component.examineProjectManageInfo.conditions.page = _page;
                vc.component.examineProjectManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.examineProjectManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/examine.listExamineProject',
                    param,
                    function(json, res) {
                        var _examineProjectManageInfo = JSON.parse(json);
                        vc.component.examineProjectManageInfo.total = _examineProjectManageInfo.total;
                        vc.component.examineProjectManageInfo.records = _examineProjectManageInfo.records;
                        vc.component.examineProjectManageInfo.examineProjects = _examineProjectManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.examineProjectManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddExamineProjectModal: function() {
                vc.emit('addExamineProject', 'openAddExamineProjectModal', {});
            },
            _openEditExamineProjectModel: function(_examineProject) {
                vc.emit('editExamineProject', 'openEditExamineProjectModal', _examineProject);
            },
            _openDeleteExamineProjectModel: function(_examineProject) {
                vc.emit('deleteExamineProject', 'openDeleteExamineProjectModal', _examineProject);
            },
            _queryExamineProjectMethod: function() {
                vc.component._listExamineProjects(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.examineProjectManageInfo.moreCondition) {
                    vc.component.examineProjectManageInfo.moreCondition = false;
                } else {
                    vc.component.examineProjectManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);