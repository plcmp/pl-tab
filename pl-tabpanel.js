import { PlElement, html, css, } from "polylib";

import './pl-tab.js';

class PlTabPanel extends PlElement {
    static properties = {
        selected: { type: Number, value: 0 }
    }

    static css = css`
        :host {
			width: 100%;
			height: 100%;
			display: flex;
			position: relative;
            gap: 8px;
        }

        .line {
            border-bottom: 1px solid var(--grey-base);
            width: 100%;
            position: absolute;
            top: 32px;
        }
    `;

    static template = html`
        <div class="line"></div>
        <slot></slot>
    `;

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('select-tab', this.onSelectTab)

        setTimeout(() => {
            let tabs = Array.prototype.slice.call(this.querySelectorAll(':scope > pl-tab'));
            tabs.forEach((tab, idx) => {
                if (idx == this.selected) {
                    tab.selected = true;
                } else {
                    tab.selected = false;
                }
            });
        }, 0)

    }

    async beforeSelect() {
        return true;
    }

    async onSelectTab(event) {
        const res = await this.beforeSelect();
        if(!res) {
            return false;
        }
        let tabs = Array.prototype.slice.call(this.querySelectorAll(':scope > pl-tab')).filter(x => x != event.detail.tab);
        tabs.forEach(tab => {
            tab.selected = false;
        });

        event.detail.tab.selected = true;
    }
}

customElements.define('pl-tabpanel', PlTabPanel);
