var OrbLife = function () {
	
	this.orbIndex = 0;
	
};

OrbLife.prototype.GetOrbIndex = function () {
	return ++this.orbIndex;
}

OrbLife.prototype.SetUp = function () {
	
	this.Map = new Map();
	this.OrbGod = new OrbGod();
	
	this.Orbs = [];
	var orbs = this.OrbGod.CreateSeedPopulation();
	

	for (var i = 0; i < orbs.length; i++) {
		var orb = orbs[i];
		var x, y
		do {
            x = 20 + Math.floor(Math.random()*660);
            y = 20 + Math.floor(Math.random()*660);
		} while (this.CheckPlaceOccupied(x, y) === true);
		
		orb.x = x;
		orb.y = y;
		
		this.Orbs.push(orb);
	}
};

OrbLife.prototype.GetOrb = function (id) {
	var matchingOrbs = this.Orbs.filter(function (orb) {
		return orb.id == id;
	});
	
	if (matchingOrbs.length > 0) {
		return matchingOrbs[0];
	}
	return null;
}

OrbLife.prototype.DeleteOrb = function (id) {
	
	var index = -1;
	
	for (var i = 0; i < this.Orbs.length; i++) {
		if (this.Orbs[i].id == id) {
			index = i;
			continue;
		}
	}
	
	if (index > -1) {
		this.Orbs.splice(index, 1);
	}
}

OrbLife.prototype.CheckPlaceOccupied = function (x, y, id) {
	for (var i = 0; i < this.Orbs.length; i++) {
		
		var orb = this.Orbs[i];
		
		if (orb.id == id) continue;
		
		var dx = orb.x - x;
		var dy = orb.y - y;
		
		if (ot.detectOrbCollision(x, y, orb.x, orb.y, 400)) return true;
	}
	
	return false;
}

OrbLife.prototype.Initiate = function () {
	
	setInterval($.proxy(this.Tick, this), ot.constants.INTERVAL);
	
};

OrbLife.prototype.Tick = function () {
	
	// smarts
	
	this.Map.Clear();
	this.Map.DrawOrbs(this.Orbs);
};