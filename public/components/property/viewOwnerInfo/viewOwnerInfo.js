/**
 权限组
 **/
(function (vc) {
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            callBackFunction: vc.propTypes.string,
            showCallBackButton: vc.propTypes.string = 'false'
        },
        data: {
            viewOwnerInfo: {
                flowComponent: 'viewOwnerInfo',
                viewOwnerFlag: '',
                ownerId: "",
                name: "",
                age: "",
                sex: "",
                userName: "",
                remark: "",
                idCard: "",
                link: "",
                ownerPhoto: "/img/noPhoto.jpg",
                showCallBackButton: $props.showCallBackButton,
                attrs: [],
                url:''
            }
        },
        _initMethod: function () {
            vc.component._loadOwnerInfo();
        },
        _initEvent: function () {
            vc.on('viewOwnerInfo', 'onIndex', function (_index) {
                /*if(_index == 2){
                   vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewOwnerInfo);
                }*/
            });
            vc.on('viewOwnerInfo', 'chooseOwner', function (_owner) {
                vc.copyObject(_owner, vc.component.viewOwnerInfo);
            });
            vc.on('viewOwnerInfo', 'callBackOwnerInfo', function (_info) {
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewOwnerInfo);
            });
        },
        methods: {
            _loadOwnerInfo: function () {
                //加载 业主信息
                var _ownerId = vc.getParam('ownerId')
                if (!vc.notNull(_ownerId)) {
                    return;
                }
                vc.component.viewOwnerInfo.viewOwnerFlag = 'Owner';
                let param = {
                    params: {
                        ownerId: _ownerId,
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
                        vc.copyObject(listOwnerData.owners[0], vc.component.viewOwnerInfo);
                        $that.viewOwnerInfo.attrs = listOwnerData.owners[0].ownerAttrDtos
                        //加载图片
                        vc.component._loadOwnerPhoto();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _callBackListOwner: function (_ownerId) {
                // vc.jumpToPage("/#/pages/property/listOwner?ownerId="+_ownerId);
                vc.goBack();
            },
            _loadOwnerPhoto: function () {
                // vc.component.viewOwnerInfo.ownerPhoto = _fileUrl + "?objId=" +
                //     vc.component.viewOwnerInfo.ownerId + "&communityId=" + vc.getCurrentCommunity().communityId + "&fileTypeCd=10000&time=" + new Date();
                $that.viewOwnerInfo.ownerPhoto  =  $that.viewOwnerInfo.url;
            },
            errorLoadImg: function () {
                vc.component.viewOwnerInfo.ownerPhoto = "/img/noPhoto.jpg";
            },
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            }
        }
    });
})(window.vc);