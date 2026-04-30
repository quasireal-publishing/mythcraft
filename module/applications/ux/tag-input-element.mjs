/**
 * A chip-based tag input backed by a contenteditable div.
 *
 * Chips render as `contenteditable="false"` inline spans inside the editable
 * field. The browser owns cursor positioning — left/right arrows and click
 * placement work exactly as they do in normal text, with chips treated as
 * single opaque characters. We intercept Enter/Backspace/Delete only when the
 * cursor is adjacent to a chip boundary.
 *
 * Hidden inputs (one per chip, same name) provide SetField-compatible
 * form serialization for Foundry's FormDataExtended.
 */
export default class TagInputElement extends HTMLElement {
  #chips = [];
  #suggestions = [];
  #field = null;
  #dropdown = null;
  #onOutsideClick = null;

  /**
   * Map<name, target> for tag-inputs that need focus reclaimed after the
   * parent submitOnChange form re-renders. `target` is "end" or a chip index;
   * a numeric index places the caret in the text node immediately before that
   * chip (so removing chip i leaves the caret right where it was).
   */
  static #pendingFocus = new Map();

  connectedCallback() {
    const existing = this.querySelectorAll("input[type=hidden]");
    this.#chips = Array.from(existing).map(i => i.value).filter(Boolean);

    try {
      this.#suggestions = JSON.parse(this.dataset.suggestions ?? "[]").map(s => ({
        value: s.value,
        label: globalThis.game?.i18n?.localize(s.label) ?? s.label,
      }));
    } catch {
      this.#suggestions = [];
    }

    this.#buildDOM();

    this.#onOutsideClick = (e) => {
      if (!this.contains(e.target)) this.#dropdown.hidden = true;
    };
    document.addEventListener("click", this.#onOutsideClick);

    const name = this.getAttribute("name");
    if (name && TagInputElement.#pendingFocus.has(name)) {
      const target = TagInputElement.#pendingFocus.get(name);
      TagInputElement.#pendingFocus.delete(name);
      requestAnimationFrame(() => this.#focusAt(target));
    }
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.#onOutsideClick);
  }

  // -------------------------------------------------- //

  #buildDOM() {
    this.innerHTML = "";

    const container = document.createElement("div");
    container.className = "tag-input-container";

    this.#field = document.createElement("div");
    this.#field.className = "tag-input-field";
    this.#field.contentEditable = "true";
    this.#field.setAttribute("role", "textbox");
    this.#field.setAttribute("spellcheck", "false");
    this.#field.dataset.placeholder = "Add tag…";

    // Seed initial chips, each followed by an empty text node so the cursor
    // has somewhere to land between chips.
    for (const value of this.#chips) {
      this.#field.append(this.#createChipEl(value), document.createTextNode(""));
    }
    if (!this.#field.childNodes.length) {
      this.#field.append(document.createTextNode(""));
    }

    this.#dropdown = document.createElement("ul");
    this.#dropdown.className = "tag-dropdown";
    this.#dropdown.hidden = true;

    container.append(this.#field, this.#dropdown);
    this.append(container);

    this.#rebuildHiddenInputs();
    this.#updatePlaceholder();
    this.#attachListeners();
  }

  #createChipEl(value) {
    const label = this.#suggestions.find(s => s.value === value)?.label ?? value;

    const chip = document.createElement("span");
    chip.className = "tag-chip";
    chip.contentEditable = "false";
    chip.dataset.value = value;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "tag-chip-remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.#removeChip(chip);
    });

    chip.append(document.createTextNode(label), removeBtn);
    return chip;
  }

  // -------------------------------------------------- //

  #rebuildHiddenInputs() {
    for (const el of this.querySelectorAll("input[type=hidden]")) el.remove();
    const name = this.getAttribute("name") ?? "";
    for (const value of this.#chips) {
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = name;
      hidden.value = value;
      this.append(hidden);
    }
  }

  /** Sync #chips from the live DOM order (chips may be reordered by the browser). */
  #syncChips() {
    this.#chips = Array.from(this.#field.querySelectorAll(".tag-chip")).map(el => el.dataset.value);
    this.#rebuildHiddenInputs();
    this.#updatePlaceholder();
  }

  #updatePlaceholder() {
    const hasChips = this.#field.querySelector(".tag-chip");
    const hasText = this.#getFieldText().length > 0;
    this.#field.classList.toggle("is-empty", !hasChips && !hasText);
  }

  // -------------------------------------------------- //

  /**
   * Return only the text content of the text node at the cursor — the
   * "currently typed" text used for dropdown filtering and chip submission.
   */
  #getTypedText() {
    const sel = document.getSelection();
    if (!sel?.rangeCount) return "";
    const node = sel.getRangeAt(0).startContainer;
    return node.nodeType === Node.TEXT_NODE ? node.textContent : "";
  }

  /** Total plain text across all text nodes (used for placeholder logic). */
  #getFieldText() {
    return Array.from(this.#field.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent)
      .join("");
  }

  // -------------------------------------------------- //

  #addChip(value, { keepFocus = true } = {}) {
    const trimmed = value.trim();
    if (!trimmed || this.#chips.includes(trimmed)) return;

    const sel = document.getSelection();
    const range = sel?.rangeCount && this.#field.contains(sel.anchorNode) ? sel.getRangeAt(0) : null;

    // Clear the typed text in whatever text node held the query.
    if (range?.startContainer?.nodeType === Node.TEXT_NODE) {
      range.startContainer.textContent = "";
    } else {
      // No usable cursor (e.g. blur path) — clear any typed text across the field.
      for (const n of this.#field.childNodes) {
        if (n.nodeType === Node.TEXT_NODE) n.textContent = "";
      }
    }

    const chipEl = this.#createChipEl(trimmed);

    if (range) {
      // Insert chip at cursor, with an empty text node after it for landing.
      const after = document.createTextNode("");
      range.insertNode(after);
      range.insertNode(chipEl);

      // Move cursor into the text node after the chip.
      const newRange = document.createRange();
      newRange.setStart(after, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      this.#field.append(chipEl, document.createTextNode(""));
    }

    this.#mergeAdjacentTextNodes();
    this.#syncChips();
    this.#dropdown.hidden = true;

    if (keepFocus) {
      const name = this.getAttribute("name");
      if (name) TagInputElement.#pendingFocus.set(name, "end");
    }
    this.dispatchEvent(new Event("change", { bubbles: true }));
    if (keepFocus) requestAnimationFrame(() => this.#focusAt("end"));
  }

  /**
   * Focus the field and place the caret at `target`.
   * @param {"end"|number} target  "end" → caret at end. Number → caret in the
   *   text node immediately before chip[target] (or at end if no such chip).
   */
  #focusAt(target) {
    if (!this.#field?.isConnected) return;
    this.#field.focus();
    const sel = document.getSelection();
    if (!sel) return;

    const range = document.createRange();
    const chips = this.#field.querySelectorAll(".tag-chip");
    const chip = typeof target === "number" ? chips[target] : null;

    if (chip) {
      let node = chip.previousSibling;
      if (!node || (node.nodeType !== Node.TEXT_NODE)) {
        node = document.createTextNode("");
        chip.before(node);
      }
      range.setStart(node, node.textContent.length);
      range.collapse(true);
    } else {
      range.selectNodeContents(this.#field);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);
  }

  #removeChip(chipEl) {
    // Index of the chip being removed — caret returns to this slot (i.e. just
    // before whatever chip slides into it) after the parent re-renders.
    const removedIndex = Array.from(this.#field.querySelectorAll(".tag-chip")).indexOf(chipEl);

    // Leave a text node in place so the cursor has somewhere to land.
    if (!chipEl.previousSibling || (chipEl.previousSibling.nodeType !== Node.TEXT_NODE)) {
      chipEl.before(document.createTextNode(""));
    }
    chipEl.remove();
    // Remove duplicate adjacent empty text nodes.
    this.#mergeAdjacentTextNodes();
    this.#syncChips();

    const name = this.getAttribute("name");
    if (name) TagInputElement.#pendingFocus.set(name, removedIndex);
    this.dispatchEvent(new Event("change", { bubbles: true }));
    requestAnimationFrame(() => this.#focusAt(removedIndex));
  }

  /** Collapse consecutive text nodes to keep the DOM clean. */
  #mergeAdjacentTextNodes() {
    this.#field.normalize();
  }

  // -------------------------------------------------- //

  #attachListeners() {
    this.#field.addEventListener("focus", () => this.#showDropdown());

    this.#field.addEventListener("input", () => {
      this.#cleanDOM();
      this.#updatePlaceholder();
      this.#showDropdown();
    });

    this.#field.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter": {
          e.preventDefault();
          const highlighted = this.#dropdown.querySelector(".tag-dropdown-item.highlighted");
          const text = this.#getTypedText();
          if (highlighted) this.#addChip(highlighted.dataset.value);
          else if (text.trim()) this.#addChip(text);
          break;
        }
        case "Tab": {
          // Autocomplete a highlighted dropdown item without losing focus, but
          // for plain typed text let the browser tab away — the blur handler
          // will commit it.
          const highlighted = this.#dropdown.querySelector(".tag-dropdown-item.highlighted");
          if (highlighted) {
            e.preventDefault();
            this.#addChip(highlighted.dataset.value);
          }
          break;
        }
        case "Backspace":
          this.#handleBackspace(e);
          break;
        case "Delete":
          this.#handleDelete(e);
          break;
        case "ArrowDown":
          e.preventDefault();
          this.#moveHighlight(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          this.#moveHighlight(-1);
          break;
        case "Escape":
          this.#dropdown.hidden = true;
          break;
      }
    });

    // Strip rich formatting on paste. If the pasted text contains a separator
    // (comma, semicolon, newline, tab), split it and commit each piece as its
    // own chip — supports copy/pasting tag lines from MythCraft rules
    // (e.g. "Iron Will, Steel Mind, Regen 2").
    this.#field.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") ?? "";
      if (!text) return;

      const parts = text.split(/[,;\n\r\t]+/).map(s => s.trim()).filter(Boolean);

      if (/[,;\n\r\t]/.test(text)) {
        for (const part of parts) this.#addChip(part);
        return;
      }

      document.execCommand("insertText", false, text);
    });

    // Commit any pending typed text when the user tabs/clicks away.
    this.#field.addEventListener("blur", () => {
      this.#dropdown.hidden = true;
      const text = this.#getFieldText().trim();
      if (text) this.#addChip(text, { keepFocus: false });
    });
  }

  /**
   * If the cursor is at offset 0 of a text node immediately after a chip,
   * remove that chip instead of letting the browser do its two-step
   * select-then-delete behavior.
   */
  #handleBackspace(e) {
    const sel = document.getSelection();
    if (!sel?.rangeCount || !sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const { startContainer, startOffset } = range;

    let prev = null;
    if ((startContainer.nodeType === Node.TEXT_NODE) && (startOffset === 0)) {
      prev = startContainer.previousSibling;
    } else if ((startContainer === this.#field) && (startOffset > 0)) {
      // Cursor is directly in the field element (between block-level nodes).
      prev = this.#field.childNodes[startOffset - 1];
    }

    // Walk back past empty text nodes — clicking past the last chip can land
    // the cursor with an empty text node between it and the chip.
    while (prev && (prev.nodeType === Node.TEXT_NODE) && (prev.textContent === "")) {
      prev = prev.previousSibling;
    }
    if (prev?.classList?.contains("tag-chip")) {
      e.preventDefault();
      this.#removeChip(prev);
    }
  }

  /**
   * If the cursor is at the end of a text node immediately before a chip,
   * remove that chip on Delete.
   */
  #handleDelete(e) {
    const sel = document.getSelection();
    if (!sel?.rangeCount || !sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const { startContainer, startOffset } = range;

    let next = null;
    if ((startContainer.nodeType === Node.TEXT_NODE) && (startOffset === startContainer.textContent.length)) {
      next = startContainer.nextSibling;
    } else if (startContainer === this.#field) {
      next = this.#field.childNodes[startOffset];
    }

    while (next && (next.nodeType === Node.TEXT_NODE) && (next.textContent === "")) {
      next = next.nextSibling;
    }
    if (next?.classList?.contains("tag-chip")) {
      e.preventDefault();
      this.#removeChip(next);
    }
  }

  // -------------------------------------------------- //

  /**
   * Clean up stray block elements (div, br) that contenteditable inserts on
   * Enter or paste, replacing them with their text content.
   */
  #cleanDOM() {
    let changed = false;
    for (const el of [...this.#field.querySelectorAll("br, div:not(.tag-chip)")]) {
      el.replaceWith(document.createTextNode(el.textContent));
      changed = true;
    }
    if (changed) this.#field.normalize();
  }

  // -------------------------------------------------- //

  #showDropdown() {
    const query = this.#getTypedText().toLowerCase();
    const filtered = this.#suggestions.filter(s =>
      !this.#chips.includes(s.value) &&
      (s.label.toLowerCase().includes(query) || s.value.toLowerCase().includes(query)),
    );

    this.#dropdown.innerHTML = "";

    if (!filtered.length) {
      this.#dropdown.hidden = true;
      return;
    }

    for (const { value, label } of filtered) {
      const li = document.createElement("li");
      li.className = "tag-dropdown-item";
      li.dataset.value = value;
      li.textContent = label;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.#addChip(value);
      });
      this.#dropdown.append(li);
    }

    this.#dropdown.hidden = false;
    this.#flipDropdownIfNeeded();
  }

  /**
   * If the dropdown extends past the viewport bottom, flip it to open above
   * the field instead. Toggles the `flipped` class which the stylesheet uses
   * to swap top/bottom anchoring.
   */
  #flipDropdownIfNeeded() {
    this.#dropdown.classList.remove("flipped");
    const fieldRect = this.#field.getBoundingClientRect();
    const dropHeight = this.#dropdown.offsetHeight;
    const spaceBelow = window.innerHeight - fieldRect.bottom;
    const spaceAbove = fieldRect.top;
    if ((spaceBelow < dropHeight) && (spaceAbove > spaceBelow)) {
      this.#dropdown.classList.add("flipped");
    }
  }

  #moveHighlight(direction) {
    const items = this.#dropdown.querySelectorAll(".tag-dropdown-item");
    if (!items.length) return;
    const current = this.#dropdown.querySelector(".highlighted");
    let idx = current ? Array.from(items).indexOf(current) + direction : 0;
    idx = Math.max(0, Math.min(idx, items.length - 1));
    current?.classList.remove("highlighted");
    items[idx].classList.add("highlighted");
  }
}
