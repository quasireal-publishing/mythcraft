import CharacterModel from "./character.mjs";
import NpcModel from "./npc.mjs";
import SiegeWeaponData from "./siege-weapon.mjs";

export { default as BaseActorModel } from "./base-actor.mjs";
export { CharacterModel, NpcModel, SiegeWeaponData };

export const config = {
  character: CharacterModel,
  npc: NpcModel,
  siege: SiegeWeaponData,
};
