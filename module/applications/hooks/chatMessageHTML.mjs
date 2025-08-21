/**
 * A hook event that fires for each ChatMessage which is rendered for addition to the ChatLog.
 * This hook allows for final customization of the message HTML before it is added to the log.
 * @param {foundry.Documents.ChatMessage} message The ChatMessage document being rendered.
 * @param {HTMLLIElement} html The pending HTML.
 * @param {Record<string, any>} context
 */
export async function renderChatMessageHTML(message, html, context) {
  if (message.system.alterMessageHTML instanceof Function) {
    await message.system.alterMessageHTML(html);
  }
  if (message.system.addListeners instanceof Function) {
    await message.system.addListeners(html);
  }
}
