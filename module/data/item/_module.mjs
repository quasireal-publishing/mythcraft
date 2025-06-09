// We need to use EquipmentModel & FeatureModel in this file, so import at the top
import EquipmentModel from "./equipment.mjs";
import FeatureModel from "./feature.mjs";

// Transform the default export into a normal export
export { default as BaseItemModel } from "./base-item.mjs";
export { EquipmentModel, FeatureModel };

// This object gets used in the index.mjs file to register the data models
export const config = {
  equipment: EquipmentModel,
  feature: FeatureModel,
};
