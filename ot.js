var species = Math.floor(Math.random() * 10 + 2);

var ot = {

    constants: {
      
        SPECIES: species,
        ORBS_PER_SPECIES: Math.floor(100 / species),
        INTERVAL: 10,
		LIFESPAN: 100000,
		FERTILITY: 0.0005,
		RADIUS: 10,
		SENSITIVITY: 150,
        HUNGER_THRESHOLD: 8000,
        DEBUG: false,
		
		instructionTypes: {
			MOVE_TO_FRIEND: 0,
			MOVE_TO_ENEMY: 1,
			FLEE: 3
		},
		
		conditionTypes: {
			PROXIMITY: 0,
			ATTRIBUTE: 1,
			HUNGER: 2,
			AGE: 3,
			HEALTH: 4
		},
		
		testTypes: {
			LESS_THAN: 0,
			GREATER_THAN: 1,
			EQUAL_TO: 2
		}
    },

	detectOrbCollision: function (x1, y1, x2, y2, radius) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		
		return (dx * dx + dy * dy < radius);
	},
	
	isPointOutOfBounds: function(x, y) {
		if (((x + ot.constants.RADIUS) > 700) || ((y + ot.constants.RADIUS) > 700) || ((x - ot.constants.RADIUS) < 0) || ((y - ot.constants.RADIUS) < 0)) {
			return true;
		}
		return false;
	},
	
	getOrbDistance: function (orb1, orb2) {
		return Math.sqrt(Math.pow(orb1.x - orb2.x, 2) + Math.pow(orb1.y - orb2.y, 2));
	},
	
	getAngleToPoint: function (originOrb, targetOrb) {
		
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
	},
	
	rnd: function (a, b) {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	},
	
	statAsPercentage: function (stat) {
		return stat / 1000;
	}
};

