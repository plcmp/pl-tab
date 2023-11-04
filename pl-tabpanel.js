import { PlElement, html, css, } from "polylib";
import { throttle } from '@plcmp/utils';

import './pl-tab.js';
import '@plcmp/pl-icon-button';

class PlTabPanel extends PlElement {
    static properties = {
        selected: { type: String, value: undefined, observer: 'selectedObserver' },
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
        this.navTabsTravelDistance = 100;

        const observer = new MutationObserver((mutations) => {
            this.arrowsVisible = this.scrollWidth < this.$.tabs.scrollWidth;
            if (mutations.length == 1 && mutations[0].attributeName == 'selected') {
                this.$.tabs.scrollTo({
                    left: mutations[0].target.scrollLeft,
                    behavior: 'smooth'
                });
            }
        });

        observer.observe(this, { attributes: true, subtree: true });
        const resizeObserver = new ResizeObserver(throttle(() => {
            this.arrowsVisible = this.scrollWidth < this.$.tabs.scrollWidth;
        }, 300));

        resizeObserver.observe(this.$.tabs);

        setTimeout(() => {
            let tabs = this._getTabs();

            if (!this.selected && tabs.length > 0) {
                this.selected = tabs[0].name;
            } else {
                this.selectedObserver(this.selected)
            }
        }, 0)
    }

    async beforeSelect() {
        return true;
    }

    async onSelectTab(event) {
        event.stopPropagation();

        const res = await this.beforeSelect(event.detail.tab);
        if (!res) {
            return false;
        }
        this.selected = event.detail.tab.name;
    }

    selectedObserver(val) {
        let tabs = this._getTabs();
        tabs.forEach(tab => {
            tab.selected = false;
        });

        let selectedTab = tabs.find(x => x.name == val);
        selectedTab.selected = true;
    }

    scrollLeft() {
        var currentScrollPos = this.$.tabs.scrollLeft;
        if (currentScrollPos > this.navTabsTravelDistance) {
            this.$.tabs.scrollTo({
                left: currentScrollPos - this.navTabsTravelDistance,
                behavior: 'smooth'
            });

        } else {
            this.$.tabs.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    scrollRight() {
        var scrollWidth = this.$.tabs.scrollWidth;

        var currentScrollPos = scrollWidth - this.$.tabs.scrollLeft;

        if (currentScrollPos > this.navTabsTravelDistance) {
            this.$.tabs.scrollTo({
                left: this.$.tabs.scrollLeft + this.navTabsTravelDistance,
                behavior: 'smooth'
            });
        } else if (currentScrollPos == this.navTabsTravelDistance) {
            this.$.tabs.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            this.$.tabs.scrollTo({
                left: currentScrollPos,
                behavior: 'smooth'
            });
        }

    }

    _getTabs() {
        return Array.prototype.slice.call(this.querySelectorAll(':scope > pl-tab'));
    }
}

customElements.define('pl-tabpanel', PlTabPanel);
