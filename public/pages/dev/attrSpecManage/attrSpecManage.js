/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attrSpecManageInfo: {
                attrSpecs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                specCd: '',
                conditions: {
                    specName: '',
                    tableName: '',
                    specCd: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listAttrSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('attrSpecManage', 'listAttrSpec', function (_param) {
                vc.component._listAttrSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAttrSpecs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAttrSpecs: function (_page, _rows) {

                vc.component.attrSpecManageInfo.conditions.page = _page;
                vc.component.attrSpecManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.attrSpecManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/attrSpec/queryAttrSpec',
                    param,
                    function (json, res) {
                        var _attrSpecManageInfo = JSON.parse(json);
                        vc.component.attrSpecManageInfo.total = _attrSpecManageInfo.total;
                        vc.component.attrSpecManageInfo.records = _attrSpecManageInfo.records;
                        vc.component.attrSpecManageInfo.attrSpecs = _attrSpecManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.attrSpecManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAttrSpecModal: function () {
                vc.emit('addAttrSpec', 'openAddAttrSpecModal', {});
            },
            _openEditAttrSpecModel: function (_attrSpec) {
                vc.emit('editAttrSpec', 'openEditAttrSpecModal', _attrSpec);
            },
            _openDeleteAttrSpecModel: function (_attrSpec) {
                vc.emit('deleteAttrSpec', 'openDeleteAttrSpecModal', _attrSpec);
            },
            _queryAttrSpecMethod: function () {
                vc.component._listAttrSpecs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.attrSpecManageInfo.moreCondition) {
                    vc.component.attrSpecManageInfo.moreCondition = false;
                } else {
                    vc.component.attrSpecManageInfo.moreCondition = true;
                }
            },
            _getSpecValueTypeName: function (_specValueType) {
                if (_specValueType == '1001') {
                    return "字符串";

                } else if (_specValueType == '2002') {
                    return "整数";
                } else if (_specValueType == '3003') {
                    return "金额";
                } else if (_specValueType == '4004') {
                    return "日期";
                } else if (_specValueType == '5005') {
                    return "时间";
                }

                return "未知"
            }, 
            _getSpecTypeName: function (_specValue) {
                if (_specValue == '2233') {
                    return "input";           
                } else if (_specValue == '3344') {
                    return "select";
                } else if (_specValue == '4455') {
                    return "日期";
                }

                return "未知"
            },
            _openAttrSpecValue:function(_attrSpec){
                vc.jumpToPage('/admin.html#/pages/dev/attrValueManage?specCd='+_attrSpec.specCd+'&specName='+_attrSpec.specName);
            }


        }
    });
})(window.vc);
