/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            feePrintSpecManageInfo:{
                feePrintSpecs:[],
                total:0,
                records:1,
                moreCondition:false,
                specCd:'',
                conditions:{
                    specCd:'',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod:function(){
            vc.component._listFeePrintSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('feePrintSpecManage','listFeePrintSpec',function(_param){
                  vc.component._listFeePrintSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listFeePrintSpecs(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listFeePrintSpecs:function(_page, _rows){

                vc.component.feePrintSpecManageInfo.conditions.page = _page;
                vc.component.feePrintSpecManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.feePrintSpecManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/feePrintSpec/queryFeePrintSpec',
                             param,
                             function(json,res){
                                var _feePrintSpecManageInfo=JSON.parse(json);
                                vc.component.feePrintSpecManageInfo.total = _feePrintSpecManageInfo.total;
                                vc.component.feePrintSpecManageInfo.records = _feePrintSpecManageInfo.records;
                                vc.component.feePrintSpecManageInfo.feePrintSpecs = _feePrintSpecManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.feePrintSpecManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddFeePrintSpecModal:function(){
                vc.emit('addFeePrintSpec','openAddFeePrintSpecModal',{});
            },
            _openEditFeePrintSpecModel:function(_feePrintSpec){
                vc.emit('editFeePrintSpec','openEditFeePrintSpecModal',_feePrintSpec);
            },
            _openDeleteFeePrintSpecModel:function(_feePrintSpec){
                vc.emit('deleteFeePrintSpec','openDeleteFeePrintSpecModal',_feePrintSpec);
            },
            _queryFeePrintSpecMethod:function(){
                vc.component._listFeePrintSpecs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.feePrintSpecManageInfo.moreCondition){
                    vc.component.feePrintSpecManageInfo.moreCondition = false;
                }else{
                    vc.component.feePrintSpecManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
