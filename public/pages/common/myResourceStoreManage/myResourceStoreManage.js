/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            myResourceStoreManageInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                conditions: {
                    resId: '',
                    resName: '',
                    resCode: '',
                    shId: ''
                },
                storehouses: []
            }
        },
        _initMethod: function () {
            vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('myResourceStoreManage', 'listResourceStore', function (_param) {
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listResourceStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listResourceStores: function (_page, _rows) {
                vc.component.myResourceStoreManageInfo.conditions.page = _page;
                vc.component.myResourceStoreManageInfo.conditions.row = _rows;
                vc.component.myResourceStoreManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.myResourceStoreManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.resCode = param.params.resCode.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listUserStorehouses',
                    param,
                    function (json, res) {
                        var _myResourceStoreManageInfo = JSON.parse(json);
                        vc.component.myResourceStoreManageInfo.total = _myResourceStoreManageInfo.total;
                        vc.component.myResourceStoreManageInfo.records = _myResourceStoreManageInfo.records;
                        vc.component.myResourceStoreManageInfo.resourceStores = _myResourceStoreManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.myResourceStoreManageInfo.records,
                            dataCount: vc.component.myResourceStoreManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryResourceStoreMethod: function () {
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreMethod: function () {
                vc.component._resetResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.myResourceStoreManageInfo.moreCondition) {
                    vc.component.myResourceStoreManageInfo.moreCondition = false;
                } else {
                    vc.component.myResourceStoreManageInfo.moreCondition = true;
                }
            },

            // 跳转转增商品页面
            _jump2TransferGoodsPage: function () {
                vc.jumpToPage("/admin.html#/pages/common/transferGoodsStep");
            }
        }
    });
})(window.vc);
