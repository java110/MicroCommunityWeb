/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feePrintPageManageInfo: {
                feePrintPages: [],
                total: 0,
                records: 1,
                moreCondition: false,
                pageId: '',
                conditions: {
                    pageId: '',
                    pageName: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listFeePrintPages(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('feePrintPageManage', 'listFeePrintPage', function (_param) {
                vc.component._listFeePrintPages(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeePrintPages(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeePrintPages: function (_page, _rows) {

                vc.component.feePrintPageManageInfo.conditions.page = _page;
                vc.component.feePrintPageManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feePrintPageManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('feePrintPage.listFeePrintPage',
                    param,
                    function (json, res) {
                        var _feePrintPageManageInfo = JSON.parse(json);
                        vc.component.feePrintPageManageInfo.total = _feePrintPageManageInfo.total;
                        vc.component.feePrintPageManageInfo.records = _feePrintPageManageInfo.records;
                        vc.component.feePrintPageManageInfo.feePrintPages = _feePrintPageManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feePrintPageManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeePrintPageModal: function () {
                vc.emit('addFeePrintPage', 'openAddFeePrintPageModal', {});
            },
            _openEditFeePrintPageModel: function (_feePrintPage) {
                vc.emit('editFeePrintPage', 'openEditFeePrintPageModal', _feePrintPage);
            },
            _openDeleteFeePrintPageModel: function (_feePrintPage) {
                vc.emit('deleteFeePrintPage', 'openDeleteFeePrintPageModal', _feePrintPage);
            },
            _queryFeePrintPageMethod: function () {
                vc.component._listFeePrintPages(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            //重置
            _resetFeePrintPageMethod: function () {
                vc.component.feePrintPageManageInfo.conditions.pageId = "";
                vc.component.feePrintPageManageInfo.conditions.pageName = "";
                vc.component.feePrintPageManageInfo.conditions.state = "";
                vc.component._listFeePrintPages(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.feePrintPageManageInfo.moreCondition) {
                    vc.component.feePrintPageManageInfo.moreCondition = false;
                } else {
                    vc.component.feePrintPageManageInfo.moreCondition = true;
                }
            },
            updateFeePrintPageState: function (_printPage) {

                let _data = {
                    pageId: _printPage.pageId,
                    communityId: _printPage.communityId,
                    state: 'T'
                }

                vc.http.apiPost(
                    'feePrintPage.updateFeePrintPage',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('feePrintPageManage', 'listFeePrintPage', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },


        }
    });
})(window.vc);
