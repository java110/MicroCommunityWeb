/**
 入驻小区
 **/
(function(vc) {
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
                    isShow: '',
                    shId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('storehouse', "sh_type", function(_data) {
                $that.storehouseManageInfo.shTypes = _data;
            });
        },
        _initEvent: function() {
            vc.on('storehouseManage', 'listStorehouse', function(_param) {
                $that._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listStorehouses: function(_page, _rows) {
                $that.storehouseManageInfo.conditions.page = _page;
                $that.storehouseManageInfo.conditions.row = _rows;
                $that.storehouseManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.storehouseManageInfo.conditions
                };
                param.params.shName = param.params.shName.trim();
                param.params.shId = param.params.shId.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        $that.storehouseManageInfo.total = _storehouseManageInfo.total;
                        $that.storehouseManageInfo.records = _storehouseManageInfo.records;
                        $that.storehouseManageInfo.storehouses = _storehouseManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.storehouseManageInfo.records,
                            dataCount: $that.storehouseManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetStorehouses: function(_page, _rows) {
                $that.storehouseManageInfo.conditions.shId = "";
                $that.storehouseManageInfo.conditions.shName = "";
                $that.storehouseManageInfo.conditions.shType = "";
                $that.storehouseManageInfo.conditions.isShow = "";
                $that._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddStorehouseModal: function() {
                vc.emit('addStorehouse', 'openAddStorehouseModal', {});
            },
            _openEditStorehouseModel: function(_storehouse) {
                vc.emit('editStorehouse', 'openEditStorehouseModal', _storehouse);
            },
            _openDeleteStorehouseModel: function(_storehouse) {
                vc.emit('deleteStorehouse', 'openDeleteStorehouseModal', _storehouse);
            },
            _openDetailStorehouseModel: function(_storehouse) {
                vc.jumpToPage("/#/pages/common/resourceStoreManage?shId=" + _storehouse.shId);
            },
            _queryStorehouseMethod: function() {
                $that._listStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetStorehouseMethod: function() {
                $that._resetStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toAuditPage: function() {
                vc.jumpToPage('/#/pages/property/workflowManage?tab=流程管理');
            },
            _moreCondition: function() {
                if ($that.storehouseManageInfo.moreCondition) {
                    $that.storehouseManageInfo.moreCondition = false;
                } else {
                    $that.storehouseManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);