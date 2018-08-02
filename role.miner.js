/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */
 
 var roleMiner = {
	 
	 run: function(creep) {
	     
	     var source = creep.memory.source;
	     
		 var targets = creep.room.find(FIND_STRUCTURES, { 
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
			}
		 });
		 
		 if(targets.length > 0) {
		     
		         if(creep.pos.getRangeTo(targets[source]) == 0) {
    				 var source = creep.pos.findClosestByPath(FIND_SOURCES);
    				 creep.harvest(source);
    			 } else {
    				 creep.moveTo(targets[source]);
    			 }
	        }
	 }
 };

module.exports = roleMiner;