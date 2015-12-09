var OrbGod = function () {
	
};

OrbGod.prototype.CreateSeedPopulation = function () {
	
	var orbs = [];
	
	for (var i = 0; i < ot.constants.SPECIES; i++) {
		
		var DNA = this.CreateNewStrainDNA();
		
		for (var j = 0; j < ot.constants.ORBS_PER_SPECIES; j++) {
			orbs.push(this.CreateOrb(DNA));
		}
		
	}
	
	return orbs;
}

OrbGod.prototype.CreateOrb = function (DNA) {
	return new Orb(DNA);
}

OrbGod.prototype.CreateNewStrainDNA = function () {
	
	var rnd = function () {
		return Math.floor(Math.random() * 100) + 1;
	}
	
	return {
		speed: rnd(),
		strength: rnd(),
		courage: rnd(),
		independence: rnd(),
		
		dna: rnd() * 10
	}
	
}

