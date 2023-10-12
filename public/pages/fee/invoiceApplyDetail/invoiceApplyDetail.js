/**
业主详情页面
 **/
(function(vc) {
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        data: {
            invoiceApplyDetailInfo: {
                memberId: '',
                carId: '',
                carNum: '',
                carTypeCd: '',
                carTypeCdName: '',
                carType: '',
                carTypeName: '',
                startTime: '',
                endTime: '',
                leaseType: '',
                leaseTypeName: '',
                areaNum: '',
                num: '',
                remark: '',
                stateName: '',
                carColor: '',
                carBrand: '',
                ownerId: '',
                roomName: '',
                carNumType: '',
                paId: '',
                _currentTab: 'invoiceApplyDetailFee',
                needBack: false,
            }
        },
        _initMethod: function() {
            $that.invoiceApplyDetailInfo.memberId = vc.getParam('memberId');
            if (!vc.notNull($that.invoiceApplyDetailInfo.memberId)) {
                return;
            }
            vc.component._loadinvoiceApplyDetailInfo();

        },
        _initEvent: function() {
            vc.on('invoiceApplyDetail', 'listCarData', function(_info) {
                //vc.component._loadinvoiceApplyDetailInfo();
                $that.changeTab($that.invoiceApplyDetailInfo._currentTab);
            });
        },
        methods: {
            _loadinvoiceApplyDetailInfo: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        memberId: $that.invoiceApplyDetailInfo.memberId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function(json) {
                        let _carInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_carInfo.data[0], $that.invoiceApplyDetailInfo);
                        $that.changeTab($that.invoiceApplyDetailInfo._currentTab);
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function(_tab) {
                $that.invoiceApplyDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    memberId: $that.invoiceApplyDetailInfo.memberId,
                    carId: $that.invoiceApplyDetailInfo.carId,
                    ownerId: $that.invoiceApplyDetailInfo.ownerId,
                    carNum: $that.invoiceApplyDetailInfo.carNum,
                    paId: $that.invoiceApplyDetailInfo.paId
                })
            },
            _openEditDetailOwnerCar: function() {
                vc.emit('editCar', 'openEditCar', $that.invoiceApplyDetailInfo);
            },
        }
    });
})(window.vc);