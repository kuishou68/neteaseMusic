<script>
	// 判断是否登录
	global.isLogin = function(){
	 try{
	  var suid  = uni.getStorageSync('suid');
	  var srand = uni.getStorageSync('srand');
	 }catch(e){
	  //TODO handle the exception
	 }
	 if(suid == '' || srand == ''){
	  return false;
	 }else{
	  return [suid, srand];
	 }
	};
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		},

	}
</script>

<style>
	/*每个页面公共css */
	.container{ width:100%; height:calc(100vh - 75px); overflow: hidden;}
	.container scroll-view{ height:100%;}
	.fixbg{ width:100%; height: 100vh; position: fixed; background-size:cover; background-position: center 0; filter:blur(10px); transform: scale(1.2);}
</style>
