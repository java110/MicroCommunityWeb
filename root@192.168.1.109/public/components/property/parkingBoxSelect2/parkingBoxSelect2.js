(function(vc) {
    vc.extends({
        propTypes: {
            parentModal: vc.propTypes.string,
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            parkingBoxSelect2Info: {
                parkingBoxs: [],
                boxId: '-1',
                boxName: '',
                parkingBoxSelector: {},
            }
        },
        watch: {
            parkingBoxSelect2Info: {
                deep: true,
                handler: function() {
                    vc.emit($props.callBackListener, $props.callBackFunction, this.parkingBoxSelect2Info);
                }
            }
        },
        _initMethod: function() {
            this._initParkingBoxSelect2();
        },
        _initEvent: function() {
            //监听 modal 打开
            vc.on('parkingBoxSelect2', 'setParkingBox', function(_param) {
                vc.copyObject(_param, this.parkingBoxSelect2Info);

                var option = new Option(_param.boxName, _param.boxId, true, true);
                this.parkingBoxSelect2Info.parkingBoxSelector.append(option);
            });

            vc.on('parkingBoxSelect2', 'clearParkingBox', function(_param) {
                this.parkingBoxSelect2Info = {
                    parkingBoxs: [],
                    boxId: '-1',
                    boxName: '',
                    parkingBoxSelector: {},
                };
            });
        },
        methods: {
            _initParkingBoxSelect2: function() {
                console.log("调用_initParkingBoxSelect2 方法");
                $.fn.modal.Constructor.prototype.enforceFocus = function() {};
                $.fn.select2.defaults.set('width', '100%');
                this.parkingBoxSelect2Info.parkingBoxSelector = $('#parkingBoxSelector').select2({
                    placeholder: '必填，请选择岗亭',
                    allowClear: true, //允许清空
                    escapeMarkup: function(markup) {
                        return markup;
                    }, // 自定义格式化防止xss注入
                    ajax: {
                        url: "/app/parkingBox.listParkingBox",
                        dataType: 'json',
                        delay: 250,
                        headers: {
                            'APP-ID': '8000418004',
                            'TRANSACTION-ID': vc.uuid(),
                            'REQ-TIME': vc.getDateYYYYMMDDHHMISS(),
                            'SIGN': ''
                        },
                        data: function(params) {
                            console.log("param", params);
                            var _term = "";
                            if (params.hasOwnProperty("term")) {
                                _term = params.term;
                            }
                            return {
                                boxName: _term,
                                page: 1,
                                row: 50,
                                communityId: vc.getCurrentCommunity().communityId
                            };
                        },
                        processResults: function(data) {
                            console.log(data, this._filterParkingBoxData(data.data));
                            return {
                                results: this._filterParkingBoxData(data.data)
                            };
                        },
                        cache: true
                    }
                });
                $('#parkingBoxSelector').on("select2:select", function(evt) {
                    //这里是选中触发的事件
                    //evt.params.data 是选中项的信息
                    console.log('select', evt);
                    this.parkingBoxSelect2Info.boxId = evt.params.data.id;
                    this.parkingBoxSelect2Info.boxName = evt.params.data.text;
                });

                $('#parkingBoxSelector').on("select2:unselect", function(evt) {
                    //这里是取消选中触发的事件
                    //如配置allowClear: true后，触发
                    console.log('unselect', evt);
                    this.parkingBoxSelect2Info.boxId = '-1';
                    this.parkingBoxSelect2Info.boxName = '';

                });
            },
            _filterParkingBoxData: function(_parkingBoxs) {
                var _tmpParkingBoxs = [];
                for (var i = 0; i < _parkingBoxs.length; i++) {
                    var _tmpParkingBox = {
                        id: _parkingBoxs[i].boxId,
                        text: _parkingBoxs[i].boxName
                    };
                    _tmpParkingBoxs.push(_tmpParkingBox);
                }
                return _tmpParkingBoxs;
            }
        }
    });
})(window.vc);