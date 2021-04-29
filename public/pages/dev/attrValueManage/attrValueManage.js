/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attrValueManageInfo: {
                attrValues: [],
                total: 0,
                records: 1,
                moreCondition: false,
                valueId: '',
                specName:'',
                conditions: {
                    value: '',
                    valueShow: '',
                    valueName: '',
                    specCd:''
                }
            }
        },
        _initMethod: function () {
            let _specCd = vc.getParam('specCd');
            $that.attrValueManageInfo.conditions.specCd = _specCd;
            $that.attrValueManageInfo.specName = vc.getParam('specName');
            vc.component._listAttrValues(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('attrValueManage', 'listAttrValue', function (_param) {
                vc.component._listAttrValues(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAttrValues(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAttrValues: function (_page, _rows) {
                vc.component.attrValueManageInfo.conditions.page = _page;
                vc.component.attrValueManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.attrValueManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/attrValue/queryAttrValue',
                    param,
                    function (json, res) {
                        var _attrValueManageInfo = JSON.parse(json);
                        vc.component.attrValueManageInfo.total = _attrValueManageInfo.total;
                        vc.component.attrValueManageInfo.records = _attrValueManageInfo.records;
                        vc.component.attrValueManageInfo.attrValues = _attrValueManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.attrValueManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAttrValueModal: function () {
                vc.emit('addAttrValue', 'openAddAttrValueModal', {
                    specCd: $that.attrValueManageInfo.conditions.specCd
                });
            },
            _openEditAttrValueModel: function (_attrValue) {
                vc.emit('editAttrValue', 'openEditAttrValueModal', _attrValue);
            },
            _openDeleteAttrValueModel: function (_attrValue) {
                vc.emit('deleteAttrValue', 'openDeleteAttrValueModal', _attrValue);
            },
            _queryAttrValueMethod: function () {
                vc.component._listAttrValues(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.attrValueManageInfo.moreCondition) {
                    vc.component.attrValueManageInfo.moreCondition = false;
                } else {
                    vc.component.attrValueManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
