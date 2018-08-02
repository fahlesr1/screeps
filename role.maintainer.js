 var roleMaintainer = {
     
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('repair');
	    }

	    if(creep.memory.building) {
            var priority = 1; 
            var targets = []; 
            while (targets.length == 0 && priority <= 6) { 
                var targets = this.getRepairTargets(creep, priority); 
                if (targets.length > 0)  {
                    if(creep.repair(creep.pos.findClosestByRange(targets)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.pos.findClosestByRange(targets));
                    } 
                } else {
                    priority++;
                }
            } 
	    }
	    else {
	       var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 200);
                }
            });
            var source = creep.pos.findClosestByPath(containers);
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	},
	getRepairTargets: function(creep, priority) { 
        switch (priority) { 
            
            case 1: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 3000);
            case 2: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_WALL && s.hits < 3000);
            case 3: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 500000);
            case 4:
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_WALL && s.hits < 1000000);
            case 5: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 3000000); 
            case 6:
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_WALL && s.hits < 30000000);
            default: 
                return null; 
        } 
    }
 };

module.exports = roleMaintainer;