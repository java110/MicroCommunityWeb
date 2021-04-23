/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            feeFormulaManageInfo:{
                feeFormulas:[],
                total:0,
                records:1,
                moreCondition:false,
                formulaId:'',
                conditions:{
                    formulaId:'',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod:function(){
            vc.component._listFeeFormulas(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('feeFormulaManage','listFeeFormula',function(_param){
                  vc.component._listFeeFormulas(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listFeeFormulas(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listFeeFormulas:function(_page, _rows){

                vc.component.feeFormulaManageInfo.conditions.page = _page;
                vc.component.feeFormulaManageInfo.conditions.row = _rows;
                vc.component.feeFormulaManageInfo.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params:vc.component.feeFormulaManageInfo.conditions
               };
               //发送get请求
               vc.http.apiGet('/feeFormula/queryFeeFormula',
                             param,
                             function(json,res){
                                 
                                var _feeFormulaManageInfo=JSON.parse(json);
                                vc.component.feeFormulaManageInfo.total = _feeFormulaManageInfo.total;
                                vc.component.feeFormulaManageInfo.records = _feeFormulaManageInfo.records;
                                vc.component.feeFormulaManageInfo.feeFormulas = _feeFormulaManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.feeFormulaManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddFeeFormulaModal:function(){
                vc.emit('addFeeFormula','openAddFeeFormulaModal',{});
            },
            _openEditFeeFormulaModel:function(_feeFormula){
                vc.emit('editFeeFormula','openEditFeeFormulaModal',_feeFormula);
            },
            _openDeleteFeeFormulaModel:function(_feeFormula){
                vc.emit('deleteFeeFormula','openDeleteFeeFormulaModal',_feeFormula);
            },
            _queryFeeFormulaMethod:function(){
                vc.component._listFeeFormulas(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.feeFormulaManageInfo.moreCondition){
                    vc.component.feeFormulaManageInfo.moreCondition = false;
                }else{
                    vc.component.feeFormulaManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
