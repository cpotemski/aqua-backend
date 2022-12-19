import {Ship, ShipName, ShipType} from "../resolvers-types";

export const SHIP_DATA: Ship[] = [
    {
        name: ShipName.Piranha,
        type: ShipType.FirstStrike,
        costs: {
            aluminium: 1250,
        },
        speed: 5,
        travelCosts: 3,
        health: 3,
        cannons: 1,
        firePower: 2,
        buildTime: 4
    },
    {
        name: ShipName.Jellyfish,
        type: ShipType.Emp,
        costs: {
            steel: 1250,
        },
        speed: 5,
        travelCosts: 2,
        health: 5,
        cannons: 1,
        firePower: 0,
        buildTime: 4
    },
    {
        name: ShipName.Shark,
        type: ShipType.Normal,
        costs: {
            aluminium: 2000,
            steel: 1000,
        },
        speed: 5,
        travelCosts: 3,
        health: 10,
        cannons: 2,
        firePower: 7,
        buildTime: 8
    },
    {
        name: ShipName.HackBoat,
        type: ShipType.Normal,
        costs: {
            aluminium: 2000,
            steel: 750,
        },
        speed: 5,
        travelCosts: 3,
        health: 15,
        cannons: 0,
        firePower: 0,
        buildTime: 12
    },
    {
        name: ShipName.Taifun,
        type: ShipType.Normal,
        costs: {
            aluminium: 6750,
            steel: 2000,
        },
        speed: 5,
        travelCosts: 3,
        health: 40,
        cannons: 6,
        firePower: 4,
        buildTime: 9
    },
    {
        name: ShipName.Blizzard,
        type: ShipType.Emp,
        costs: {
            aluminium: 2000,
            steel: 8000,
        },
        speed: 5,
        travelCosts: 3,
        health: 30,
        cannons: 3,
        firePower: 0,
        buildTime: 12
    },
    {
        name: ShipName.Hurricane,
        type: ShipType.FirstStrike,
        costs: {
            aluminium: 10000,
            steel: 3000,
        },
        speed: 5,
        travelCosts: 3,
        health: 50,
        cannons: 4,
        firePower: 6,
        buildTime: 12
    },
    {
        name: ShipName.Tsunami,
        type: ShipType.Normal,
        costs: {
            aluminium: 12000,
            steel: 4000,
        },
        speed: 5,
        travelCosts: 3,
        health: 150,
        cannons: 3,
        firePower: 25,
        buildTime: 16
    },
    {
        name: ShipName.Enterprise,
        type: ShipType.Normal,
        costs: {
            aluminium: 24000,
            steel: 6000,
        },
        speed: 5,
        travelCosts: 3,
        health: 250,
        cannons: 8,
        firePower: 15,
        buildTime: 20
    },
    {
        name: ShipName.Bermuda,
        type: ShipType.Emp,
        costs: {
            aluminium: 14000,
            steel: 12000,
        },
        speed: 5,
        travelCosts: 3,
        health: 250,
        cannons: 5,
        firePower: 0,
        buildTime: 4
    },
    {
        name: ShipName.KittyHawk,
        type: ShipType.FirstStrike,
        costs: {
            aluminium: 36000,
            steel: 9000,
        },
        speed: 5,
        travelCosts: 3,
        health: 300,
        cannons: 5,
        firePower: 20,
        buildTime: 20
    },
    {
        name: ShipName.Atlantis,
        type: ShipType.Normal,
        costs: {
            aluminium: 70000,
            steel: 16000,
        },
        speed: 5,
        travelCosts: 3,
        health: 500,
        cannons: 100,
        firePower: 5,
        buildTime: 24
    },
];