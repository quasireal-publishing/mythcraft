/**
 * Roll or post a feature card to chat. Shared by the NPC and siege actor sheets.
 *
 * When the feature has an attack, evaluates a `1d20 + bonus` {@link AttackRoll}
 * (threading `critFail` so siege features crit-fail on 1–2 while NPC features
 * crit-fail on 1). Otherwise posts a plain feature card with any save/damage info.
 *
 * @param {Actor} actor        The owning actor.
 * @param {Item} item          The `feature` item being rolled.
 * @param {number} critFail    D20 value at/under which the attack is a critical fail.
 */
export default async function rollFeature(actor, item, critFail) {
  if (!item || (item.type !== "feature")) return;

  const sys = item.system;
  const speaker = ChatMessage.getSpeaker({ actor });
  const template = "systems/mythcraft/templates/chat/attack-card.hbs";

  if (sys.hasAttack) {
    const bonus = mythcraft.utils.evaluateFormula(sys.attackBonus || "0", item.getRollData());
    const roll = new mythcraft.rolls.AttackRoll(`1d20 + ${bonus}`, actor.getRollData(), {
      weaponName: item.name,
      defenseTarget: sys.defenseTarget,
      critHit: 20,
      critFail,
      damage: sys.damage,
      hasSave: sys.hasSave,
      saveDC: sys.evaluatedSaveDC,
      saveAttribute: sys.hasSave ? sys.saveAttribute : null,
    });
    await roll.toMessage({ speaker });
    return;
  }

  const saveAttribute = sys.hasSave && sys.saveAttribute
    ? game.i18n.localize(`MYTHCRAFT.Attributes.${sys.saveAttribute}.abbr`)
    : "";
  const content = await renderTemplate(template, {
    weaponName: item.name,
    hasSave: sys.hasSave,
    saveDC: sys.evaluatedSaveDC,
    saveAttribute,
    damage: sys.damage,
    rollHTML: null,
  });
  await ChatMessage.create({ content, speaker });
}
