var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < 50) {
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
        else {
            var priority = 1; 
            var targets = []; 
            while (targets.length == 0 && priority <= 5) {
                targets = this.getEnergyTargets(creep, priority);
                if(targets.length > 0) {
                    var target = creep.pos.findClosestByPath(targets);
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    } 
                } else { 
                    priority++;
                }
            }
        }
    },
	getEnergyTargets: function(creep, priority) { 
        switch (priority) { 
            case 1: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity)); 
            case 2: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity));
            case 3: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity - 200)); 
            case 4: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity));
            case 5: 
                return _.filter(creep.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity));
            default:
                return null; 
        }
	}
};

module.exports = roleHarvester;