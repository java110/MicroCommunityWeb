/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            listPropertyRightRegistrationDetailInfo: {
                propertyRightRegistrationDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    prrId: '',
                    securities: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    isTrue: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.listPropertyRightRegistrationDetailInfo.conditions.prrId = vc.getParam('prrId');
            vc.component.listPropertyRightRegistrationDetailInfo.conditions.floorNum = vc.getParam('floorNum');
            vc.component.listPropertyRightRegistrationDetailInfo.conditions.unitNum = vc.getParam('unitNum');
            vc.component.listPropertyRightRegistrationDetailInfo.conditions.roomNum = vc.getParam('roomNum');
            vc.component.listPropertyRightRegistrationDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listPropertyRightRegistrationDetail', 'listPropertyRightRegistrationDetails', function (_param) {
                vc.component.listPropertyRightRegistrationDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component.listPropertyRightRegistrationDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            listPropertyRightRegistrationDetails: function (_page, _rows) {
                vc.component.listPropertyRightRegistrationDetailInfo.conditions.page = _page;
                vc.component.listPropertyRightRegistrationDetailInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.listPropertyRightRegistrationDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('propertyRightRegistrationDetail.listPropertyRightRegistrationDetail',
                    param,
                    function (json, res) {
                        var _propertyRightRegistrationDetailsInfo = JSON.parse(json);
                        vc.component.listPropertyRightRegistrationDetailInfo.total = _propertyRightRegistrationDetailsInfo.total;
                        vc.component.listPropertyRightRegistrationDetailInfo.records = _propertyRightRegistrationDetailsInfo.records;
                        vc.component.listPropertyRightRegistrationDetailInfo.propertyRightRegistrationDetails = _propertyRightRegistrationDetailsInfo.data;
                        vc.component.listPropertyRightRegistrationDetailInfo.propertyRightRegistrationDetails.forEach((item) => {
                            if(item.securities == '001' && item.idCardUrl){
                                item.idCardUrl = item.idCardUrl.split(',');
                                item.idCardUrlShow = [];
                                item.idCardUrl.forEach((url) => {
                                    item.idCardUrlShow.push(photoUrl + "?fileId=" + url + "&communityId=-1&time=" + new Date());
                                })
                            }
                            if(item.securities == '002' && item.housePurchaseUrl){
                                item.housePurchaseUrl = item.housePurchaseUrl.split(',');
                                item.housePurchaseUrlShow = [];
                                item.housePurchaseUrl.forEach((url) => {
                                    item.housePurchaseUrlShow.push(photoUrl + "?fileId=" + url + "&communityId=-1&time=" + new Date());
                                })
                            }
                            if(item.securities == '003' && item.repairUrl){
                                item.repairUrl = item.repairUrl.split(',');
                                item.repairUrlShow = [];
                                item.repairUrl.forEach((url) => {
                                    item.repairUrlShow.push(photoUrl + "?fileId=" + url + "&communityId=-1&time=" + new Date());
                                })
                            }
                            if(item.securities == '004' && item.deedTaxUrl){
                                item.deedTaxUrl = item.deedTaxUrl.split(',');
                                item.deedTaxUrlShow = [];
                                item.deedTaxUrl.forEach((url) => {
                                    item.deedTaxUrlShow.push(photoUrl + "?fileId=" + url + "&communityId=-1&time=" + new Date());
                                })
                            }
                        })
                        $that.$forceUpdate();
                        vc.emit('pagination', 'init', {
                            total: vc.component.listPropertyRightRegistrationDetailInfo.records,
                            dataCount: vc.component.listPropertyRightRegistrationDetailInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //修改
            _openEditPropertyRightRegistrationDetailModel: function (_propertyRightRegistrationDetail) {
                vc.emit('editPropertyRightRegistrationDetail', 'openEditPropertyRightRegistrationDetailModal', _propertyRightRegistrationDetail);
            },
            showImg: function (e) {
                vc.emit('viewImage', 'showImage', {url: e});
            },
            _moreCondition: function () {
                if (vc.component.listPropertyRightRegistrationDetailInfo.moreCondition) {
                    vc.component.listPropertyRightRegistrationDetailInfo.moreCondition = false;
                } else {
                    vc.component.listPropertyRightRegistrationDetailInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
