/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            wechatMenuManageInfo:{
                wechatMenus:[],
                total:0,
                records:1,
                moreCondition:false,
                wechatMenuId:'',
                conditions:{
                    menuName:'',
menuLevel:'',
menuType:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listWechatMenus(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('wechatMenuManage','listWechatMenu',function(_param){
                  vc.component._listWechatMenus(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listWechatMenus(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listWechatMenus:function(_page, _rows){

                vc.component.wechatMenuManageInfo.conditions.page = _page;
                vc.component.wechatMenuManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.wechatMenuManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('wechatMenu.listWechatMenus',
                             param,
                             function(json,res){
                                var _wechatMenuManageInfo=JSON.parse(json);
                                vc.component.wechatMenuManageInfo.total = _wechatMenuManageInfo.total;
                                vc.component.wechatMenuManageInfo.records = _wechatMenuManageInfo.records;
                                vc.component.wechatMenuManageInfo.wechatMenus = _wechatMenuManageInfo.wechatMenus;
                                vc.emit('pagination','init',{
                                     total:vc.component.wechatMenuManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddWechatMenuModal:function(){
                vc.emit('addWechatMenu','openAddWechatMenuModal',{});
            },
            _openEditWechatMenuModel:function(_wechatMenu){
                vc.emit('editWechatMenu','openEditWechatMenuModal',_wechatMenu);
            },
            _openDeleteWechatMenuModel:function(_wechatMenu){
                vc.emit('deleteWechatMenu','openDeleteWechatMenuModal',_wechatMenu);
            },
            _queryWechatMenuMethod:function(){
                vc.component._listWechatMenus(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.wechatMenuManageInfo.moreCondition){
                    vc.component.wechatMenuManageInfo.moreCondition = false;
                }else{
                    vc.component.wechatMenuManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
