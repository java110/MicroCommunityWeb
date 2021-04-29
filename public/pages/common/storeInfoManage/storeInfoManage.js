(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listStoreManageInfo: {
                listStores: [],
                storeAttrDtoList:[],
                total: 0,
                records: 1,
                conditions: {
                    name: '',
                    storeTypeCd: '',
                    tel: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listListStores(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('storeInfoManage', 'getStoreInfo', function (_param) {
                vc.component._listListStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listListStores: function (_page, _rows) {
                vc.component.listStoreManageInfo.conditions.page = _page;
                vc.component.listStoreManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.listStoreManageInfo.conditions
                };

                //发送get请求
                vc.http.get('listStoreManage',
                    'getStoreInfo',
                    param,
                    function (json, res) {
                        var _listStoreManageInfo = JSON.parse(json);
                        vc.component.listStoreManageInfo.listStores = _listStoreManageInfo.stores;
                        vc.component.listStoreManageInfo.storeAttrDtoList = vc.component.listStoreManageInfo.listStores[0].storeAttrDtoList;
                        vc.emit('pagination', 'init', {
                            total: vc.component.listStoreManageInfo.records,
                            dataCount: vc.component.listStoreManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryListStoreMethod: function () {
                vc.component._listListStores(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openEditStoreInfoModel(_storeInfo){
                vc.emit('editStoreInfo', 'openEditStoreModal', {_storeInfo});
            },
            _openEditStoreAttrModel(_storeAttr){
                vc.emit('editStoreAttr', 'openEditStoreAttrModal', {_storeAttr});
            }


        }
    });
})(window.vc);
