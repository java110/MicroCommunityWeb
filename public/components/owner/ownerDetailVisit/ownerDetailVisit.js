/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailVisitInfo: {
                visits: [],
                ownerId: '',
                link: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailVisit', 'switch', function (_data) {
                $that.ownerDetailVisitInfo.ownerId = _data.ownerId;
                $that.ownerDetailVisitInfo.link = _data.link;
                $that._loadOwnerDetailVisitData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailVisit', 'listVisit',
                function (_data) {
                    vc.component._loadOwnerDetailVisitData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('ownerDetailVisit', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailVisitData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailVisitData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerTel: $that.ownerDetailVisitInfo.link,
                        channel:'PC'
                    }
                };

                //发送get请求
                vc.http.apiGet('/visit.listVisits',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailVisitInfo.visits = _roomInfo.visits;
                        vc.emit('ownerDetailVisit', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailVisit: function () {
                $that._loadOwnerDetailVisitData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddVisitModal: function () {
                vc.jumpToPage("/#/pages/property/addVisitSpace")
                // vc.emit('addVisit','openAddVisitModal',{});
            },
            //访客审核
            _openExamineVisitModel: function (_visit) {
                vc.emit('examineVisit', 'openExamineVisitModel', _visit);
            },
            //访客车辆审核
            _openExamineVisitCarModel: function (_visit) {
                vc.emit('examineVisitCar', 'openExamineVisitCarModel', _visit);
            },
            _openEditVisitModel: function (_visit) {
                vc.jumpToPage("/#/pages/property/updateVisitSpace?vId=" + _visit.vId)
                //vc.emit('editVisit', 'openEditVisitModel', _visit);
                // vc.emit('deleteVisit','openDeleteVisitModal',_visit);
            },
            _openDeleteVisitModel: function (_visit) {
                vc.emit('deleteVisit', 'openVisitModel', _visit);
            },
            showVisitImg: function (e) {
                if (!e) {
                    e = '/img/noPhoto.jpg';
                }
                vc.emit('viewImage', 'showImage', {url: e});
            },
            _openVisitDetail: function (_item) {
                let _flowId = _item.flowId;
                if (!_flowId) {
                    _flowId = '';
                }
                vc.jumpToPage("/#/pages/property/visitDetail?vId=" + _item.vId + "&flowId=" + _flowId);
            },
        }
    });
})(window.vc);