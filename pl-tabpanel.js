import { PlElement, html, css } from "polylib";

import './pl-tab.js';

class PlTabPanel extends PlElement {
    static properties = {
        _tabs: { type: Array, value: () => [] },
        selected: { type: Number, value: 0 }
    }

    static css = css`
        :host {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        .tab-header {
            width: 100%;
            height: 40px;
            position: relative;
            display: flex;
            flex-direction: row;
            gap: 8px;
            box-sizing: border-box;
            overflow: hidden;
            flex-shrink:0;
            background: transparent;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--grey-base);
        }

        .tab {
            display: flex;
            height: 100%;
            align-items: center;
            color: var(--grey-darkest);
            user-select: none;
            cursor: pointer;
            font-size: 13px;
            line-height: 16px;
            flex-shrink:0;
            padding:  0 4px;
            gap: 8px;
            position: relative;
        }

        .tab[hidden] {
            display: none;
        }

        .suffix:empty, .prefix:empty {
            display: none;
        }

        .tab[selected] {
            color: var(--text-color);
        }
        
        .tab:hover {
            color: var(--primary-base);
        }

        .tab::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            height: 2px;
            width: 0%;
            background: var(--primary-base);
            transition: all 0.5s ease;
        }

        .tab[selected]::after {
            width: 100%;
            content:'';
            left: 0;
        }

        .content {
            display: flex;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            overflow: auto;
        }

        .content ::slotted(*) {
            width: 100%;
            height: 100%;
        }

        .content ::slotted(:not([selected])) {
            display: none;
        }
    `;

    static template = html`
        <div id="header" class="tab-header">
            <template d:repeat="[[_tabs]]">
                <div class="tab" hidden$="[[item.hidden]]" selected$="[[item.selected]]" on-click="[[onTabClick]]">
                    <span>[[item.header]]</span>
                </div>
            </template>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    `;

    connectedCallback() {
        super.connectedCallback();
        this._boundNodeChanged = this._nodeChanged.bind(this);
        this._observer = new MutationObserver(this._boundNodeChanged);
        this.addEventListener('pl-tab-change', this._boundNodeChanged);
        this._observer.observe(this, { childList: true });
    }

    _nodeChanged() {
        let isHiddenItem = false;

        const tabs = Array.prototype.slice.call(this.querySelectorAll(':scope > pl-tab'))
            .map((tab, idx) => {
                if (tab.hidden && tab.selected) {
                    isHiddenItem = true;
                }
                tab.selected = idx == 0;
                return {
                    selected: idx == 0,
                    header: tab.header,
                    hidden: tab.hidden,
                    disabled: tab.disabled,
                    node: tab
                };
            });

        tabs.find((item, index) => {
            if (!item.hidden && isHiddenItem) {
                item.selected = true;
                this.selected = index;
                return true;
            }
        });



        this.set('_tabs', tabs);
    }

    onTabClick(event) {
        this._tabs.forEach((el, idx) => {
            el.node.selected = el == event.model.item;
            this.set(`_tabs.${idx}.selected`, el == event.model.item);
        });
    }
}

customElements.define('pl-tabpanel', PlTabPanel);
