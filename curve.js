
// http://www.drillingahead.com/profiles/blogs/minimum-curvature-method
curve = function(md1, inc1, azi1, md2,inc2,azi2){

var dls = getDogLeg(inc1,inc2,azi1,azi2);

var shapeFactor = getshapeFactor(dls);

var md = md2-md1;

var east = getEast(md, inc1,inc2,azi1,azi2,shapeFactor);

var north = getNorth(md, inc1,inc2,azi1,azi2,shapeFactor);

var tvd = getTvd(md,inc1,inc2,shapeFactor);

console.log("east "+east);
console.log("north "+north);
console.log("tvd "+ tvd);
}

	function getNorth(s, inc1, inc2, azi1, azi2, shapeFactor ){
		var leftPart = Math.sin(inc1) * Math.cos(azi1);
		var rightPart = Math.sin(inc2) * Math.cos(azi2);
		var north = s/2 * ( leftPart + rightPart ) * shapeFactor;	
		return north	

	}


	function getEast(s, inc1, inc2, azi1, azi2, shapeFactor ){
		var leftPart = Math.sin(inc1) * Math.sin(azi1);
		var rightPart = Math.sin(inc2) * Math.sin(azi2);
		var east = s/2 * ( leftPart + rightPart ) * shapeFactor;	
		return east	
	}

	function getTvd(s, inc1,inc2,shapeFactor){		
		var tvd = s/2 * ( Math.cos(inc1)+Math.cos(inc2) ) * shapeFactor;
		return tvd;				
	}


	function getDogLeg(inc1,inc2,azi1,azi2){

		var leftPart = Math.cos(inc2-inc1);

		var rightPart = Math.sin(inc1) * Math.sin(inc2) * (1 - Math.cos(azi2-azi1));

		var dls = Math.acos(leftPart - rightPart);

		return dls;

	}

	function getShapeFactor(dls){
		return 2/dls * (Math.tan(dls/2));
	}

	function getAlpha(){
		
		
		
	}



	function getTangent(inc,azi){


		x = Math.cos(azi)*Math.cos(inc);
		y = Math.sin(azi)*Math.cos(inc);
		z = Math.sin(inc);

		var tangent ={'x' : x, 'y' : y, 'z' : z};
	
		return tangent;
	}

	function getTangentStar(alpha,s,sStar, tangent1,tangent2){
		
		var bracket11 = (1 - (sStar / s)) * alpha;
		var bracket21 = (sStar / s) * alpha;

		var bracket1 = Math.sin(bracket11) / Math.sin(alpha);		
		var bracket2 = Math.sin(bracket21) / Math.sin(alpha);	
		//tStar, tangent1, tangent2 are all vectors
		var tStar =( bracket1 * tangen1 )+ ( bracket2 * tangent1);
		
		return tStar;
	}








