/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            mainCategoryManageInfo: {
                mainCategorys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                mainCategoryId: '',
                conditions: {
                    categoryType: '',
                    categoryName: '',
                    mainCategoryId: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listMainCategorys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('mainCategoryManage', 'listMainCategory', function (_param) {
                vc.component._listMainCategorys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMainCategorys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMainCategorys: function (_page, _rows) {

                vc.component.mainCategoryManageInfo.conditions.page = _page;
                vc.component.mainCategoryManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.mainCategoryManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/productCategory/queryMainCategory',
                    param,
                    function (json, res) {
                        var _mainCategoryManageInfo = JSON.parse(json);
                        vc.component.mainCategoryManageInfo.total = _mainCategoryManageInfo.total;
                        vc.component.mainCategoryManageInfo.records = _mainCategoryManageInfo.records;
                        vc.component.mainCategoryManageInfo.mainCategorys = _mainCategoryManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.mainCategoryManageInfo.records,
                            dataCount: vc.component.mainCategoryManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMainCategoryModal: function () {
                vc.emit('addMainCategory', 'openAddMainCategoryModal', {});
            },
            _openEditMainCategoryModel: function (_mainCategory) {
                vc.emit('editMainCategory', 'openEditMainCategoryModal', _mainCategory);
            },
            _openDeleteMainCategoryModel: function (_mainCategory) {
                vc.emit('deleteMainCategory', 'openDeleteMainCategoryModal', _mainCategory);
            },
            _queryMainCategoryMethod: function () {
                vc.component._listMainCategorys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.mainCategoryManageInfo.moreCondition) {
                    vc.component.mainCategoryManageInfo.moreCondition = false;
                } else {
                    vc.component.mainCategoryManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
