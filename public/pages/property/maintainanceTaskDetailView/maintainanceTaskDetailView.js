(function (vc) {
    vc.extends({
        data: {
            maintainanceTaskDetailViewInfo: {
                taskDetailId: '',
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
            let taskDetailId = vc.getParam('taskDetailId');
            $that.maintainanceTaskDetailViewInfo.taskDetailId = taskDetailId;
            $that._listRepairPools()
        },
        _initEvent: function () {
        },
        methods: {
            _getRoom: function () {
                var param = {
                    params: {
                        roomId: vc.component.maintainanceTaskDetailViewInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1
                    }
                };
                //查询房屋信息 业主信息
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var _roomInfos = JSON.parse(json);
                            if (!_roomInfos.hasOwnProperty("rooms")) {
                                vc.toast("非法操作，未找到房屋信息");
                                //vc.jumpToPage('/#/listOwner');
                                return;
                            }
                            var _roomInfo = _roomInfos.rooms[0];
                            vc.component.maintainanceTaskDetailViewInfo.roomName = _roomInfo.floorNum + "号楼 " + _roomInfo.unitNum + "单元 " + _roomInfo.roomNum + "室";
                        } else {
                            vc.toast("非法操作，未找到房屋信息");
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("非法操作，未找到房屋信息");
                    }
                );
            },
            _listRepairPools: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        taskDetailId: $that.maintainanceTaskDetailViewInfo.taskDetailId
                    }
                };
                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        let _repairs = _repairPoolManageInfo.data;
                        
                        vc.copyObject(_repairs[0], $that.maintainanceTaskDetailViewInfo);
                        //查询房屋信息
                        //vc.component._getRoom();
                        // 查询物品信息
                        if ($that.maintainanceTaskDetailViewInfo.maintenanceType == '1001' || $that.maintainanceTaskDetailViewInfo.maintenanceType == '1003') {
                            $that._loadResourceStoreList();
                        }
                        //查询处理轨迹
                        $that._loadRepairUser();
                    },
                    function (errInfo, error) {
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
                        taskDetailId: $that.maintainanceTaskDetailViewInfo.taskDetailId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json, res) {
                        var _repairResourceStoreInfo = JSON.parse(json);
                        let _resource = _repairResourceStoreInfo.data;
                        $that.maintainanceTaskDetailViewInfo.resourceStoreInfo = _resource;
                        vc.component.maintainanceTaskDetailViewInfo.resourceStoreInfo.forEach((item) => {
                            if (item.resId == '666666') {
                                item.rstName = item.specName = '自定义';
                            }
                        })
                    },
                    function (errInfo, error) {
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
                        taskDetailId: $that.maintainanceTaskDetailViewInfo.taskDetailId
                    }
                };
                //发送get请求
                vc.http.apiGet('ownerRepair.listRepairStaffs',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        let _repairs = _repairPoolManageInfo.data;
                        $that.maintainanceTaskDetailViewInfo.repairUsers = _repairs;
                    },
                    function (errInfo, error) {
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
                window.open("/print.html#/pages/property/printRepairDetail?taskDetailId=" + $that.maintainanceTaskDetailViewInfo.taskDetailId + "&repairType=" + $that.maintainanceTaskDetailViewInfo.repairType)
            },
        }
    });
})(window.vc);