/**
业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            resourceDetailInfo: {
                resId:'',
                shName: '',
                parentRstName: '',
                rstName: '',
                resName: '',
                resCode: '',
                rssName: '',
                isFixedName:'',
                price: '',
                outHighPrice: '',
                outLowPrice: '',
                stock: '',
                unitCodeName: '',
                miniUnitStock: '',
                miniUnitCodeName: '',
                miniStock: '',
                averagePrice:'',
                _currentTab: 'resourceDetailPurchase',
                needBack: false,
            }
        },
        _initMethod: function () {
            $that.resourceDetailInfo.resId = vc.getParam('resId');
            if (!vc.notNull($that.resourceDetailInfo.resId)) {
                return;
            }
            $that._loadResourceDetailInfo();

        },
        _initEvent: function () {
            vc.on('resourceDetail', 'listCarData', function (_info) {
                //$that._loadResourceDetailInfo();
                $that.changeTab($that.resourceDetailInfo._currentTab);
            });
        },
        methods: {
            _loadResourceDetailInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        resId: $that.resourceDetailInfo.resId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStores',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_json.resourceStores[0], $that.resourceDetailInfo);
                        $that.changeTab($that.resourceDetailInfo._currentTab);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.resourceDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    resId: $that.resourceDetailInfo.resId
                });
            },
        }
    });
})(window.vc);