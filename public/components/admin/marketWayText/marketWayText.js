/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketWayTextInfo:{
                marketTexts:[],
                total:0,
                records:1,
                moreCondition:false,
                textId:'',
                conditions:{
                    name:'',
                    sendRate:'',
                    textContent:'',

                }
            }
        },
        _initMethod: function() {
            vc.component._listMarketTexts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('marketWayText', 'switch', function(_data) {
                $that._listMarketTexts(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('marketTextManage', 'listMarketText', function(_data) {
                $that._listMarketTexts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketWayText', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listMarketTexts(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listMarketTexts:function(_page, _rows){

                vc.component.marketWayTextInfo.conditions.page = _page;
                vc.component.marketWayTextInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.marketWayTextInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/marketText.listMarketText',
                             param,
                             function(json,res){
                                var _marketWayTextInfo=JSON.parse(json);
                                vc.component.marketWayTextInfo.total = _marketWayTextInfo.total;
                                vc.component.marketWayTextInfo.records = _marketWayTextInfo.records;
                                vc.component.marketWayTextInfo.marketTexts = _marketWayTextInfo.data;
                                vc.emit('marketWayText', 'paginationPlus','init',{
                                     total:vc.component.marketWayTextInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddMarketTextModal:function(){
                vc.emit('addMarketText','openAddMarketTextModal',{});
            },
            _openEditMarketTextModel:function(_marketText){
                vc.emit('editMarketText','openEditMarketTextModal',_marketText);
            },
            _openDeleteMarketTextModel:function(_marketText){
                vc.emit('deleteMarketText','openDeleteMarketTextModal',_marketText);
            },
            _queryMarketTextMethod:function(){
                vc.component._listMarketTexts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.marketWayTextInfo.moreCondition){
                    vc.component.marketWayTextInfo.moreCondition = false;
                }else{
                    vc.component.marketWayTextInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);