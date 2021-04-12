/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            clueAttrManageInfo:{
                clueAttrs:[],
                total:0,
                records:1,
                moreCondition:false,
                nowSituation:'',
                clueId:'',
                conditions:{
                    clueId:'',
                    nowSituation:'',
                    nextSituation:'',

                }
            }
        },
        _initMethod:function(){
            $that.clueAttrManageInfo.clueId = vc.getParam('clueId');
            $that.clueAttrManageInfo.conditions.clueId = vc.getParam('clueId');
            vc.component._listClueAttrs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('clueAttrManage','listClueAttr',function(_param){
                  vc.component._listClueAttrs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listClueAttrs(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listClueAttrs:function(_page, _rows){

                vc.component.clueAttrManageInfo.conditions.page = _page;
                vc.component.clueAttrManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.clueAttrManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/clueAttr/queryClueAttr',
                             param,
                             function(json,res){
                                var _clueAttrManageInfo=JSON.parse(json);
                                vc.component.clueAttrManageInfo.total = _clueAttrManageInfo.total;
                                vc.component.clueAttrManageInfo.records = _clueAttrManageInfo.records;
                                vc.component.clueAttrManageInfo.clueAttrs = _clueAttrManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.clueAttrManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddClueAttrModal:function(){
                vc.emit('addClueAttr','openAddClueAttrModal',{clueId: $that.clueAttrManageInfo.clueId});
            },
            _openEditClueAttrModel:function(_clueAttr){
                vc.emit('editClueAttr','openEditClueAttrModal',_clueAttr);
            },
            _openDeleteClueAttrModel:function(_clueAttr){
                vc.emit('deleteClueAttr','openDeleteClueAttrModal',_clueAttr);
            },
            _queryClueAttrMethod:function(){
                vc.component._listClueAttrs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _goBack:function(){
                vc.goBack();
            },
            _moreCondition:function(){
                if(vc.component.clueAttrManageInfo.moreCondition){
                    vc.component.clueAttrManageInfo.moreCondition = false;
                }else{
                    vc.component.clueAttrManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
