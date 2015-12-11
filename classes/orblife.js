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
		
		this.PlaceOrb(orb);
		
		this.Orbs.push(orb);
	}
};

OrbLife.prototype.SpawnOrb = function (dna, mateDna, position) {
	
	var box = {
		x: position.x - 20,
		y: position.y - 20,
		size: 40
	};
	
	if (mateDna) {
		dna = this.OrbGod.Breed(dna, mateDna);
	}
	
	var orb = this.OrbGod.CreateOrb(dna);
	
	var placed = this.PlaceOrb(orb, box);
	
	if (placed) {
		this.Orbs.push(orb);
		console.log("BEEP BOOP :: ORB BORN");
	}
}

OrbLife.prototype.PlaceOrb = function (orb, box) {
	var x, y;
	
	if (!box) {
		box = {
			x: 20,
			y: 20,
			size: 660
		}
	}
	
	var count = 0;
	
	do {
		x = box.x + ot.rnd(0, box.size);
		y = box.y + ot.rnd(0, box.size);
		
		count++;
	} while (count < 20 && (this.CheckPlaceOccupied(x, y) === true || ot.isPointOutOfBounds(x, y)));
	
	if (count == 20) {
		return false
	}
	
	orb.x = x;
	orb.y = y;
	
	return true;
}

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
	this.Map.Clear();
	this.Map.DrawOrbs(this.Orbs);
};