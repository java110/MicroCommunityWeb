(function (vc, vm) {

    vc.extends({
        data: {
            editCommunityInfo: {
                communityId: '',
                name: '',
                address: '',
                nearbyLandmarks: '',
                cityCode: '',
                mapX: '101.33',
                mapY: '101.33',
                
                attrs: []
            }
        },
        _initMethod: function () {
            $that._loadEditCommunityAttrSpec();
        },
        _initEvent: function () {
            vc.on('editCommunity', 'openEditCommunityModal',
                function (_params) {
                    vc.component.refreshEditCommunityInfo();
                    $('#editCommunityModel').modal('show');
                    vc.copyObject(_params, vc.component.editCommunityInfo);

                    if (_params.hasOwnProperty('communityAttrDtos')) {
                        let _attrDtos = _params.communityAttrDtos;
                        _attrDtos.forEach(item => {
                            $that.editCommunityInfo.attrs.forEach(attrItem => {
                                if (item.specCd == attrItem.specCd) {
                                    attrItem.attrId = item.attrId;
                                    attrItem.value = item.value;
                                }
                            })
                        })
                    }
                });
        },
        methods: {
            editCommunityValidate: function () {
                return vc.validate.validate({
                    editCommunityInfo: vc.component.editCommunityInfo
                },
                    {
                        'editCommunityInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "小区名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "4,20",
                            errInfo: "小区名称必须在4至20字符之间"
                        },
                        ],
                        'editCommunityInfo.address': [{
                            limit: "required",
                            param: "",
                            errInfo: "小区地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "小区地址不能大于200个字符"
                        },
                        ],
                        'editCommunityInfo.nearbyLandmarks': [{
                            limit: "required",
                            param: "",
                            errInfo: "附近地标不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "小区附近地标不能大于50个字符"
                        },
                        ],
                        'editCommunityInfo.cityCode': [{
                            limit: "maxLength",
                            param: "12",
                            errInfo: "小区城市编码不能大于4个字符"
                        },
                        ],
                        'editCommunityInfo.mapX': [{
                            limit: "maxLength",
                            param: "20",
                            errInfo: "小区城市编码不能大于4个字符"
                        },
                        ],
                        'editCommunityInfo.mapY': [{
                            limit: "maxLength",
                            param: "20",
                            errInfo: "小区城市编码不能大于4个字符"
                        },
                        ],
                        'editCommunityInfo.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "小区ID不能为空"
                        }]

                    });
            },
            editCommunity: function () {
                if (!vc.component.editCommunityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }



                vc.http.post('editCommunity', 'update', JSON.stringify(vc.component.editCommunityInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editCommunityModel').modal('hide');
                            vc.emit('communityManage', 'listCommunity', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditCommunityInfo: function () {

                let _attrs = $that.editCommunityInfo.attrs;
                vc.component.editCommunityInfo = {
                    communityId: '',
                    name: '',
                    address: '',
                    nearbyLandmarks: '',
                    cityCode: '',
                    mapX: '101.33',
                    mapY: '101.33',
                    
                    attrs: _attrs
                }
            },
            _loadEditCommunityAttrSpec: function () {
                $that.editCommunityInfo.attrs = [];
                vc.getAttrSpec('building_community_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editCommunityInfo.attrs.push(item);
                        }
                    });

                });
            },
            _loadEditAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                });
            },
        }
    });

})(window.vc, window.vc.component);