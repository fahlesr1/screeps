var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleTower = require('role.towers');
var roleMaintainer = require('role.maintainer');

var numHarvesters = 4;
var numBuilders = 4;
var numUpgraders = 3;
var numMiners = 2;
var numMaint = 0;

var harvesterBody   = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
var builderBody     = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
var upgraderBody    = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
var minerBody       = [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK];




module.exports.loop = function () {

    // clean up dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // spawn new creeps
    if(Game.spawns['PlatypusBase'].room.energyAvailable > 700) {
        
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(builders.length < numBuilders) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['PlatypusBase'].spawnCreep(builderBody, newName, {memory: {role: 'builder'}});
        }
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length < numUpgraders) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['PlatypusBase'].spawnCreep(upgraderBody, newName, {memory: {role: 'upgrader'}});
        }
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < numHarvesters) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['PlatypusBase'].spawnCreep(harvesterBody, newName, {memory: {role: 'harvester'}});
    }
    
    var miner0 = Game.creeps["Miner0"];
    var miner1 = Game.creeps["Miner1"];
    var newName = 'Miner'
    if(!miner0) {
        newName = 'Miner0';
        Game.spawns['PlatypusBase'].spawnCreep(minerBody, newName, 
        {memory: {role: 'miner', source: 0}});
        Game.creeps[Game.spawns['PlatypusBase'].memory.source0] = newName;
        console.log('Spawning new Miner: ' + newName);
    } 
    if(!miner1) {
        newName = 'Miner1';
        Game.spawns['PlatypusBase'].spawnCreep(minerBody, newName, 
        {memory: {role: 'miner', source: 1}});
        console.log('Spawning new Miner: ' + newName);
    }
    
    if(Game.spawns['PlatypusBase'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['PlatypusBase'].spawning.name];
        Game.spawns['PlatypusBase'].room.visual.text('platycreep' + spawningCreep.memory.role,
           Game.spawns['PlatypusBase'].pos.x + 1, 
            Game.spawns['PlatypusBase'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    // run existing creeps
    for(var name in Memory.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        } else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if(creep.memory.role == 'maintainer') {
            roleMaintainer.run(creep);
        }
    }
    
    //run towers
    roleTower.play();
    
    var importantStuff = _.filter(Game.spawns['PlatypusBase'].room.find(FIND_STRUCTURES), (s) => s.structureType == (STRUCTURE_SPAWN || STRUCTURE_TOWER) && s.hits < (s.hitsMax * .5));
    
    if (importantStuff.length > 0 && !Game.spawns['PlatypusBase'].room.safeMode.isActive) {
        Game.spawns['PlatypusBase'].room.controller.activateSafeMode;
        Game.notify('PlatypusBase activated SafeMode at %s', Game.time);
    }
}


