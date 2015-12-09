var ot = {

    constants: {
      
        SPECIES: 10,
        ORBS_PER_SPECIES: 3,
        INTERVAL: 10,
        DEBUG: false

    },

	detectOrbCollision: function (x1, y1, x2, y2, radius) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		
		return (dx * dx + dy * dy < radius);
	},
	
	isPointOutOfBounds: function(x, y) {
		if (((x + 10) > 700) || ((y + 10) > 700) || ((x - 10) < 0) || ((y - 10) < 0)) {
			return true;
		}
		return false;
	},
	
	getOrbDistance: function (orb1, orb2) {
		return Math.sqrt(Math.pow(orb1.x - orb2.x, 2) + Math.pow(orb1.y - orb2.y, 2));
	},
	
	getAngleToPoint: function (originOrb, targetOrb) {
		var angleTrunc = function (a) {
			while (a < 0) {
				a += Math.PI * 2;
			}
			return a;
		}
		
		var dx = targetOrb.x - originOrb.x;
		var dy = targetOrb.y - originOrb.y;
		
		return Math.atan2(dy, dx);
	},
	
	getDxDyAlongAngle: function (angle, speed) {
		if (!speed) speed = 1;

		return [Math.cos(angle) * speed, Math.sin(angle) * speed]
	},
	
	sameDnaCheck: function (a, b) {
		return Math.abs(a.dna - b.dna) < 50
	}
};
