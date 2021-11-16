(function (vc) {
    vc.extends({
        data: {
            ownerRepairDetailInfo: {
                repairId: '',
                repairType: '',
                repairTypeName: '',
                repairName: '',
                tel: '',
                roomId: '',
                roomName: '',
                repairObjName: '',
                appointmentTime: '',
                context: '',
                stateName: '',
                userId: '',
                userName: '',
                repairUsers: [],
                photos: [],
                repairPhotos: [],
                beforePhotos: [],
                afterPhotos: [],
                visitType: '',
                visitContext: '',
                maintenanceType: '',
                repairMaterials: '',
                repairFee: '',
                resourceStoreInfo: [],
                appraiseScore: 0,
                doorSpeedScore: 0,
                repairmanServiceScore: 0,
                average: 0.0
            }
        },
        _initMethod: function () {
            let repairId = vc.getParam('repairId');
            if (!vc.notNull(repairId)) {
                vc.toast('非法操作');
                vc.jumpToPage('/admin.html#/pages/property/repairPoolManage');
                return;
            }
            $that.ownerRepairDetailInfo.repairId = repairId;
            $that._listRepairPools()
        },
        _initEvent: function () {
        },
        methods: {
            _getRoom: function () {
                var param = {
                    params: {
                        roomId: vc.component.ownerRepairDetailInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1
                    }
                };
                //查询房屋信息 业主信息
                vc.http.get('ownerRepairManage',
                    'getRoom',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var _roomInfos = JSON.parse(json);
                            if (!_roomInfos.hasOwnProperty("rooms")) {
                                vc.toast("非法操作，未找到房屋信息");
                                //vc.jumpToPage('/admin.html#/listOwner');
                                return;
                            }
                            var _roomInfo = _roomInfos.rooms[0];
                            vc.component.ownerRepairDetailInfo.roomName = _roomInfo.floorNum + "号楼 " + _roomInfo.unitNum + "单元 " + _roomInfo.roomNum + "室";
                        } else {
                            vc.toast("非法操作，未找到房屋信息");
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("非法操作，未找到房屋信息");
                    }
                );
            },
            _listRepairPools: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairId: $that.ownerRepairDetailInfo.repairId
                    }
                };
                //发送get请求
                vc.http.get('ownerRepairManage',
                    'list',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        let _repairs = _repairPoolManageInfo.data;
                        if (_repairs.length < 1) {
                            vc.toast("数据异常");
                            vc.jumpToPage('/admin.html#/pages/property/repairPoolManage');
                            return;
                        }
                        vc.copyObject(_repairs[0], $that.ownerRepairDetailInfo);
                        //查询房屋信息
                        //vc.component._getRoom();
                        // 查询物品信息
                        if ($that.ownerRepairDetailInfo.maintenanceType == '1001' || $that.ownerRepairDetailInfo.maintenanceType == '1003') {
                            $that._loadResourceStoreList();
                        }
                        //查询处理轨迹
                        $that._loadRepairUser();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadResourceStoreList: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairId: $that.ownerRepairDetailInfo.repairId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json, res) {
                        var _repairResourceStoreInfo = JSON.parse(json);
                        let _resource = _repairResourceStoreInfo.data;
                        $that.ownerRepairDetailInfo.resourceStoreInfo = _resource;
                        vc.component.ownerRepairDetailInfo.resourceStoreInfo.forEach((item) => {
                            if (item.resId == '666666') {
                                item.rstName = item.specName = '自定义';
                            }
                        })
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadRepairUser: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairId: $that.ownerRepairDetailInfo.repairId
                    }
                };
                //发送get请求
                vc.http.apiGet('ownerRepair.listRepairStaffs',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        let _repairs = _repairPoolManageInfo.data;
                        $that.ownerRepairDetailInfo.repairUsers = _repairs;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack()
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            /**
             * 新增打印功能，跳转打印页面
             */
            _printRepairDetail: function () {
                window.open("/print.html#/pages/property/printRepairDetail?repairId=" + $that.ownerRepairDetailInfo.repairId + "&repairType=" + $that.ownerRepairDetailInfo.repairType)
            },
        }
    });
})(window.vc);
