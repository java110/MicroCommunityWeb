/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            sysDocumentManageInfo: {
                sysDocuments: [],
                total: 0,
                records: 1,
                moreCondition: false,
                componentShow: 'sysDocumentList',
                title: '',
                typeCds: [],
                conditions: {
                    docTitle: '',
                    docCode: '',
                    docId: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listSysDocuments(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('sysDocumentManage', 'listSysDocument', function (_param) {
                vc.component.sysDocumentManageInfo.componentShow = 'sysDocumentList';
                vc.component._listSysDocuments(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSysDocuments(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSysDocuments: function (_page, _rows) {

                vc.component.sysDocumentManageInfo.conditions.page = _page;
                vc.component.sysDocumentManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.sysDocumentManageInfo.conditions
                };

                //发送get请求
                vc.http.get('sysDocumentManage',
                    'list',
                    param,
                    function (json, res) {
                        var _sysDocumentManageInfo = JSON.parse(json);
                        vc.component.sysDocumentManageInfo.total = _sysDocumentManageInfo.total;
                        vc.component.sysDocumentManageInfo.records = _sysDocumentManageInfo.records;
                        vc.component.sysDocumentManageInfo.sysDocuments = _sysDocumentManageInfo.sysDocuments;
                        vc.emit('pagination', 'init', {
                            total: vc.component.sysDocumentManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddSysDocumentModal: function () {
                vc.component.sysDocumentManageInfo.componentShow = 'addSysDocumentView';
                vc.emit('addSysDocumentView', 'openAddSysDocumentView', {
          
                });

            },
            _openEditSysDocumentModel: function (_sysDocument) {

                vc.emit('editSysDocumentView', 'sysDocumentEditSysDocumentInfo', _sysDocument);
                vc.component.sysDocumentManageInfo.componentShow = 'editSysDocumentView';
            },
            _openDeleteSysDocumentModel: function (_sysDocument) {
                vc.emit('deleteSysDocument', 'openDeleteSysDocumentModal', _sysDocument);
            },
            _querySysDocumentMethod: function () {
                vc.component._listSysDocuments(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.sysDocumentManageInfo.moreCondition) {
                    vc.component.sysDocumentManageInfo.moreCondition = false;
                } else {
                    vc.component.sysDocumentManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
