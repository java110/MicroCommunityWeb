/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            itemReleaseTypeManageInfo: {
                itemReleaseTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                typeId: '',
                conditions: {
                    typeId: '',
                    typeName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function() {
            $that._listItemReleaseTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('itemReleaseTypeManage', 'listItemReleaseType', function(_param) {
                $that._listItemReleaseTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listItemReleaseTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listItemReleaseTypes: function(_page, _rows) {
                $that.itemReleaseTypeManageInfo.conditions.page = _page;
                $that.itemReleaseTypeManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.itemReleaseTypeManageInfo.conditions
                };
                param.params.typeName = param.params.typeName.trim();
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseType',
                    param,
                    function(json, res) {
                        var _itemReleaseTypeManageInfo = JSON.parse(json);
                        $that.itemReleaseTypeManageInfo.total = _itemReleaseTypeManageInfo.total;
                        $that.itemReleaseTypeManageInfo.records = _itemReleaseTypeManageInfo.records;
                        $that.itemReleaseTypeManageInfo.itemReleaseTypes = _itemReleaseTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.itemReleaseTypeManageInfo.records,
                            dataCount: $that.itemReleaseTypeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddItemReleaseTypeModal: function() {
                vc.emit('addItemReleaseType', 'openAddItemReleaseTypeModal', {});
            },
            _openEditItemReleaseTypeModel: function(_itemReleaseType) {
                vc.emit('editItemReleaseType', 'openEditItemReleaseTypeModal', _itemReleaseType);
            },
            _openDeleteItemReleaseTypeModel: function(_itemReleaseType) {
                vc.emit('deleteItemReleaseType', 'openDeleteItemReleaseTypeModal', _itemReleaseType);
            },
            _queryItemReleaseTypeMethod: function() {
                $that._listItemReleaseTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetItemReleaseTypeMethod: function() {
                $that.itemReleaseTypeManageInfo.conditions.typeName = "";
                $that._listItemReleaseTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.itemReleaseTypeManageInfo.moreCondition) {
                    $that.itemReleaseTypeManageInfo.moreCondition = false;
                } else {
                    $that.itemReleaseTypeManageInfo.moreCondition = true;
                }
            },
            _settingFlow: function(itemReleaseType) {
                window.open('/bpmnjs/index.html?flowId=' + itemReleaseType.flowId + "&modelId=" + itemReleaseType.modelId);
            },
            _openDeployWorkflow: function(itemReleaseType) {
                let _param = {
                    modelId: itemReleaseType.modelId
                };
                //发送get请求
                vc.http.apiPost('/workflow/deployModel',
                    JSON.stringify(_param), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg)
                        vc.emit('itemReleaseTypeManage', 'listItemReleaseType', {});
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);