Brain = function (orb) {
	this.orb = orb;
	this.rules = orb.seed.rules;
}

Brain.prototype.Think = function () {
	for (var i = 0; i < this.rules.length; i++) {
		
		var rule = this.rules[i];
		
		if (this.EvaluateRule(rule)) {
			this.ExecuteInstruction(rule.instruction);
			continue;
		}
		
	}
}

Brain.prototype.EvaluateRule = function (rule) {
	
	var value = this.orb[rule.attribute];
	var test = rule.test;
	var condition = rule.condition;
	var instruction = rule.instruction;
	
}

Brain.prototype.ExecuteInstruction = function (instruction) {
	
}

Brain.prototype.Mutate = function () {
	// fuck em up
	return this.rules;
}

Brain.prototype.InventRule = function () {
	
}