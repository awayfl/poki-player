package  {
	
	import com.poki.PokiFlashSDK;
	public class sampleCommercial {

		public function sampleCommercial() {}
		
		public function callBackCommercialBreak():void {
			//gameplay screen initialization or loading screen scripts can go here
			
			PokiFlashSDK.instance().gameplayStart();
		}
		
		public function initGame(){
			PokiFlashSDK.instance().callBackCommercialBreak = callBackCommercialBreak;
			PokiFlashSDK.instance().commercialBreak();
		}

	}
	
}
