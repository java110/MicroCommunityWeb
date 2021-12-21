(function (vc) {
    vc.extends({
        propTypes: {
            parentModal: vc.propTypes.string,
            callBackListener: vc.propTypes.string = "", //父组件名称
            callBackFunction: vc.propTypes.string = "" //父组件监听方法
        },
        data: {
            floorSelect2Info: {
                floors: [],
                floorId: '-1',
                floorNum: '',
                floorName: '',
                floorSelector: {},
            }
        },
        watch: {
            floorSelect2Info: {
                deep: true,
                handler: function () {
                    vc.emit($namespace, 'unitSelect2', 'clearUnit', {});
                    vc.emit($namespace, 'unitSelect2', "transferFloor", this.floorSelect2Info);
                    console.log(this.floorSelect2Info);
                    vc.emit($namespace, $props.callBackListener, $props.callBackFunction, this.floorSelect2Info);

                }
            }
        },
        _initMethod: function () {
            this._initFloorSelect2();
        },
        _initEvent: function () {
            //监听 modal 打开
            /* $('#'+$props.parentModal).on('show.bs.modal', function () {
                  vc.component._initFloorSelect2();
             })*/
            vc.on('floorSelect2', 'setFloor', function (_param) {
                vc.copyObject(_param, this.floorSelect2Info);
                this._loadFloorInfo(function () {
                    var option = new Option(_param.floorNum + '号楼', _param.floorId, true, true);
                    this.floorSelect2Info.floorSelector.append(option);
                });

            });

            vc.on('floorSelect2', 'clearFloor', function (_param) {
                $('#floorSelector').val('').select2();
                this._initFloorSelect2();
                this.floorSelect2Info = {
                    floors: [],
                    floorId: '-1',
                    floorNum: '',
                    floorName: '',
                    floorSelector: {},
                };
            });
        },
        methods: {
            _initFloorSelect2: function () {
                console.log("调用_initFloorSelect2 方法");
                $.fn.modal.Constructor.prototype.enforceFocus = function () {
                };
                $.fn.select2.defaults.set('width', '100%');
                this.floorSelect2Info.floorSelector = $('#floorSelector').select2({
                    placeholder: '必填，请选择楼栋',
                    allowClear: true,//允许清空
                    escapeMarkup: function (markup) {
                        return markup;
                    }, // 自定义格式化防止xss注入
                    ajax: {
                        url: "/callComponent/floorSelect2/list",
                        dataType: 'json',
                        delay: 250,
                        headers:{
                            'APP-ID': '8000418004',
                            'TRANSACTION-ID' : vc.uuid(),
                            'REQ-TIME': vc.getDateYYYYMMDDHHMISS(),
                            'SIGN' : ''
                        },
                        data: function (params) {
                            console.log("param", params);
                            var _term = "";
                            if (params.hasOwnProperty("term")) {
                                _term = params.term;
                            }
                            return {
                                floorNum: _term,
                                page: 1,
                                row: 50,
                                communityId: vc.getCurrentCommunity().communityId
                            };
                        },
                        processResults: function (data) {
                            // console.log(data, this._filterFloorData(data.apiFloorDataVoList));
                            return {
                                results: this._filterFloorData(data.apiFloorDataVoList)
                            };
                        },
                        cache: true
                    }
                });
                $('#floorSelector').on("select2:select", function (evt) {
                    //这里是选中触发的事件
                    //evt.params.data 是选中项的信息
                    console.log('select', evt);
                    this.floorSelect2Info.floorId = evt.params.data.id;
                    this.floorSelect2Info.floorNum = evt.params.data.text;
                });

                $('#floorSelector').on("select2:unselect", function (evt) {
                    //这里是取消选中触发的事件
                    //如配置allowClear: true后，触发
                    console.log('unselect', evt);
                    this.floorSelect2Info.floorId = '-1';
                    this.floorSelect2Info.floorNum = '';

                });
            },
            _filterFloorData: function (_floors) {
                var _tmpFloors = [];
                for (var i = 0; i < _floors.length; i++) {
                    var _tmpFloor = {
                        id: _floors[i].floorId,
                        text: _floors[i].floorNum + '栋'
                    };
                    _tmpFloors.push(_tmpFloor);
                }
                return _tmpFloors;
            },
            _loadFloorInfo: function (callBack) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: this.floorSelect2Info.floorId
                    }
                };

                //发送get请求
                vc.http.get('floorSelect2',
                    'list',
                    param,
                    function (json, res) {
                        var _ownerRepairManageInfo = JSON.parse(json);
                        let _floor = _ownerRepairManageInfo.apiFloorDataVoList[0];

                        this.floorSelect2Info.floorNum = _floor.floorNum;

                        callBack();

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
