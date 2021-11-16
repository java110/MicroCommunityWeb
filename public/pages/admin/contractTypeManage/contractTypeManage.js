/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractTypeManageInfo: {
                contractTypes: [],
                contractTypeAttrs: [],
                contractTypeSpec: '',
                templatecontent: '',
                total: 0,
                records: 1,
                moreCondition: false,
                contractTypeId: '',
                componentShow: 'contractTypeList',
                conditions: {
                    typeName: '',
                    audit: '',
                    contractTypeId: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listContractTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('contractTypeManage', 'componentShow', function (_param) {
                vc.component.contractTypeManageInfo.componentShow = 'contractTypeList';
            });

            vc.on('contractTypeManage', 'listContractType', function (_param) {
                vc.component._listContractTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContractTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContractTypes: function (_page, _rows) {
                vc.component.contractTypeManageInfo.conditions.page = _page;
                vc.component.contractTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractTypeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        vc.component.contractTypeManageInfo.total = _contractTypeManageInfo.total;
                        vc.component.contractTypeManageInfo.records = _contractTypeManageInfo.records;
                        vc.component.contractTypeManageInfo.contractTypes = _contractTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractTypeManageInfo.records,
                            dataCount: vc.component.contractTypeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractTypeModal: function () {
                vc.emit('addContractType', 'openAddContractTypeModal', {});
            },
            _openEditContractTypeModel: function (_contractType) {
                vc.emit('editContractType', 'openEditContractTypeModal', _contractType);
            },
            _openDeleteContractTypeModel: function (_contractType) {
                vc.emit('deleteContractType', 'openDeleteContractTypeModal', _contractType);
            },
            _queryContractTypeMethod: function () {
                vc.component._listContractTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openContractTypeSpecModel: function (_contractType) {
                vc.jumpToPage('/admin.html#/pages/admin/contractTypeSpecManage?contractTypeId=' + _contractType.contractTypeId);
            },
            _loadContractAttrs: function (_contractTypeId) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        contractTypeId: _contractTypeId
                    }
                };
                //发送模板get请求
                vc.http.apiGet('/contract/printContractTemplate',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        let _data = _info.data;
                        $that.contractTypeManageInfo.contractTypeAttrs = [];
                        // 合同信息
                        $that.contractdata = _data.contract[0];

                        //合同属性
                        $that.contractTypeManageInfo.contractTypeSpec = _data.contractTypeSpec;
                        $that.contractTypeManageInfo.contractTypeSpec.forEach(function (e) {
                            let rname = e.specName;
                            let reg = '#' + rname + '#';
                            $that.contractTypeManageInfo.contractTypeAttrs.push(reg);
                        });
                        //基本属性
                        $that.baseRepalce = _data.baseRepalce;
                        if ($that.baseRepalce) {
                            $that.baseRepalce.forEach(function (e) {
                                let rname = e.name;
                                let rkey = e.key;
                                var contractarr = Object.keys($that.contractdata);
                                for (var a in contractarr) {
                                    if (rkey == contractarr[a]) {
                                        let reg = '#' + rname + '#';
                                        $that.contractTypeManageInfo.contractTypeAttrs.push(reg);
                                    }
                                }
                            });
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openContractTemplate: function (_contractType) {
                $that.contractTypeManageInfo.componentShow = '';
                vc.component._loadContractAttrs(_contractType.contractTypeId);
                vc.emit('addTemplateView', 'openTemplate', _contractType);
            },
            _moreCondition: function () {
                if (vc.component.contractTypeManageInfo.moreCondition) {
                    vc.component.contractTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.contractTypeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
