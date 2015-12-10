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
	ctx.arc(orb.x, orb.y, ot.constants.RADIUS, 0, Math.PI * 2);
	ctx.fillStyle = orb.GetDNAColour();
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#777';
    ctx.stroke();
	ctx.closePath();
}

Map.prototype.DrawOrbs = function (orbs) {
	for (var i = 0; i < orbs.length; i++) {
		this.DrawOrb(orbs[i]);
	}
}