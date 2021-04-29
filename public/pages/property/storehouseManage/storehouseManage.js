/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            storehouseManageInfo: {
                storehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                shId: '',
                shTypes: [],
                conditions: {
                    shName: '',
                    shType: '',
                    shId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('storehouse', "sh_type", function (_data) {
                vc.component.storehouseManageInfo.shTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('storehouseManage', 'listStorehouse', function (_param) {
                vc.component._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listStorehouses: function (_page, _rows) {
                vc.component.storehouseManageInfo.conditions.page = _page;
                vc.component.storehouseManageInfo.conditions.row = _rows;
                vc.component.storehouseManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.storehouseManageInfo.conditions
                };
                param.params.shName = param.params.shName.trim();
                param.params.shId = param.params.shId.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        vc.component.storehouseManageInfo.total = _storehouseManageInfo.total;
                        vc.component.storehouseManageInfo.records = _storehouseManageInfo.records;
                        vc.component.storehouseManageInfo.storehouses = _storehouseManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.storehouseManageInfo.records,
                            dataCount: vc.component.storehouseManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetStorehouses: function (_page, _rows) {
                vc.component.storehouseManageInfo.conditions.shId = "";
                vc.component.storehouseManageInfo.conditions.shName = "";
                vc.component.storehouseManageInfo.conditions.shType = "";
                $that._listStorehouses(DEFAULT_PAGE,DEFAULT_ROWS);
            },
            _openAddStorehouseModal: function () {
                vc.emit('addStorehouse', 'openAddStorehouseModal', {});
            },
            _openEditStorehouseModel: function (_storehouse) {
                vc.emit('editStorehouse', 'openEditStorehouseModal', _storehouse);
            },
            _openDeleteStorehouseModel: function (_storehouse) {
                vc.emit('deleteStorehouse', 'openDeleteStorehouseModal', _storehouse);
            },
            _openDetailStorehouseModel: function (_storehouse) {
                console.log(_storehouse);
                vc.jumpToPage("/admin.html#/pages/common/resourceStoreManage?shId=" + _storehouse.shId);
            },

            _queryStorehouseMethod: function () {
                vc.component._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetStorehouseMethod: function () {
                vc.component._resetStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.storehouseManageInfo.moreCondition) {
                    vc.component.storehouseManageInfo.moreCondition = false;
                } else {
                    vc.component.storehouseManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
