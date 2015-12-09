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
		fertility: rnd(),
		
		dna: rnd() * 10
	}
	
}

OrbGod.prototype.Breed = function(dna1, dna2, factor) {
	
	factor = !factor ? 1 : factor;
	
	var mix = function (a, b) {
		
		var diff = -6 * factor + Math.floor(Math.random() * 12 * factor) + 1;
		
		var average = Math.floor((a + b) / 2);
		
		var newValue = average + diff;
		
		if (newValue > 100 * factor) return 100 * factor;
		if (newValue < 1) return 1;
		return newValue;
	}
	
	return {
		speed: mix(dna1.speed, dna2.speed),
		strength: mix(dna1.strength, dna2.strength),
		courage: mix(dna1.courage, dna2.courage),
		independence: mix(dna1.independence, dna2.independence),
		fertility: mix(dna1.fertility, dna2.fertility),
		
		dna: mix(dna1.courage, dna2.courage, 10),
	}
}