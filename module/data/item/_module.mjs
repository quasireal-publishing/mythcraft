import ArmorModel from "./armor.mjs";
import FeatureModel from "./feature.mjs";
import GearModel from "./gear.mjs";
import WeaponModel from "./weapon.mjs";

// Transform the default export into a normal export
export { default as BaseItemModel } from "./base-item.mjs";
export { default as EquipmentModel } from "./equipment.mjs";
export { ArmorModel, FeatureModel, GearModel, WeaponModel };

// This object gets used in the index.mjs file to register the data models
export const config = {
  armor: ArmorModel,
  gear: GearModel,
  feature: FeatureModel,
  weapon: WeaponModel,
};
