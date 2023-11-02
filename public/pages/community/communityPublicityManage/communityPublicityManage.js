/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communityPublicityManageInfo: {
                communityPublicitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                pubId: '',
                pubTypes: [],
                conditions: {
                    pubId: '',
                    title: '',
                    pubType: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            // $that._listCommunityPublicitys(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('community_publicity', 'pub_type', function (_data) {
                $that.communityPublicityManageInfo.pubTypes = _data;
                $that.swatchPubType(_data[0]);
            })
        },
        _initEvent: function () {
            vc.on('communityPublicityManage', 'listCommunityPublicity', function (_param) {
                $that._listCommunityPublicitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listCommunityPublicitys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunityPublicitys: function (_page, _rows) {
                $that.communityPublicityManageInfo.conditions.page = _page;
                $that.communityPublicityManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.communityPublicityManageInfo.conditions
                };
                param.params.title = param.params.title.trim();
                //发送get请求
                vc.http.apiGet('/publicity.listCommunityPublicity',
                    param,
                    function (json, res) {
                        let _communityPublicityManageInfo = JSON.parse(json);
                        $that.communityPublicityManageInfo.total = _communityPublicityManageInfo.total;
                        $that.communityPublicityManageInfo.records = _communityPublicityManageInfo.records;
                        $that.communityPublicityManageInfo.communityPublicitys = _communityPublicityManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.communityPublicityManageInfo.records,
                            dataCount: $that.communityPublicityManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCommunityPublicityModal: function () {
                vc.jumpToPage('/#/pages/community/addCommunityPublicity');
            },
            _openEditCommunityPublicityModel: function (_communityPublicity) {
                vc.jumpToPage('/#/pages/community/editCommunityPublicity?pubId=' + _communityPublicity.pubId);
            },
            _openDeleteCommunityPublicityModel: function (_communityPublicity) {
                vc.emit('deleteCommunityPublicity', 'openDeleteCommunityPublicityModal', _communityPublicity);
            },
            //查询
            _queryCommunityPublicityMethod: function () {
                $that._listCommunityPublicitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCommunityPublicityMethod: function () {
                vc.component.communityPublicityManageInfo.conditions.title = "";
                $that._listCommunityPublicitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.communityPublicityManageInfo.moreCondition) {
                    $that.communityPublicityManageInfo.moreCondition = false;
                } else {
                    $that.communityPublicityManageInfo.moreCondition = true;
                }
            },
            swatchPubType: function (_item) {
                $that.communityPublicityManageInfo.conditions.pubType = _item.statusCd;
                $that._listCommunityPublicitys(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);