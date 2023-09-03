/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            itemReleaseManageInfo: {
                itemReleases: [],
                total: 0,
                records: 1,
                moreCondition: false,
                irId: '',
                itemReleaseTypes: [],
                conditions: {
                    typeId: '',
                    applyCompany: '',
                    applyPerson: '',
                    idCard: '',
                    applyTel: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listItemReleases(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listItemReleaseTypes();
        },
        _initEvent: function () {
            vc.on('itemReleaseManage', 'listItemRelease', function (_param) {
                vc.component._listItemReleases(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listItemReleases(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listItemReleases: function (_page, _rows) {
                vc.component.itemReleaseManageInfo.conditions.page = _page;
                vc.component.itemReleaseManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.itemReleaseManageInfo.conditions
                };
                param.params.applyCompany = param.params.applyCompany.trim();
                param.params.applyPerson = param.params.applyPerson.trim();
                param.params.idCard = param.params.idCard.trim();
                param.params.applyTel = param.params.applyTel.trim();
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemRelease',
                    param,
                    function (json, res) {
                        var _itemReleaseManageInfo = JSON.parse(json);
                        vc.component.itemReleaseManageInfo.total = _itemReleaseManageInfo.total;
                        vc.component.itemReleaseManageInfo.records = _itemReleaseManageInfo.records;
                        vc.component.itemReleaseManageInfo.itemReleases = _itemReleaseManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.itemReleaseManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddItemReleaseModal: function () {
                vc.jumpToPage('/#/pages/property/addItemReleaseView');
            },
            _openEditItemReleaseModel: function (_itemRelease) {
                vc.jumpToPage('/#/pages/property/editItemReleaseView?irId=' + _itemRelease.irId);
            },
            _openDeleteItemReleaseModel: function (_itemRelease) {
                vc.emit('deleteItemRelease', 'openDeleteItemReleaseModal', _itemRelease);
            },
            _queryItemReleaseMethod: function () {
                vc.component._listItemReleases(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetItemReleaseMethod: function () {
                vc.component.itemReleaseManageInfo.conditions.typeId = "";
                vc.component.itemReleaseManageInfo.conditions.applyCompany = "";
                vc.component.itemReleaseManageInfo.conditions.applyPerson = "";
                vc.component.itemReleaseManageInfo.conditions.idCard = "";
                vc.component.itemReleaseManageInfo.conditions.applyTel = "";
                vc.component.itemReleaseManageInfo.conditions.state = "";
                vc.component._listItemReleases(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.itemReleaseManageInfo.moreCondition) {
                    vc.component.itemReleaseManageInfo.moreCondition = false;
                } else {
                    vc.component.itemReleaseManageInfo.moreCondition = true;
                }
            },
            _listItemReleaseTypes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseType',
                    param,
                    function (json, res) {
                        let _itemReleaseTypeManageInfo = JSON.parse(json);
                        vc.component.itemReleaseManageInfo.itemReleaseTypes = _itemReleaseTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            viewResName: function (_item) {
                vc.emit('viewItemReleaseRes', 'openChooseItemReleaseRes', _item);
            },
            _openDetail: function (_item) {
                vc.jumpToPage("/#/pages/property/itemReleaseDetail?irId=" + _item.irId + "&flowId=" + _item.flowId);
            },
        }
    });
})(window.vc);
