/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    var DEFAULT_10ROWS = 10;
    vc.extends({
        data: {
            viewClueInfo:{
                clueId:'',
                projectName:'',
                projectSite:'',
                projectSummary:'',
                investmentAmount:'',
                investmentName:'',
                tel:'',
                investmentSummary:'',
                nowSituation:'',
                nextSituation:''
            },
            clueAttrs:[]
        },
        _initMethod: function () {
            vc.component.viewClueInfo.clueId = vc.getParam('clueId');
            vc.component._listClue(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadClueAttrs(DEFAULT_PAGE, DEFAULT_10ROWS);
        },
        _initEvent: function () {

        },
        methods: {
            _listClue: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        clueId: vc.component.viewClueInfo.clueId
                    }
                };
                //发送get请求
                vc.http.apiGet('/clue/queryClue',
                    param,
                    function (json) {
                        var _clueInfo = JSON.parse(json);
                        var _clue = _clueInfo.data[0];
                        vc.copyObject(_clue, vc.component.viewClueInfo);
                    }, function () {
                        console.log('请求失败处理');
                    }
                );               
            },
            _loadClueAttrs: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        clueId: vc.component.viewClueInfo.clueId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/clueAttr/queryClueAttr',
                    param,
                    function (json, res) {
                        var _clueAttrs=JSON.parse(json);
                        console.log(_clueAttrs);
                        vc.component.clueAttrs = _clueAttrs.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goback: function () {
                vc.getBack();
            }
        }
    });
})(window.vc);
