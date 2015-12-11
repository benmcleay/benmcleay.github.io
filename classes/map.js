var Map = function () {
	
	var _this = this;
	
	this.canvas = document.getElementById('gameArea');
	this.ctx = this.canvas.getContext("2d");
	
	$(this.canvas).click(function (e) {
		_this.ClickOrb(this.relMouseCoords(e));
	});
	
}

Map.prototype.Clear = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Map.prototype.DrawOrb = function (orb) {
	var ctx = this.ctx;
	
	orb.Think();
	
	if (orb.x == null || orb.y == null) {
		return;
	}
	
	var colour = orb.GetDNAColour();
	
	ctx.beginPath();
	ctx.arc(orb.x, orb.y, ot.constants.RADIUS, 0, Math.PI * 2);
	ctx.fillStyle = colour.fill;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = colour.stroke;
    ctx.stroke();
	ctx.closePath();
}

Map.prototype.DrawOrbs = function (orbs) {
    if (orbs.length == 0) {
        document.location.reload();
    }

	for (var i = 0; i < orbs.length; i++) {
		this.DrawOrb(orbs[i]);
	}
}

Map.prototype.ClickOrb = function (coords) {
	
	var _this = this,
		x = coords.x,
		y = coords.y;
		
	var list = orbLife.Orbs.map(function(orb) {
			return {
				orb: orb,
				distance: ot.getOrbDistance(orb, coords)
			}
		})
		.sort(function (a, b) {
			return a.distance - b.distance;;
		});
		
	var orb = list[0] && list[0].distance < ot.constants.RADIUS + 2 ? list[0].orb : null;
	
	if (!orb) return;
	
	console.log(orb);
};