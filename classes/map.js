var Map = function () {
	
	this.canvas = document.getElementById('gameArea');
	this.ctx = this.canvas.getContext("2d");
	
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
	
	ctx.beginPath();
	ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
	ctx.fillStyle = orb.colour;
	ctx.fill();
	ctx.closePath();
}

Map.prototype.DrawOrbs = function (orbs) {
	for (var i = 0; i < orbs.length; i++) {
		this.DrawOrb(orbs[i]);
	}
}