/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    var TEMP_SEARCH = 'roomCreateFeeSearch';
    vc.extends({
        data: {
            roomUnits: [],
            roomCreateFeeInfo: {
                rooms: [],
                total: 0,
                records: 1,
                floorId: '',
                unitId: '',
                state: '',
                roomNum: '',
                moreCondition: false,
                conditions: {
                    floorId: '',
                    ownerName: '',
                    ownerNameLike: '',
                    floorName: '',
                    unitId: '',
                    roomNum: '',
                    roomId: '',
                    state: '',
                    section: '',
                    allNum: '',
                    idCard: '',
                    roomType: ''
                }
            },
            currentPage: 1,
        },
        _initMethod: function() {
            //检查是否有缓存数据
            let _tempData = vc.getData(TEMP_SEARCH);
            if (_tempData == null) {
                vc.component.roomCreateFeeInfo.conditions.floorId = vc.getParam("floorId");
                vc.component.roomCreateFeeInfo.conditions.floorName = vc.getParam("floorName");
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            } else {
                console.log('here is tempData : ', _tempData);
                vc.component.roomCreateFeeInfo.conditions = _tempData.conditions;
                $that.updateCurrentPage(_tempData.currentPage);
                vc.component.listRoom(_tempData.currentPage, DEFAULT_ROW);
            }
        },
        _initEvent: function() {
            vc.on('room', 'chooseFloor', function(_param) {
                vc.component.roomCreateFeeInfo.conditions.floorId = _param.floorId;
                vc.component.roomCreateFeeInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that.updateCurrentPage(_currentPage);
                vc.component.listRoom(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listRoom: function(_page, _row) {
                if (vc.component.roomCreateFeeInfo.conditions.floorName == '' || vc.component.roomCreateFeeInfo.conditions.floorName == null) {
                    vc.component.roomCreateFeeInfo.conditions.floorId = ''
                }
                vc.component.roomCreateFeeInfo.conditions.page = _page;
                vc.component.roomCreateFeeInfo.conditions.row = _row;
                vc.component.roomCreateFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let _allNum = $that.roomCreateFeeInfo.conditions.allNum;
                let _conditions = JSON.parse(JSON.stringify(vc.component.roomCreateFeeInfo.conditions));
                let param = {
                    params: _conditions
                };
                if (_allNum.split('-').length == 3) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                }
                if (_allNum.split('-').length == 2) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = '0';
                    param.params.roomNum = _allNums[1].trim();
                }
                //业主名称选框去空
                param.params.ownerName = param.params.ownerName.trim();
                //身份证号选框去空
                param.params.idCard = param.params.idCard.trim();
                //房屋编号去空
                param.params.roomNum = param.params.roomNum.trim();
                //发送get请求
                vc.http.get('roomCreateFee',
                    'listRoom',
                    param,
                    function(json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.component.roomCreateFeeInfo.total = listRoomData.total;
                        vc.component.roomCreateFeeInfo.records = listRoomData.records;
                        vc.component.roomCreateFeeInfo.rooms = listRoomData.rooms;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomCreateFeeInfo.records,
                            dataCount: vc.component.roomCreateFeeInfo.total,
                            currentPage: _page
                        });
                        // 换存搜索条件
                        $that.saveTempSearchData();
                    },
                    function(errInfo, error) {
                        vc.toast(errInfo);
                        console.log('请求失败处理');
                    }
                );
            },
            _openRoomCreateFeeAddModal: function(_room, _isMore) {
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: _isMore,
                    room: _room
                });
            },
            _openViewRoomCreateFee: function(_room) {
                vc.jumpToPage("/#/pages/property/listRoomFee?roomId=" + _room.roomId + '&ownerId=' + _room.ownerId);
            },
            /**
             根据楼ID加载房屋
             **/
            loadUnits: function(_floorId) {
                vc.component.addRoomUnits = [];
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'roomCreateFee',
                    'loadUnits',
                    param,
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var tmpUnits = JSON.parse(json);
                            vc.component.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询
            _queryRoomMethod: function() {
                // 搜索时重置缓存分页
                $that.updateCurrentPage(DEFAULT_PAGE);
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            _resetRoomMethod: function() {
                vc.resetObject(vc.component.roomCreateFeeInfo.conditions);
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _loadDataByParam: function() {
                vc.component.roomCreateFeeInfo.conditions.floorId = vc.getParam("floorId");
                vc.component.roomCreateFeeInfo.conditions.floorId = vc.getParam("floorName");

                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: vc.component.roomCreateFeeInfo.conditions.floorId
                    }
                }
                vc.http.get(
                    'roomCreateFee',
                    'loadFloor',
                    param,
                    function(json, res) {
                        if (res.status == 200) {
                            var _floorInfo = JSON.parse(json);
                            var _tmpFloor = _floorInfo.apiFloorDataVoList[0];
                            /*vc.emit('roomSelectFloor','chooseFloor', _tmpFloor);*/
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function() {
                if (vc.component.roomCreateFeeInfo.moreCondition) {
                    vc.component.roomCreateFeeInfo.moreCondition = false;
                } else {
                    vc.component.roomCreateFeeInfo.moreCondition = true;
                }
            },
            _openChooseFloorMethod: function() {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _toOwnerPayFee: function(_room) {
                let roomName = _room.floorNum + "栋" + _room.unitNum + "单元" + _room.roomNum + "室"
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + _room.roomId + "&payObjType=3333&roomName=" + roomName);
            },
            _printOwnOrder: function(_room) {
                //打印催交单
                vc.jumpToPage('print.html#/pages/property/printOweFee?roomId=' + _room.roomId)
            },
            _openTranslateFeeManualCollectionDetailModel: function(_room) {
                let _data = {
                        roomId: _room.roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                    //重新同步房屋欠费
                vc.http.apiPost(
                    '/feeManualCollection/saveFeeManualCollection',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            vc.jumpToPage('/#/pages/property/feeManualCollectionManage');
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },

            /**
             * 更新当前页码
             */
            updateCurrentPage: function(page) {
                $that.currentPage = page;
            },

            /**
             * 保存搜索条件、页码
             */
            saveTempSearchData: function() {
                let conditions = $that.roomCreateFeeInfo.conditions;
                //缓存起来=
                vc.saveData(TEMP_SEARCH, {
                    conditions: conditions,
                    currentPage: $that.currentPage
                });
            },
            _downloadCollectionLetterOrder: function() {
                vc.jumpToPage('/callComponent/feeManualCollection/downloadCollectionLetterOrder?communityId=' + vc.getCurrentCommunity().communityId);
            },
            _downloadRoomCollectionLetterOrder: function(_room) {
                vc.jumpToPage('/callComponent/feeManualCollection/downloadCollectionLetterOrder?communityId=' + vc.getCurrentCommunity().communityId + "&roomId=" + _room.roomId);
            },
            _openFeeImportExcel: function() {
                vc.emit('exportFeeImportExcel', 'openExportFeeImportExcelModal', {})
            },
            _openDoCreateRoomFee: function() {
                vc.emit('doImportCreateFee', 'openDoImportCreateFeeModal', {})
            }
        }
    });
})(window.vc);