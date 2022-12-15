/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            classesManageInfo: {
                classess: [],
                total: 0,
                records: 1,
                moreCondition: false,
                classesId: '',
                conditions: {
                    classesId: '',
                    name: '',
                    state: '',

                }
            }
        },
        _initMethod: function() {
            vc.component._listClassess(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('classesManage', 'listClasses', function(_param) {
                vc.component._listClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listClassess(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listClassess: function(_page, _rows) {

                vc.component.classesManageInfo.conditions.page = _page;
                vc.component.classesManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.classesManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/classes.listClasses',
                    param,
                    function(json, res) {
                        var _classesManageInfo = JSON.parse(json);
                        vc.component.classesManageInfo.total = _classesManageInfo.total;
                        vc.component.classesManageInfo.records = _classesManageInfo.records;
                        vc.component.classesManageInfo.classess = _classesManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.classesManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddClassesModal: function() {
                vc.emit('addClasses', 'openAddClassesModal', {});
            },
            _openEditClassesModel: function(_classes) {
                vc.emit('editClasses', 'openEditClassesModal', _classes);
            },
            _openDeleteClassesModel: function(_classes) {
                vc.emit('deleteClasses', 'openDeleteClassesModal', _classes);
            },
            _queryClassesMethod: function() {
                vc.component._listClassess(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.classesManageInfo.moreCondition) {
                    vc.component.classesManageInfo.moreCondition = false;
                } else {
                    vc.component.classesManageInfo.moreCondition = true;
                }
            }, //启用计划
            _openEnabledClassesModel: function(_classes) {
                vc.emit('classesState', 'openClassesStateModal', {
                    classesId: _classes.classesId,
                    stateName: '启用',
                    state: '1001'
                });
            },
            //停用计划
            _openDisabledClassesModel: function(_classes) {
                vc.emit('classesState', 'openClassesStateModal', {
                    classesId: _classes.classesId,
                    stateName: '停用',
                    state: '2002'
                });
            },


        }
    });
})(window.vc);