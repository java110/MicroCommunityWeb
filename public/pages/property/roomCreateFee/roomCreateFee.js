/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    var TEMP_SEARCH = 'roomCreateFeeSearch';
    vc.extends({
        data: {
            roomCreateFeeInfo: {
                total: 0,
                records: 1,
                floorId: '',
                unitId: '',
                state: '',
                roomNum: '',
                floorNum: '',
                unitNum: '',
                moreCondition: false,
                fees: [],
                roomName: '',
                roomId: '',
                builtUpArea: 0.00,
                ownerName: '',
                roomType: '',
                hireOwnerFee: '0',
                urlOwnerId: '',
                conditions: {
                    state: '',
                    roomNum: '',
                    roomId: '',
                    ownerName: ''
                }
            },
            currentPage: 1,
        },
        _initMethod: function () {
            vc.emit('roomTreeDiv', 'initRoomTreeDiv', {
                callName: 'roomCreateFee'
            });
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
            $(".popover-show-endTime").mouseover(() => {
                $('.popover-show-endTime').popover('show');
            })
            $(".popover-show-endTime").mouseleave(() => {
                $('.popover-show-endTime').popover('hide');
            })
            $(".popover-show-deadlineTime").mouseover(() => {
                $('.popover-show-deadlineTime').popover('show');
            })
            $(".popover-show-deadlineTime").mouseleave(() => {
                $('.popover-show-deadlineTime').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('roomCreateFee', 'selectRoom', function (_param) {
                $that.roomCreateFeeInfo.ownerName = '';
                if (vc.isBack()) {
                    return;
                }
                if (vc.notNull(vc.getParam("sign"))) {
                    vc.component.roomCreateFeeInfo.roomId = vc.getParam('payerObjId');
                    $that.roomCreateFeeInfo.conditions.roomId = vc.getParam('payerObjId');
                    $that.roomCreateFeeInfo.conditions.roomNum = '';
                    vc.component.roomCreateFeeInfo.roomName = vc.getParam('roomName');
                } else {
                    vc.component.roomCreateFeeInfo.roomId = _param.roomId;
                    $that.roomCreateFeeInfo.conditions.roomId = _param.roomId;
                    $that.roomCreateFeeInfo.conditions.roomNum = '';
                    vc.component.roomCreateFeeInfo.roomName = _param.roomName;
                }
                $that.listRoomInRoomCreateFee();
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('roomCreateFee', 'notifyRoom', function (_room) {
                vc.copyObject(_room, $that.roomCreateFeeInfo);
                $that.roomCreateFeeInfo.conditions.roomId = _room.roomId;
                $that.roomCreateFeeInfo.conditions.roomNum = _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum;
                $that.roomCreateFeeInfo.roomName = $that.roomCreateFeeInfo.conditions.roomNum;
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('roomCreateFee', 'notifyRoomByOwner', function (_room) {
                vc.copyObject(_room, $that.roomCreateFeeInfo);
                $that.roomCreateFeeInfo.conditions.roomId = _room.roomId;
                $that.roomCreateFeeInfo.conditions.ownerName = _room.ownerName;
                $that.roomCreateFeeInfo.conditions.roomNum = _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum;
                $that.roomCreateFeeInfo.roomName = _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum;
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that.updateCurrentPage(_currentPage);
                vc.component._loadListRoomCreateFeeInfo(_currentPage, DEFAULT_ROW);
            });
            vc.on('roomCreateFee', 'notify', function () {
                console.log('list notify');
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROW);
            })
        },
        methods: {
            _openRoomCreateFeeAddModal: function (_room, _isMore) {
                // vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                //     isMore: _isMore,
                //     room: _room
                // });
                vc.jumpToPage('/#/pages/fee/roomCreatePayFee')
            },
            _openOnlyRoomCreateFeeAddModal: function (_room, _isMore) {
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: _isMore,
                    room: _room
                });
            },
            listRoomInRoomCreateFee: function (_page, _row) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId: $that.roomCreateFeeInfo.roomId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.copyObject(listRoomData.rooms[0], $that.roomCreateFeeInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toOwnerPayFee: function (_room) {
                let roomName = _room.floorNum + "栋" + _room.unitNum + "单元" + _room.roomNum + "室"
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + _room.roomId + "&payObjType=3333&roomName=" + roomName);
            },
            _printOwnOrder: function (_room) {
                //打印催交单
                let roomName = _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum
                window.open('/print.html#/pages/property/printOweFee?payObjId=' + _room.roomId + "&payObjType=3333&payObjName=" + roomName)
            },
            _openTranslateFeeManualCollectionDetailModel: function (_room) {
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
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            vc.jumpToPage('/#/pages/property/feeManualCollectionManage');
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            /**
             * 更新当前页码
             */
            updateCurrentPage: function (page) {
                $that.currentPage = page;
            },
            /**
             * 保存搜索条件、页码
             */
            saveTempSearchData: function () {
                let conditions = $that.roomCreateFeeInfo.conditions;
                //缓存起来=
                vc.saveData(TEMP_SEARCH, {
                    conditions: conditions,
                    currentPage: $that.currentPage
                });
            },
            _downloadCollectionLetterOrder: function () {
                vc.jumpToPage('/#/pages/fee/addOweFeeCallable?callableWay=EXCEL');
                //vc.emit('downloadCollectionLetterOrder', 'openExportExcel',{})
            },
            _downloadRoomCollectionLetterOrder: function (_room) {
                //vc.jumpToPage('/callComponent/feeManualCollection/downloadCollectionLetterOrder?communityId=' + vc.getCurrentCommunity().communityId + "&roomId=" + _room.roomId);
                vc.emit('downloadCollectionLetterOrder', 'openExportExcel',{
                    roomId:_room.roomId
                })

            },
            _toPrintReminderFee: function (_room) {
            },
            _openFeeImportExcel: function () {
                vc.emit('exportFeeImportExcel', 'openExportFeeImportExcelModal', {})
            },
            _openDoCreateRoomFee: function () {
                vc.emit('doImportCreateFee', 'openDoImportCreateFeeModal', {})
            },
            getOnePrice1: function (fee) {
                let _price = fee.mwPrice;
                if (!_price) {
                    return fee.squarePrice;
                }
                if (parseFloat(_price) > 0) {
                    return _price;
                }
                return fee.squarePrice;
            },
            _loadListRoomCreateFeeInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.roomCreateFeeInfo.conditions.roomId,
                        state: $that.roomCreateFeeInfo.conditions.state,
                        ownerName: $that.roomCreateFeeInfo.conditions.ownerName,
                        roomNum: $that.roomCreateFeeInfo.conditions.roomNum
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        if (_feeConfigInfo.code == 404) {
                            vc.toast(_feeConfigInfo.msg);
                            vc.component.roomCreateFeeInfo.fees = [];
                        } else {
                            vc.component.roomCreateFeeInfo.total = _feeConfigInfo.total;
                            vc.component.roomCreateFeeInfo.records = _feeConfigInfo.records;
                            vc.component.roomCreateFeeInfo.fees = _feeConfigInfo.fees;
                            if (_feeConfigInfo.fees != null && _feeConfigInfo.fees.length > 0) {
                                vc.component.roomCreateFeeInfo.roomId = _feeConfigInfo.fees[0].payerObjId;
                                vc.component.roomCreateFeeInfo.conditions.roomId = _feeConfigInfo.fees[0].payerObjId;
                            }
                            vc.emit('pagination', 'init', {
                                total: _feeConfigInfo.records,
                                dataCount: _feeConfigInfo.total,
                                currentPage: _page
                            });
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _payFee: function (_fee) {
                _fee.roomName = $that.roomCreateFeeInfo.roomName;
                _fee.builtUpArea = $that.roomCreateFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editFee: function (_fee) {
                // 计费结束时间
                _fee.maxEndTime = $that._getAttrValue(_fee.feeAttrs, '390010');
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function (_fee) {
                _fee.builtUpArea = $that.roomCreateFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function (_fee) {
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _refreshListRoomCreateFeeInfo: function () {
                vc.component.roomCreateFeeInfo._currentFeeConfigName = "";
            },
            _goBack: function () {
                vc.goBack();
            },
            _toOwnerPayFee: function () {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + $that.roomCreateFeeInfo.roomId + "&payObjType=3333&roomName=" + $that.roomCreateFeeInfo.roomName);
            },
            _openRoomCreateFeeComboModal: function () {
                vc.jumpToPage('/#/pages/property/createFeeByCombo?payerObjId=' +
                    $that.roomCreateFeeInfo.roomId +
                    "&payerObjName=" + $that.roomCreateFeeInfo.roomName +
                    "&payerObjType=3333")
            },
            _openAddMeterWaterModal: function () {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.roomCreateFeeInfo.roomId,
                    roomName: $that.roomCreateFeeInfo.roomName,
                    ownerName: $that.roomCreateFeeInfo.ownerName
                });
            },
            _getAttrValue: function (_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });
                return _value;
            },
            _getDeadlineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
            _openProxyFeeModal: function () { //创建代收费用
                vc.emit('addProxyFee', 'openAddProxyFeeModal', {
                    roomId: $that.roomCreateFeeInfo.roomId,
                    roomName: $that.roomCreateFeeInfo.roomName,
                    ownerName: $that.roomCreateFeeInfo.ownerName
                });
            },
            _inputRoomByOwner: function () {
                if ($that.roomCreateFeeInfo.timer) {
                    clearTimeout($that.roomCreateFeeInfo.timer)
                }
                $that.roomCreateFeeInfo.timer = setTimeout(() => {
                    vc.emit('inputSearchRoomByOwner', 'searchRoom', {
                        callComponent: 'roomCreateFee',
                        ownerName: $that.roomCreateFeeInfo.conditions.ownerName
                    });
                }, 1500)
            },
            //查询
            _queryRoomCreateFeeMethod: function () {
                // 关闭查询组件
                if ($that.roomCreateFeeInfo.conditions.roomNum != null && $that.roomCreateFeeInfo.conditions.roomNum != '' &&
                    $that.roomCreateFeeInfo.conditions.roomNum != undefined) {
                    $that.roomCreateFeeInfo.roomName = $that.roomCreateFeeInfo.conditions.roomNum;
                }
                vc.emit('inputSearchRoomInfo', 'close', {});
                vc.emit('inputSearchRoomByOwner', 'close', {});
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            _resetRoomCreateFeeMethod: function () {
                // 关闭查询组件
                vc.emit('inputSearchRoomInfo', 'close', {});
                vc.emit('inputSearchRoomByOwner', 'close', {});
                vc.component.roomCreateFeeInfo.conditions.roomNum = "";
                vc.component.roomCreateFeeInfo.conditions.state = "";
                vc.component.roomCreateFeeInfo.conditions.ownerName = "";
                // vc.component.roomCreateFeeInfo.roomName = "";
                // vc.component.roomCreateFeeInfo.conditions.roomId = "";
                vc.component.roomCreateFeeInfo.fees = [];
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _viewRoomFeeConfig: function (_fee) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        configId: _fee.configId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfig = _feeConfigManageInfo.feeConfigs[0];
                        vc.emit('viewData', 'openViewDataModal', {
                            title: _fee.feeName + " 费用项",
                            data: {
                                "费用项ID": _feeConfig.configId,
                                "费用类型": _feeConfig.feeTypeCdName,
                                "收费项目": _feeConfig.feeName,
                                "费用标识": _feeConfig.feeFlagName,
                                "催缴类型": _feeConfig.billTypeName,
                                "付费类型": _feeConfig.paymentCd == '1200' ? '预付费' : '后付费',
                                "缴费周期": _feeConfig.paymentCycle,
                                "应收开始时间": _feeConfig.startTime,
                                "应收结束时间": _feeConfig.endTime,
                                "公式": _feeConfig.computingFormulaName,
                                "计费单价": _feeConfig.computingFormula == '2002' ? '-' : _feeConfig.squarePrice,
                                "附加/固定费用": _feeConfig.additionalAmount,
                            }
                        })
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewRoomFee: function (_fee) {
                let _data = {
                    "费用ID": _fee.feeId,
                    "费用标识": _fee.feeFlagName,
                    "费用类型": _fee.feeTypeCdName,
                    "付费对象": _fee.payerObjName,
                    "费用项": _fee.feeName,
                    "费用状态": _fee.stateName,
                    "建账时间": _fee.startTime,
                    "应收开始时间": $that._getEndTime(_fee),
                    "应收结束时间": $that._getDeadlineTime(_fee),
                    "批次": _fee.batchId,
                };
                _fee.feeAttrs.forEach(attr => {
                    _data[attr.specCdName] = attr.value;
                })
                vc.emit('viewData', 'openViewDataModal', {
                    title: _fee.feeName + " 详情",
                    data: _data
                });
            },
            _viewRoomData: function () {
                vc.emit('viewRoomData', 'showData', {
                    roomId: $that.roomCreateFeeInfo.roomId
                })
            },
            _roomCreateFeetoSimplifyAcceptance: function () {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: $that.roomCreateFeeInfo.floorNum + "-" + $that.roomCreateFeeInfo.unitNum + "-" + $that.roomCreateFeeInfo.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })
                vc.jumpToPage('/#/pages/property/simplifyAcceptance?tab=业务受理');
            },
        }
    });
})(window.vc);