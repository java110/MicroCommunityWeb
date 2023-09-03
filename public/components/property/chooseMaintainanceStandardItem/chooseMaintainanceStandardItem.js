(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitListener: vc.propTypes.string,
            emitFunction: vc.propTypes.string
        },
        data: {
            chooseMaintainanceStandardItemInfo: {
                items: [],
                itemTitle: '',
                standardId: '',
                routeName: '',
                selectItems: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            checkData: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.chooseMaintainanceStandardItemInfo.selectItems.length == $that.chooseMaintainanceStandardItemInfo.items.length) {
                        document.querySelector('#quan').checked = true;
                    } else {
                        document.querySelector('#quan').checked = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseMaintainanceStandardItem', 'openchooseMaintainanceStandardItemModal', function (_param) {
                $that._refreshChooseMaintainanceStandardItemInfo();
                $('#chooseMaintainanceStandardItemModel').modal('show');
                vc.copyObject(_param, $that.chooseMaintainanceStandardItemInfo);
                $that._loadAllItemsInfo(1, 10, '');
            });
            vc.on('chooseMaintainanceStandardItem', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllItemsInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllItemsInfo: function (_page, _row, _name) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        itemTitle: _name,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainance.listMaintainanceItem',
                    param,
                    function (json) {
                        var _pointInfo = JSON.parse(json);
                        $that.chooseMaintainanceStandardItemInfo.items = _pointInfo.data;
                        vc.emit('chooseMaintainanceStandardItem', 'paginationPlus', 'init', {
                            total: _pointInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseMaintainanceStandardItem: function (_org) {
                let _selectItems = $that.chooseMaintainanceStandardItemInfo.selectItems;
                if (_selectItems.length < 1) {
                    vc.toast("请选择检查项");
                    return;
                }
                let _objData = {
                    communityId: vc.getCurrentCommunity().communityId,
                    standardId: $that.chooseMaintainanceStandardItemInfo.standardId,
                    items: _selectItems
                }
                vc.http.apiPost('/maintainance.saveMaintainanceStandardItem',
                    JSON.stringify(_objData),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#chooseMaintainanceStandardItemModel').modal('hide');
                            vc.emit('maintainanceStandardItem', 'loadItem', {
                                standardId: $that.chooseMaintainanceStandardItemInfo.standardId
                            });
                            return;
                        }
                        vc.toast(_json.msg);
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
                $('#chooseMaintainanceStandardItemModel').modal('hide');
            },
            //查询
            queryItems: function () {
                $that._loadAllItemsInfo(1, 10, $that.chooseMaintainanceStandardItemInfo.inspectionName);
            },
            //重置
            resetItems: function () {
                $that.chooseMaintainanceStandardItemInfo.inspectionName = "";
                $that._loadAllItemsInfo(1, 10, $that.chooseMaintainanceStandardItemInfo.inspectionName);
            },
            _refreshChooseMaintainanceStandardItemInfo: function () {
                $that.chooseMaintainanceStandardItemInfo = {
                    items: [],
                    itemTitle: '',
                    standardId: '',
                    routeName: '',
                    selectItems: []
                };
            },
            checkAll: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.chooseMaintainanceStandardItemInfo.selectItems.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.chooseMaintainanceStandardItemInfo.selectItems = [];
                }
            }
        }
    });
})(window.vc);
