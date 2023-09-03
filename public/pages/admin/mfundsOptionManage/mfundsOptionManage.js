/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            mfundsOptionManageInfo:{
                mfundsOptions:[],
                total:0,
                records:1,
                moreCondition:false,
                id:'',
                conditions:{
                    itemName:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listMfundsOptions(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('mfundsOptionManage','listMfundsOption',function(_param){
                  vc.component._listMfundsOptions(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listMfundsOptions(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listMfundsOptions:function(_page, _rows){

                vc.component.mfundsOptionManageInfo.conditions.page = _page;
                vc.component.mfundsOptionManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.mfundsOptionManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('mfundsOption.listMfundsOptions',
                             param,
                             function(json,res){
                                var _mfundsOptionManageInfo=JSON.parse(json);
                                vc.component.mfundsOptionManageInfo.total = _mfundsOptionManageInfo.total;
                                vc.component.mfundsOptionManageInfo.records = _mfundsOptionManageInfo.records;
                                vc.component.mfundsOptionManageInfo.mfundsOptions = _mfundsOptionManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.mfundsOptionManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddMfundsOptionModal:function(){
                vc.emit('addMfundsOption','openAddMfundsOptionModal',{});
            },
            _openEditMfundsOptionModel:function(_mfundsOption){
                vc.emit('editMfundsOption','openEditMfundsOptionModal',_mfundsOption);
            },
            _openDeleteMfundsOptionModel:function(_mfundsOption){
                vc.emit('deleteMfundsOption','openDeleteMfundsOptionModal',_mfundsOption);
            },
            _queryMfundsOptionMethod:function(){
                vc.component._listMfundsOptions(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.mfundsOptionManageInfo.moreCondition){
                    vc.component.mfundsOptionManageInfo.moreCondition = false;
                }else{
                    vc.component.mfundsOptionManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
