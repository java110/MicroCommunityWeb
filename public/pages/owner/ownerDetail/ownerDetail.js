/**
 业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            ownerDetailInfo: {
                viewOwnerFlag: '',
                ownerId: "",
                memberId: '',
                name: "",
                age: "",
                sex: "",
                userName: "",
                remark: "",
                idCard: "",
                link: "",
                ownerPhoto: "/img/noPhoto.jpg",
                ownerAttrDtos: [],
                url: '',
                _currentTab: 'ownerDetailRoom',
                needBack: false
            }
        },
        _initMethod: function () {
            $that.ownerDetailInfo.ownerId = vc.getParam('ownerId');
            $that.ownerDetailInfo.needBack = vc.getParam('needBack');
            if (!vc.notNull($that.ownerDetailInfo.ownerId)) {
                return;
            }
            let _currentTab = vc.getParam('currentTab');
            if (_currentTab) {
                $that.ownerDetailInfo._currentTab = _currentTab;
            }
            vc.component._loadOwnerInfo();
            $that.changeTab($that.ownerDetailInfo._currentTab);
        },
        _initEvent: function () {
            vc.on('ownerDetail', 'listOwnerData', function (_info) {
                vc.component._loadOwnerInfo();
                $that.changeTab($that.ownerDetailInfo._currentTab);
            });
        },
        methods: {
            _loadOwnerInfo: function () {
                let param = {
                    params: {
                        ownerId: $that.ownerDetailInfo.ownerId,
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerTypeCd: '1001'
                    }
                }
                //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function (json, res) {
                        var listOwnerData = JSON.parse(json);
                        vc.copyObject(listOwnerData.owners[0], vc.component.ownerDetailInfo);
                        $that.ownerDetailInfo.ownerAttrDtos = listOwnerData.owners[0].ownerAttrDtos
                        //加载图片
                        vc.component._loadOwnerPhoto();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.ownerDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    ownerId: $that.ownerDetailInfo.ownerId,
                    ownerName: $that.ownerDetailInfo.name,
                    link: $that.ownerDetailInfo.link,
                })
            },
            _loadOwnerPhoto: function () {
                $that.ownerDetailInfo.ownerPhoto = $that.ownerDetailInfo.url;
            },
            errorLoadImg: function () {
                vc.component.ownerDetailInfo.ownerPhoto = "/img/noPhoto.jpg";
            },
            _openEditOwnerDetailModel: function () {
                vc.emit('editOwner', 'openEditOwnerModal', $that.ownerDetailInfo);
            },
        }
    });
})(window.vc);