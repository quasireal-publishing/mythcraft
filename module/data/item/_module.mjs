import ArmorModel from "./armor.mjs";
import BackgroundModel from "./background.mjs";
import FeatureModel from "./feature.mjs";
import GearModel from "./gear.mjs";
import LineageModel from "./lineage.mjs";
import ProfessionModel from "./profession.mjs";
import TalentModel from "./talent.mjs";
import WeaponModel from "./weapon.mjs";

// Transform the default export into a normal export
export * as models from "./models/_module.mjs";
export { default as BaseItemModel } from "./base-item.mjs";
export { default as EquipmentModel } from "./equipment.mjs";
export { ArmorModel, BackgroundModel, FeatureModel, GearModel, LineageModel, ProfessionModel, TalentModel, WeaponModel };

// This object gets used in the index.mjs file to register the data models
export const config = {
  armor: ArmorModel,
  background: BackgroundModel,
  feature: FeatureModel,
  gear: GearModel,
  lineage: LineageModel,
  profession: ProfessionModel,
  talent: TalentModel,
  weapon: WeaponModel,
};
