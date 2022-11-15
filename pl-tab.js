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
			color: var(--grey-darkest);
		}

		:host([hidden]) {
			display: none;
		}

		.header-text {
			display: flex;
			user-select: none;
			flex-shrink: 0;
		}

		.header {
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            gap: 8px;
            box-sizing: border-box;
            background: transparent;
			align-items: center;
			cursor: pointer;
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
			height: calc(100% - 48px);
			position: absolute;
			left: 0px;
			top: 48px;
		}

		:host([disabled]) {
			pointer-events: none;
			color: var(--grey-dark);
		}

		:host([selected]) .tab-content {
			display: flex;
		}

		:host([selected]) .header::after {
            width: 100%;
            content:'';
            left: 0;
        }

		:host(:hover), :host([selected]) {
            color: var(--primary-base);
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
			bubbles: true
		}));
	}
}

customElements.define('pl-tab', PlTab);