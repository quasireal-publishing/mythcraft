import ArmorModel from "./armor.mjs";
import BackgroundModel from "./background.mjs";
import FeatureModel from "./feature.mjs";
import GearModel from "./gear.mjs";
import LineageModel from "./lineage.mjs";
import ProfessionModel from "./profession.mjs";
import SpellModel from "./spell.mjs";
import TalentModel from "./talent.mjs";
import WeaponModel from "./weapon.mjs";

export * as models from "./models/_module.mjs";
export { default as BaseItemModel } from "./base-item.mjs";
export { default as EquipmentModel } from "./equipment.mjs";
export { ArmorModel, BackgroundModel, FeatureModel, GearModel, LineageModel, ProfessionModel, SpellModel, TalentModel, WeaponModel };

export const config = {
  armor: ArmorModel,
  background: BackgroundModel,
  feature: FeatureModel,
  gear: GearModel,
  lineage: LineageModel,
  profession: ProfessionModel,
  spell: SpellModel,
  talent: TalentModel,
  weapon: WeaponModel,
};
