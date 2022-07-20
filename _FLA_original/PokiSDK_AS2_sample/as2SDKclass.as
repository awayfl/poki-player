initGame();
	
function callBackCommercialBreak():Void {
	//gameplay initialization script goes here
	_global["PokiSDK2"].gameplayStart();
}
	
function initGame() {
	_global["PokiSDK2"].commercialBreak(this, callBackCommercialBreak);
}