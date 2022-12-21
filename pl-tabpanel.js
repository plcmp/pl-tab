import { PlElement, html, css, } from "polylib";
import { throttle } from '@plcmp/utils';

import './pl-tab.js';
import '@plcmp/pl-icon-button';

class PlTabPanel extends PlElement {
    static properties = {
        selected: { type: Number, value: 0 },
        arrowsVisible: { type: Boolean, reflectToAttribute: true, value: true }
    }

    static css = css`
        :host {
            display: flex;
            width: 100%;
			height: 100%;
            position: relative;
        }

        #tabs {
            width: 100%;
            height: 32px;
            box-sizing: border-box;
            overflow-y: hidden;
            overflow-x: hidden;
            white-space: nowrap;
            display: flex;
            gap: 8px;
        }

        :host([arrows-visible]) #tabs ::slotted(*:first-of-type) { margin-left: 32px }
        :host([arrows-visible]) #tabs ::slotted(*:last-of-type) { margin-right: 32px }

        .line {
            border-bottom: 1px solid var(--grey-base);
            width: 100%;
            position: absolute;
            top: 32px;
        }

        .left {
            z-index: 1;
            background: white;
            position: absolute;
            left: 0;
        }

        .right {
            z-index: 1;
            background: white;
            position: absolute;
            right: 0;
        }
    `;

    static template = html`
        <div class="line"></div>
        <div id="tabs">
            <pl-icon-button class="left" hidden="[[!arrowsVisible]]" variant="link" iconset="pl-default" size="16"
                icon="chevron-left" on-click="[[scrollLeft]]"></pl-icon-button>
            <slot></slot>
            <pl-icon-button class="right" hidden="[[!arrowsVisible]]" variant="link" iconset="pl-default" size="16"
                icon="chevron-right" on-click="[[scrollRight]]"></pl-icon-button>
        </div>
    `;

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('select-tab', this.onSelectTab)
        this.scrollAmount = 0;
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

        const resizeObserver = new ResizeObserver((resizes) => {
            let throttler = throttle(() => {
                this.arrowsVisible = this.scrollWidth < this.$.tabs.scrollWidth;
            }, 300)

            throttler();
        });

        resizeObserver.observe(this.$.tabs);

    }

    async beforeSelect() {
        return true;
    }

    async onSelectTab(event) {
        const res = await this.beforeSelect(event.detail.tab);
        if (!res) {
            return false;
        }
        let tabs = Array.prototype.slice.call(this.querySelectorAll(':scope > pl-tab')).filter(x => x != event.detail.tab);
        tabs.forEach(tab => {
            tab.selected = false;
        });

        event.detail.tab.selected = true;
    }

    scrollLeft() {
        if(this.scrollAmount > 0) {
            this.$.tabs.scrollTo({
                left: this.scrollAmount -= 100,
                behavior: 'smooth'
            });
        }
    }

    scrollRight() {
        if(this.scrollAmount < this.scrollWidth) {
            this.$.tabs.scrollTo({
                left: this.scrollAmount += 100,
                behavior: 'smooth'
            });
        }
    }
}

customElements.define('pl-tabpanel', PlTabPanel);
