// We need to use CharacterModel & NpcModel in this file, so import at the top
import CharacterModel from "./character.mjs";
import NpcModel from "./npc.mjs";

// Transform the default export into a normal export
export { default as BaseActorModel } from "./base-actor.mjs";
export { CharacterModel, NpcModel };

// This object gets used in the index.mjs file to register the data models
export const config = {
  character: CharacterModel,
  npc: NpcModel,
};
