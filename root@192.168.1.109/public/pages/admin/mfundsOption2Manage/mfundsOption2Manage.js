/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            mfundsOption2ManageInfo:{
                mfundsOption2s:[],
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
            vc.component._listMfundsOption2s(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('mfundsOption2Manage','listMfundsOption2',function(_param){
                  vc.component._listMfundsOption2s(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listMfundsOption2s(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listMfundsOption2s:function(_page, _rows){

                vc.component.mfundsOption2ManageInfo.conditions.page = _page;
                vc.component.mfundsOption2ManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.mfundsOption2ManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('mfundsOption2.listMfundsOption2s',
                             param,
                             function(json,res){
                                var _mfundsOption2ManageInfo=JSON.parse(json);
                                vc.component.mfundsOption2ManageInfo.total = _mfundsOption2ManageInfo.total;
                                vc.component.mfundsOption2ManageInfo.records = _mfundsOption2ManageInfo.records;
                                vc.component.mfundsOption2ManageInfo.mfundsOption2s = _mfundsOption2ManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.mfundsOption2ManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddMfundsOption2Modal:function(){
                vc.emit('addMfundsOption2','openAddMfundsOption2Modal',{});
            },
            _openEditMfundsOption2Model:function(_mfundsOption2){
                vc.emit('editMfundsOption2','openEditMfundsOption2Modal',_mfundsOption2);
            },
            _openDeleteMfundsOption2Model:function(_mfundsOption2){
                vc.emit('deleteMfundsOption2','openDeleteMfundsOption2Modal',_mfundsOption2);
            },
            _queryMfundsOption2Method:function(){
                vc.component._listMfundsOption2s(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.mfundsOption2ManageInfo.moreCondition){
                    vc.component.mfundsOption2ManageInfo.moreCondition = false;
                }else{
                    vc.component.mfundsOption2ManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
