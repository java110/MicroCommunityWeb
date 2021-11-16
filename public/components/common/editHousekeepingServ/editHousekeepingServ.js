(function (vc, vm) {

    vc.extends({
        data: {
            editHousekeepingServInfo: {
                servId: '',
                servName: '',
                servDesc: '',
                hktId: '',
                sales: '',
                sort: '',
                state: '',
                repairWay: '',
                returnVisitFlag: '',
                keyword: '',
                coverPhoto: '',
                context:'',
                carouselFigurePhoto: [],
                housekeepingTypes: []

            }
        },
        _initMethod: function () {
            $that._initEditHousekeepingServ();
            $that._listEditHousekeepingTypes();
        },
        _initEvent: function () {
            vc.on('editHousekeepingServ', 'openEditHousekeepingServModal', function (_params) {
                vc.component.refreshEditHousekeepingServInfo();
                $('#editHousekeepingServModel').modal('show');
                _params.context = filterXSS(_params.context);
                vc.copyObject(_params, vc.component.editHousekeepingServInfo);
                //处理封面喝轮播图修改不显示问题
                let _photos = [];
                _photos.push(vc.component.editHousekeepingServInfo.coverPhoto);
                vc.emit('editHousekeepingServCover','uploadImage', 'notifyPhotos',_photos);
                //轮播图
                console.log(vc.component.editHousekeepingServInfo.carouselFigurePhoto);
                vc.emit('editHousekeepingServCarouselFigure','uploadImage', 'notifyPhotos',vc.component.editHousekeepingServInfo.carouselFigurePhoto);
                $(".editServSummernote").summernote('code', vc.component.editHousekeepingServInfo.context);

            });
            vc.on("editHousekeepingServ", "notifyUploadCoverImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editHousekeepingServInfo.coverPhoto = _param[0];
                } else {
                    vc.component.editHousekeepingServInfo.coverPhoto = '';
                }
            });
            vc.on("editHousekeepingServ", "notifyUploadCarouselFigureImage", function (_param) {
                vc.component.editHousekeepingServInfo.carouselFigurePhoto = _param;
            });
        },
        methods: {
            editHousekeepingServ: function () {
              
                vc.http.apiPost(
                    '/housekeepingServ/updateHousekeepingServ',
                    JSON.stringify(vc.component.editHousekeepingServInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editHousekeepingServModel').modal('hide');
                            vc.emit('housekeepingServManage', 'listHousekeepingServ', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            _listEditHousekeepingTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        typeCd:1001,
                        //shopId:vc.getCurrentCommunity().shopId
                    }
                };

                //发送get请求
                vc.http.apiGet('/housekeepingType/queryHousekeepingType',
                    param,
                    function (json, res) {
                        var _housekeepingTypeManageInfo = JSON.parse(json);
                        vc.component.editHousekeepingServInfo.housekeepingTypes = _housekeepingTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initEditHousekeepingServ: function () {
                let $summernote = $('.editServSummernote').summernote({
                    lang: 'zh-CN',
                    height: 400,
                    placeholder: '必填，请输入服务描述',
                    callbacks: {
                    },
                    toolbar: [
                       
                    ],
                });
            },
            _refreshEditHousekeepingServInfo:function(){
                 $that.refreshEditHousekeepingServInfo();
                 vc.emit('housekeepingServManage', 'listHousekeepingServ', {});
            },
            refreshEditHousekeepingServInfo: function () {
                let _houseKeepingTypes = $that.editHousekeepingServInfo.housekeepingTypes;
                vc.component.editHousekeepingServInfo = {
                    servId: '',
                    servName: '',
                    servDesc: '',
                    hktId: '',
                    sales: '',
                    sort: '',
                    state: '',
                    repairWay: '',
                    returnVisitFlag: '',
                    keyword: '',
                    coverPhoto: '',
                    context:'',
                    carouselFigurePhoto: [],
                    housekeepingTypes: _houseKeepingTypes

                }
            }
        }
    });

})(window.vc, window.vc.component);
