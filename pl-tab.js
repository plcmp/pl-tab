import { PlElement, html, css } from "polylib";

class PlTab extends PlElement {
	static properties = {
		header: { type: String },
		selected: { type: Boolean, reflectToAttribute: true },
		hidden: { type: Boolean, reflectToAttribute: true },
		disabled: { type: Boolean, reflectToAttribute: true }
	}

	static css = css`
		:host {
			display: flex;
			flex-direction: column;
			--pl-tab-text-color: var(--grey-darkest);
		}

		:host([hidden]) {
			display: none;
		}

		.header-text {
			display: flex;
			user-select: none;
			flex-shrink: 0;
			color: var(--pl-tab-text-color);
			padding: 0 4px;
			cursor: pointer;
		}

		.header {
            width: 100%;
            height: 32px;
            display: flex;
            flex-direction: row;
            box-sizing: border-box;
            background: transparent;
			align-items: center;
			position: relative;
		}

		.header::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            height: 2px;
            width: 0%;
            background: var(--primary-base);
            transition: all 0.5s ease;
        }

		.tab-content {
			display: none;
			overflow: hidden;
			width: 100%;
			height: calc(100% - 32px);
			position: absolute;
			left: 0px;
			top: 32px;
			padding-top: var(--space-md);
			box-sizing: border-box;
		}

		:host([disabled]) {
			pointer-events: none;
			color: var(--grey-dark);
		}

		:host([selected]) .tab-content {
			display: block;
		}

		:host([selected]) .header::after {
            width: 100%;
            content:'';
            left: 0;
        }

		:host(:hover), :host([selected]) {
            --pl-tab-text-color: var(--primary-base);
        }
	`;

	static template = html`
		<div class="header" on-click="[[onSelectClick]]">
			<slot name="prefix"></slot>
			<div class="header-text">[[header]]</div>
			<slot name="suffix"></slot>
		</div>
		<div class="tab-content">
			<slot></slot>
		</div>
	`;

	onSelectClick() {
		this.dispatchEvent(new CustomEvent('select-tab', {
			bubbles: true,
			detail: {
				tab: this
			}
		}));
	}
}

customElements.define('pl-tab', PlTab);