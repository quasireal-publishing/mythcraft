/**
 * Condition input — a thin wrapper around `<tag-input>` that translates chip
 * additions/removals into Foundry action calls (`addCondition`/`removeCondition`)
 * on the parent ApplicationV2 sheet.
 *
 * Reads from:
 *   `data-conditions`  JSON [{id, label, img, effectId, value?}] — currently active
 *   `data-suggestions` JSON [{value, label, img}]               — selectable options
 *
 * Why wrap instead of reimplement: tag-input already handles focus retention
 * across re-renders, paste with separators, contenteditable chip layout, and
 * dropdown filtering. We only need to bridge its `change` event into the
 * conditions actions; everything else comes for free.
 */
export default class ConditionInputElement extends HTMLElement {
  /** Map<conditionId, effectId> — needed to remove the right AE when a chip is removed. */
  #effectIds = new Map();
  /** Last known set of chip values — for diffing on change events. */
  #lastChipValues = new Set();
  #tagInput = null;

  connectedCallback() {
    let conditions = [];
    let suggestions = [];
    try { conditions = JSON.parse(this.dataset.conditions ?? "[]"); } catch { conditions = []; }
    try { suggestions = JSON.parse(this.dataset.suggestions ?? "[]"); } catch { suggestions = []; }

    // Preserve a sheet-stable name for tag-input's pendingFocus map so focus
    // survives the post-action re-render. The actor-sheet strips this key in
    // _processFormData so it never reaches the actor.update payload.
    const sheetId = this.closest(".application")?.id ?? "default";
    const tagName = `_conditions-${sheetId}`;

    this.#effectIds = new Map(conditions.map(c => [c.id, c.effectId]));
    this.#lastChipValues = new Set(conditions.map(c => c.id));

    this.innerHTML = "";

    const tagInput = document.createElement("tag-input");
    tagInput.setAttribute("name", tagName);
    tagInput.dataset.suggestions = JSON.stringify(suggestions);
    for (const cond of conditions) {
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = tagName;
      hidden.value = cond.id;
      tagInput.appendChild(hidden);
    }

    tagInput.addEventListener("change", () => this.#onTagChange());

    this.appendChild(tagInput);
    this.#tagInput = tagInput;
  }

  /**
   * Diff the tag-input's current chip values against our last snapshot.
   * Fire addCondition for new entries, removeCondition for missing ones.
   */
  #onTagChange() {
    const currentValues = new Set(
      [...this.#tagInput.querySelectorAll("input[type=hidden]")].map(i => i.value).filter(Boolean),
    );

    const added = [...currentValues].filter(v => !this.#lastChipValues.has(v));
    const removed = [...this.#lastChipValues].filter(v => !currentValues.has(v));

    // Validate added against suggestions; resolve partial typed text to full
    // condition IDs (e.g. "fatig" → "fatigued") via prefix match on value or
    // label. Also handles parameterized syntax like "bleeding 1d6".
    let suggestions = [];
    try { suggestions = JSON.parse(this.dataset.suggestions ?? "[]"); } catch { suggestions = []; }
    const validIds = new Set(suggestions.map(s => s.value));

    for (const typed of added) {
      const resolved = validIds.has(typed) ? { id: typed } : this.#resolvePartial(typed, suggestions);
      if (!resolved) continue;
      const data = { conditionId: resolved.id };
      if (resolved.value) data.conditionValue = resolved.value;
      this.#fireAction("addCondition", data);
    }

    for (const value of removed) {
      const effectId = this.#effectIds.get(value);
      if (effectId) this.#fireAction("removeCondition", { effectId });
    }

    // Update snapshot — when the sheet re-renders we'll be replaced with a
    // fresh element anyway, but this keeps diffs clean if the sheet defers.
    this.#lastChipValues = currentValues;
  }

  /**
   * Resolve a typed string to a condition id and optional parameterized value.
   * Tries: exact match → unique prefix match → "head trailing" split where the
   * head matches a condition (e.g. "bleeding 1d6" → {id: "bleeding", value: "1d6"}).
   * Returns null if nothing matches.
   * @param {string} typed
   * @param {Array<{value: string, label: string}>} suggestions
   * @returns {{id: string, value?: string} | null}
   */
  #resolvePartial(typed, suggestions) {
    if (!typed) return null;
    const lower = typed.toLowerCase();

    const exact = suggestions.find(
      s => (s.value.toLowerCase() === lower) || (s.label.toLowerCase() === lower),
    );
    if (exact) return { id: exact.value };

    const prefix = suggestions.filter(
      s => s.value.toLowerCase().startsWith(lower) || s.label.toLowerCase().startsWith(lower),
    );
    if (prefix.length === 1) return { id: prefix[0].value };

    // "bleeding 1d6" → split head + trailing; if head matches a condition, the
    // trailing string becomes the parameterized value (flags.mythcraft.value).
    const tokens = typed.split(/\s+/);
    if (tokens.length >= 2) {
      const head = tokens[0].toLowerCase();
      const trailing = tokens.slice(1).join(" ");
      const headMatch = suggestions.find(
        s => (s.value.toLowerCase() === head) || (s.label.toLowerCase() === head),
      );
      if (headMatch) return { id: headMatch.value, value: trailing };
    }

    return null;
  }

  /**
   * Click a temp button inside `this` so the parent ApplicationV2's
   * action delegation picks it up.
   * @param {string} action
   * @param {Record<string, string>} dataset
   */
  #fireAction(action, dataset) {
    const proxy = document.createElement("button");
    proxy.type = "button";
    proxy.style.display = "none";
    proxy.dataset.action = action;
    for (const [k, v] of Object.entries(dataset)) proxy.dataset[k] = v;
    this.appendChild(proxy);
    proxy.click();
    proxy.remove();
  }
}
