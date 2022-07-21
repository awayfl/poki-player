package  {
	
	import flash.display.MovieClip;
	
	
	public class main extends MovieClip {
		public var nextbtn;
		
		public function main() {
			nextbtn = new next_button();
			
			stage.addChild(nextbtn);
		}
	}
	
}
