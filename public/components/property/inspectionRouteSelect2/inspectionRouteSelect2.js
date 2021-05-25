(function (vc) {
    vc.extends({
        propTypes: {
            parentModal: vc.propTypes.string,
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            inspectionRouteSelect2Info: {
                inspectionRoutes: [],
                inspectionRouteId: '',
                routeName: '',
                inspectionRouteSelector: {}
            }
        },
        watch: {
            inspectionRouteSelect2Info: {
                deep: true,
                handler: function () {
                    vc.emit($props.callBackListener, $props.callBackFunction, this.inspectionRouteSelect2Info);
                }
            }
        },
        _initMethod: function () {
            this._initInspectionRouteSelect2();
        },
        _initEvent: function () {
            vc.on('inspectionRouteSelect2', 'setInspectionRoute', function (_param) {
                vc.copyObject(_param, this.inspectionRouteSelect2Info);
                    var option = new Option(_param.routeName,_param.inspectionRouteId, true, true);
                    this.inspectionRouteSelect2Info.inspectionRouteSelector.append(option);
                
            });

            vc.on('inspectionRouteSelect2', 'clearInspectionRoute', function (_param) {
                this.inspectionRouteSelect2Info = {
                    inspectionRoutes: [],
                    inspectionRouteId: '',
                    routeName: '',
                    inspectionRouteSelector: {}
                };
            });
        },
        methods: {
            _initInspectionRouteSelect2: function () {
                $.fn.modal.Constructor.prototype.enforceFocus = function () {};
                $.fn.select2.defaults.set('width', '100%');
                this.inspectionRouteSelect2Info.inspectionRouteSelector = $('#inspectionRouteSelector').select2({
                    placeholder: '必填，请选择巡检路线',
                    allowClear: true,//允许清空
                    //multiple: true,//允许多选
                    escapeMarkup: function (markup) {
                        return markup;
                    }, // 自定义格式化防止xss注入
                    ajax: {
                        url: "/callComponent/inspectionRouteManage/list",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            console.log("param", params);
                            var _term = "";
                            if (params.hasOwnProperty("term")) {
                                _term = params.term;
                            }
                            return {
                                routeName: _term,
                                page: 1,
                                row: 10,
                                communityId: vc.getCurrentCommunity().communityId
                            };
                        },
                        processResults: function (data) {
                            return {
                                results: this._filterInspectionRouteData(data.inspectionRoutes)
                            };
                        },
                        cache: true
                    }
                });
                $('#inspectionRouteSelector').on("select2:select", function (evt) {
                    //这里是选中触发的事件
                    //evt.params.data 是选中项的信息
                    this.inspectionRouteSelect2Info.inspectionRouteId = evt.params.data.id;
                    this.inspectionRouteSelect2Info.routeName = evt.params.data.text;
                });

                $('#inspectionRouteSelector').on("select2:unselect", function (evt) {
                    //这里是取消选中触发的事件
                    //如配置allowClear: true后，触发            
                    this.inspectionRouteSelect2Info.inspectionRouteId = '';
                    this.inspectionRouteSelect2Info.routeName = '';

                });
            },
            _filterInspectionRouteData: function (_InspectionRoute) {
                var _tmpInspectionRoutes = [];
                for (var i = 0; i < _InspectionRoute.length; i++) {
                    var _tmpInspectionRoute = {
                        id: _InspectionRoute[i].inspectionRouteId,
                        text: _InspectionRoute[i].routeName
                    };
                    _tmpInspectionRoutes.push(_tmpInspectionRoute);
                }
                return _tmpInspectionRoutes;
            }
        }
    });
})(window.vc);
