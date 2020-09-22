(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addContractInfo: {
                contractId: '',
                contractName: '',
                contractCode: '',
                contractType: '',
                partyA: '',
                partyB: '',
                aContacts: '',
                bContacts: '',
                aLink: '',
                bLink: '',
                operator: '',
                operatorLink: '',
                allNum: '',
                amount: '',
                startTime: '',
                endTime: '',
                signingTime: '',
                contractTypes: [],
                contractTypeSpecs: [],
                roomId: '',
                ownerName: '',
                link: '',
                objType:'1111',
                objId:'-1'
            }
        },
        _initMethod: function () {
            $that._loadAddContractType();

            vc.initDateTime('addStartTime', function (_value) {
                $that.addContractInfo.startTime = _value;
            });
            vc.initDateTime('addEndTime', function (_value) {
                $that.addContractInfo.endTime = _value;
            });

            vc.initDateTime('addSigningTime', function (_value) {
                $that.addContractInfo.signingTime = _value;
            });

        },
        _initEvent: function () {
            vc.on('addContract', 'openAddContractModal', function () {
                $('#addContractModel').modal('show');
            });
            $('#addContractModel').on('show.bs.modal', function (e) {
                $(this).css('display', 'block');
                let modalWidth = $(window).width() * 0.7;
                $(this).find('.modal-dialog').css({
                    'max-width': modalWidth
                });
            });
        },
        methods: {
            addContractValidate() {
                return vc.validate.validate({
                    addContractInfo: vc.component.addContractInfo
                }, {
                    'addContractInfo.contractName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "合同名称不能超过64位"
                        },
                    ],
                    'addContractInfo.contractCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "合同编号错误"
                        },
                    ],
                    'addContractInfo.contractType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "合同类型格式错误"
                        },
                    ],
                    'addContractInfo.partyA': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "甲方名称太长"
                        },
                    ],
                    'addContractInfo.partyB': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "乙方名称太长"
                        },
                    ],
                    'addContractInfo.aContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "甲方联系人长度超过64位"
                        },
                    ],
                    'addContractInfo.bContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "甲方联系人长度超过64位"
                        },
                    ],
                    'addContractInfo.aLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "甲方联系电话错误"
                        },
                    ],
                    'addContractInfo.bLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "乙方联系电话错误"
                        },
                    ],
                    'addContractInfo.operator': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "经办人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "经办人超过64位"
                        },
                    ],
                    'addContractInfo.operatorLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "经办人联系电话格式错误"
                        },
                    ],
                    'addContractInfo.amount': [
                        {
                            limit: "money",
                            param: "",
                            errInfo: "合同金额格式错误，如1.50"
                        },
                    ],
                    'addContractInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同开始时间格式错误"
                        },
                    ],
                    'addContractInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同结束时间格式错误"
                        },
                    ],
                    'addContractInfo.signingTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "签订时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同签订时间格式错误"
                        },
                    ],
                });
            },
            saveContractInfo: function () {
                if (!vc.component.addContractValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.addContractInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addContractInfo);
                    $('#addContractModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/contract/saveContract',
                    JSON.stringify(vc.component.addContractInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addContractModel').modal('hide');
                            vc.component.clearAddContractInfo();
                            vc.emit('contractManage', 'listContract', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddContractInfo: function () {
                let _contractTypes = $that.addContractInfo.contractTypes;
                vc.component.addContractInfo = {
                    contractName: '',
                    contractCode: '',
                    contractType: '',
                    partyA: '',
                    partyB: '',
                    aContacts: '',
                    bContacts: '',
                    aLink: '',
                    bLink: '',
                    operator: '',
                    operatorLink: '',
                    amount: '',
                    startTime: '',
                    endTime: '',
                    signingTime: '',
                    contractTypes: _contractTypes,
                    contractTypeSpecs: [],
                    allNum: '',
                    roomId: '',
                    ownerName: '',
                    link: '',
                    objId:'-1',
                    objType:'1111'
                };
            },
            _loadAddContractType: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        vc.component.addContractInfo.contractTypes = _contractTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeContractType: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        contractTypeId: $that.addContractInfo.contractType
                    }
                }
                $that.addContractInfo.contractTypeSpecs = [];
                vc.http.apiGet('/contract/queryContractTypeSpec',
                    param,
                    function (json, res) {
                        let _contractTypeSpecManageInfo = JSON.parse(json);
                        _contractTypeSpecManageInfo.data.forEach(item => {
                            item.value = '';
                            if (item.specShow == 'Y') {
                                item.values = [];
                                //$that._loadAttrValue(item.specCd, item.values);
                                $that.addContractInfo.contractTypeSpecs.push(item);
                            }
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryRoom: function () {
                let _allNum = $that.addContractInfo.allNum;
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
                vc.http.get('roomCreateFee',
                    'listRoom',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        let _rooms = listRoomData.rooms;

                        if (_rooms.length < 1) {
                            vc.toast('未找到房屋');
                            $that.addContractInfo.allNum = '';
                            return;
                        }

                        $that.addContractInfo.roomId = _rooms[0].roomId;
                        $that.addContractInfo.ownerName = _rooms[0].ownerName;
                        $that.addContractInfo.link = _rooms[0].link;
                        $that.addContractInfo.objType = '3333';
                        $that.addContractInfo.objId = _rooms[0].roomId;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
