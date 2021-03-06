var Orb = function (DNA) {
	
    var dna = $.extend({}, DNA);
    
	this.id = orbLife.GetOrbIndex();
	
	this.speed = dna.speed;
	this.strength = dna.strength;
	this.courage = dna.courage;
	this.independence = dna.independence;
	this.fertility = dna.fertility;

    this.hunger = Math.floor(Math.random() * ot.constants.HUNGER_THRESHOLD * 2 /5);

    this.seed = dna;
	this.dna = dna.dna;
	
    this.age = 0;
	this.health = 100;
	
	this.x = null;
	this.y = null;
}

Orb.prototype.Think = function () {

    var feeling = this.AnalyzeSurroundings();
    
    this.FuckOrFight();
    
    if (feeling == "alone") {
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
    this.IncreaseHunger();
}

Orb.prototype.Age = function (delta) {
    
    delta = delta > 0 ? delta : 1;
    
    this.age += delta;
    
    if (this.age > ot.constants.LIFESPAN) {
        this.Kill();
    }  
};

Orb.prototype.FuckOrFight = function () {
    
    var orbCount = this.GetOrbCount(ot.constants.RADIUS * 2 + 3);
    
    if (orbCount.friends == 0 && orbCount.enemies > 0) {
        this.DecreaseHealth(0.2 * orbCount.enemies);
    } else if (orbCount.enemies == 0 && orbCount.friends > 0) {
        if (Math.random() * (ot.statAsPercentage(this.fertility) + 0.5) < ot.constants.FERTILITY) {
            
            this.DecreaseHealth(50);
            
            var closestFriend = this.GetClosestFriend();
            
            orbLife.SpawnOrb(this.seed, closestFriend.seed, {
                x: this.x,
                y: this.y
            })
        }
    }
}

Orb.prototype.IncreaseHunger = function(delta)
{
    var delta = delta > 0 ? delta : 1;

    if (this.hunger < ot.constants.HUNGER_THRESHOLD) {
        this.hunger += delta;
    } else {
        this.Kill();
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

Orb.prototype.Kill = function ()
{
    var _this = this;

    orbLife.DeleteOrb(this.id);

    var murderers = this.GetOrbDistanceList(function(orb) {
            return !ot.sameDnaCheck(orb, _this);
        }, "ascending");

    for (var i = 0; i < murderers.length; i++) {
        var murderer = murderers[i];

        if (murderer.distance < ot.constants.RADIUS * 2 + 3) {
            murderer.orb.hunger -= ot.constants.HUNGER_THRESHOLD / 10;
        } else {
            continue;
        }
    }

    console.log("BEEP BOOP :: ORB DEAD")
}

Orb.prototype.AnalyzeSurroundings = function()
{
    var _this = this;
    
    var orbCount = this.GetOrbCount(ot.constants.SENSITIVITY);
    var orbCountMap = this.GetOrbCount(500 * (0.5 + ot.statAsPercentage(this.independence)));
    
    if (this.hunger > ot.constants.HUNGER_THRESHOLD * 0.6 || (this.hunger > ot.constants.HUNGER_THRESHOLD * 0.8 && orbCount.friends > 6 - Math.floor(this.courage / 100)))
    {
        return "brave";
    }

    if (orbCountMap.friends == 1) {
        return "alone";
    }
    
    if (this.courage > 300 && orbCount.friends > 12 - Math.floor(this.courage / 100)) {
        return "brave";
    }
    
    if (orbCount.friends == 0 && orbCount.enemies == 0 && this.independence < 900) {
        return "alone";
    }
    
    if (orbCount.friends > orbCount.enemies && this.courage > 100) {
        return "brave";
    }
    
    if (orbCount.friends == 0 && orbCount.enemies == 1 && this.courage > 300) {
        return "brave";
    }
    
    if (orbCount.enemies != 1 && orbCount.enemies > orbCount.friends && this.courage < 900) {
        return "scared";
    }

    if (this.courage > this.independence) {
        return "brave";
    } else {
        return "neutral";
    }
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

    if (type == "friend") {
        filter = function (orb) {
            return _this.id != orb.id && Math.abs(orb.dna - _this.dna) < 50;
        }
    } else if (type == "enemy") {
        filter = filter = function (orb) {
            return _this.id != orb.id && Math.abs(orb.dna - _this.dna) > 50;
        }
    }

    var distanceToOrbs = this.GetOrbDistanceList(filter);

    distanceToOrbs = distanceToOrbs.sort(function (a, b) {
        return a.distance - b.distance;
    });

    if (!distanceToOrbs[0] || (type == "friend" && distanceToOrbs[0].distance < distanceToOrbs[0].orb.independence / 20)) return;

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
        return distance * (ot.statAsPercentage(_this.speed) + 0.5)
    }

    // try move towards until no overlap
    do {
        if (count > 0) angle += 60 * (count % 2 == 1 ? 1 : -1) * count;

        vector = ot.getDxDyAlongAngle(angle);
        newx = this.x + speedFactor(vector[0]);
        newy = this.y + speedFactor(vector[1]);

        count++;
    } while (count < 7 && (ot.isPointOutOfBounds(newx, newy) || orbLife.CheckPlaceOccupied(newx, newy, this.id)))

    if (newx && newy && count < 7) {

        this.x = newx;
        this.y = newy;
        
        this.Age(ot.statAsPercentage(this.speed) + 0.5);
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
        enemies: total - friendCount,
        total: total
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
            return a.distance - b.distance;
        });
    }
    if (sort == "descending")
    {
        return list.sort(function (a, b) {
            return b.distance - a.distance;
        });
    }

    return list;
}

Orb.prototype.GetClosestFriend = function () {
    var _this = this;
    
    var distanceList = this.GetOrbDistanceList(function (orb) {
       return ot.sameDnaCheck(orb, _this);
    }, "ascending");
    
    return distanceList[0] ? distanceList[0].orb : null;
}

Orb.prototype.GetDNAColour = function ()
{
    var hunger = Math.floor(255 - (this.hunger / ot.constants.HUNGER_THRESHOLD) * 255);
    
    return {
        fill: "hsl(" + Math.floor(this.dna / 1000 * 360) + ",100%,50%)",
        stroke: "rgb(" + hunger + "," + hunger + "," + hunger + ")"
    }
}