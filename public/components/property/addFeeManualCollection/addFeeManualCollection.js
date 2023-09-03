(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeManualCollectionInfo: {
                collectionId: '',
                roomName: '',
                ownerName: '',
                link: '',
                roomArea: '',
                remark: '',
                roomId: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addFeeManualCollection', 'openAddFeeManualCollectionModal', function() {
                $('#addFeeManualCollectionModel').modal('show');
            });
        },
        methods: {
            addFeeManualCollectionValidate() {
                return vc.validate.validate({
                    addFeeManualCollectionInfo: vc.component.addFeeManualCollectionInfo
                }, {
                    'addFeeManualCollectionInfo.roomName': [{
                            limit: "required",
                            param: "",
                            errInfo: "规格不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "房屋错误"
                        },
                    ],
                    'addFeeManualCollectionInfo.ownerName': [{
                            limit: "required",
                            param: "",
                            errInfo: "业主名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "业主名称超过100位"
                        },
                    ],
                    'addFeeManualCollectionInfo.link': [{
                            limit: "required",
                            param: "",
                            errInfo: "业主电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "业主电话格式错误"
                        },
                    ],
                    'addFeeManualCollectionInfo.roomArea': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "房屋面积格式错误"
                        },
                    ],
                    'addFeeManualCollectionInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注超过200位"
                    }, ],
                });
            },
            saveFeeManualCollectionInfo: function() {
                if (!vc.component.addFeeManualCollectionValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addFeeManualCollectionInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeManualCollectionInfo);
                    $('#addFeeManualCollectionModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/feeManualCollection/saveFeeManualCollection',
                    JSON.stringify(vc.component.addFeeManualCollectionInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeManualCollectionModel').modal('hide');
                            vc.component.clearAddFeeManualCollectionInfo();
                            vc.emit('feeManualCollectionManage', 'listFeeManualCollection', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddFeeManualCollectionInfo: function() {
                vc.component.addFeeManualCollectionInfo = {
                    roomName: '',
                    roomId: '',
                    ownerName: '',
                    link: '',
                    roomArea: '',
                    remark: '',
                };
            },
            _queryRoom: function() {
                let _allNum = $that.addFeeManualCollectionInfo.roomName;
                if (_allNum == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                if (_allNum.split('-').length == 3) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                } else {
                    vc.toast('房屋填写格式错误，请填写 楼栋-单元-房屋格式')
                    return;
                }

                //发送get请求
                vc.http.apiGet('/fee.listRoomsWhereFeeSet',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        let _rooms = listRoomData.rooms;

                        if (_rooms.length < 1) {
                            vc.toast('未找到房屋');
                            $that.addContractInfo.allNum = '';
                            return;
                        }

                        $that.addFeeManualCollectionInfo.roomId = _rooms[0].roomId;
                        $that.addFeeManualCollectionInfo.ownerName = _rooms[0].ownerName;
                        $that.addFeeManualCollectionInfo.link = _rooms[0].link;

                        $that.addFeeManualCollectionInfo.roomArea = _rooms[0].builtUpArea;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);