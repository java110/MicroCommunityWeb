/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            convenienceMenusManageInfo:{
                convenienceMenuss:[],
                total:0,
                records:1,
                moreCondition:false,
                name:'',
                conditions:{
                    name:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listConvenienceMenuss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('convenienceMenusManage','listConvenienceMenus',function(_param){
                  vc.component._listConvenienceMenuss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listConvenienceMenuss(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listConvenienceMenuss:function(_page, _rows){

                vc.component.convenienceMenusManageInfo.conditions.page = _page;
                vc.component.convenienceMenusManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.convenienceMenusManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/convenienceMenus/queryConvenienceMenus',
                             param,
                             function(json,res){
                                var _convenienceMenusManageInfo=JSON.parse(json);
                                vc.component.convenienceMenusManageInfo.total = _convenienceMenusManageInfo.total;
                                vc.component.convenienceMenusManageInfo.records = _convenienceMenusManageInfo.records;
                                vc.component.convenienceMenusManageInfo.convenienceMenuss = _convenienceMenusManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.convenienceMenusManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddConvenienceMenusModal:function(){
                vc.emit('addConvenienceMenus','openAddConvenienceMenusModal',{});
            },
            _openEditConvenienceMenusModel:function(_convenienceMenus){
                vc.emit('editConvenienceMenus','openEditConvenienceMenusModal',_convenienceMenus);
            },
            _openDeleteConvenienceMenusModel:function(_convenienceMenus){
                vc.emit('deleteConvenienceMenus','openDeleteConvenienceMenusModal',_convenienceMenus);
            },
            _queryConvenienceMenusMethod:function(){
                vc.component._listConvenienceMenuss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.convenienceMenusManageInfo.moreCondition){
                    vc.component.convenienceMenusManageInfo.moreCondition = false;
                }else{
                    vc.component.convenienceMenusManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
