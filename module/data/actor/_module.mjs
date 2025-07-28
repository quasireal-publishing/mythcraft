import CharacterModel from "./character.mjs";
import NpcModel from "./npc.mjs";

export { default as BaseActorModel } from "./base-actor.mjs";
export { CharacterModel, NpcModel };

export const config = {
  character: CharacterModel,
  npc: NpcModel,
};
