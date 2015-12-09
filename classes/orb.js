var Orb = function (DNA) {
	
	this.id = orbLife.GetOrbIndex();
	
	this.speed = DNA.speed;
	this.strength = DNA.strength;
	this.courage = DNA.courage;
	this.independence = DNA.independence;
	
	this.dna = DNA.dna;
	
	this.colour = this.GetDNAColour(this.dna);
	
    this.age = 0;
	this.health = 100;
	
	this.x = null;
	this.y = null;
}

Orb.prototype.Think = function () {
	
	var _this = this;

    var feeling = this.AnalyzeSurroundings();
    
    this.FuckOrFight();
    
    if (feeling == "alone")
    {
        this.MoveToFriend();
    }
    if (feeling == "scared") {
        this.Flee();
    }
    if (feeling == "brave")
    {
        this.MoveToEnemy();
    }
    
    this.Age();
}

Orb.prototype.Age = function () {
    this.age++;
    
    if (this.age > ot.constants.LIFESPAN) {
        this.Kill();
    }  
};

Orb.prototype.FuckOrFight = function () {
    
    var orbCount = this.GetOrbCount(ot.constants.RADIUS * 2 + 3);
    
    if (orbCount.friends == 0 && orbCount.enemies > 0) {
        this.DecreaseHealth(0.2 * orbCount.enemies);
    } else if (orbCount.enemies == 0 && orbCount.friends > 0) {
        if (Math.random() < ot.constants.FERTILITY) {
            orbLife.SpawnOrb(this.dna, {
                x: this.x,
                y: this.y
            })
        }
    }
}

Orb.prototype.IncreaseHealth = function (delta) {
    if (this.health < 100) {
        this.health += delta;
     }    
}

Orb.prototype.DecreaseHealth = function (delta) {
    if (this.health > 1) {
        this.health -= delta;    
    } else {
        this.Kill();
    }
}

Orb.prototype.Kill = function () {
    orbLife.DeleteOrb(this.id); 
    
    console.log("BEEP BOOP :: ORB DEAD")
}

Orb.prototype.AnalyzeSurroundings = function()
{
    var _this = this;

    var distanceToOrbs = this.GetOrbDistanceList(null, "ascending");

    var closeOrbs = distanceToOrbs.filter(function(distanceObj)
    {
        return _this.id != distanceObj.orb.id && distanceObj.distance < 150;
    });

    var total = closeOrbs.length;

    var enemies = closeOrbs.filter(function(distanceObj)
    {
        return Math.abs(distanceObj.orb.dna - _this.dna) > 50
    }).length;

    if (total == 0 && this.courage < 80)
    {
        return "alone";
    }

    if (enemies * (this.courage / 100 + 0.5) > (total / 2))
    {
        return "scared";
    }

    return "brave";
}


Orb.prototype.MoveToFriend = function ()
{
    this.MoveTo("friend");
}

Orb.prototype.MoveToEnemy = function()
{
    this.MoveTo("enemy");
}

Orb.prototype.Flee = function()
{
    this.MoveTo("enemy", true);
}

Orb.prototype.MoveTo = function(type, invert)
{
    var filter,
        _this = this;

    if (type == "friend")
    {
        filter = function (orb) {
            return _this.id != orb.id && Math.abs(orb.dna - _this.dna) < 50;
        }
    }
    else if (type == "enemy")
    {
        filter = filter = function (orb) {
            return _this.id != orb.id && Math.abs(orb.dna - _this.dna) > 50;
        }
    }

    var distanceToOrbs = this.GetOrbDistanceList(filter);

    distanceToOrbs = distanceToOrbs.sort(function (a, b) {
        return b.distance - a.distance;
    });

    if (!distanceToOrbs[0] || distanceToOrbs[0].distance < distanceToOrbs[0].orb.independence) return;

    var target = distanceToOrbs[0].orb;

    this.MoveTowards(target, invert);
}

Orb.prototype.MoveTowards = function(orb, invert)
{
    var _this = this;
    var angle = ot.getAngleToPoint(this, orb);

    if (invert === true)
    {
        angle += Math.PI;
    }

    var vector, newx, newy, count = 0;

    var speedFactor = function(distance)
    {
        return distance * (_this.speed / 100 + 0.5)
    }

    // try move towards until no overlap
    do {
        if (count > 0) angle += 60;

        vector = ot.getDxDyAlongAngle(angle);
        newx = this.x + speedFactor(vector[0]);
        newy = this.y + speedFactor(vector[1]);

        count++;
    } while (count < 7 && (orbLife.CheckPlaceOccupied(newx, newy, this.id) || ot.isPointOutOfBounds(newx, newy)))

    if (newx && newy && count < 7) {

        this.x = newx;
        this.y = newy;
    }
}

Orb.prototype.GetOrbCount = function (distance) {
    var _this = this;
    
    var orbList = this.GetOrbDistanceList(null, null)
        .filter(function (distanceObj) {
            return distanceObj.orb.id != _this.id && distanceObj.distance < distance;
        })
        .map(function (distanceObj) {
            return distanceObj.orb;
        });
        
    var total = orbList.length;
    var friendCount = orbList.filter(function (orb) {
       return ot.sameDnaCheck(orb, _this);
    }).length;
    
    return {
        friends: friendCount,
        enemies: total - friendCount
    }
}

Orb.prototype.GetOrbDistanceList = function(filter, sort)
{
    var _this = this;
    var orbs = orbLife.Orbs;

    if (filter) {
        orbs = orbs.filter(filter);
    }

    var list = orbs.map(function(orb) {
        return {
            orb: orb,
            distance: ot.getOrbDistance(_this, orb)
        }
    });

    if (sort == "ascending") {
        return list.sort(function(a, b) {
            return b.distance - a.distance;
        });
    }
    if (sort == "descending")
    {
        return list.sort(function (a, b) {
            return a.distance - b.distance;
        });
    }

    return list;
}

Orb.prototype.GetDNAColour = function (DNAId) {
	var red = Math.floor(DNAId / 1000 * 255) % 70 + 20;
	var green = Math.floor(DNAId / 1000 * 200) % 180 + 70;
	var blue = Math.floor(DNAId / 1000 * 100) + 20;
	
	return "rgb(" + red + "," + green + "," + blue + ")";
}