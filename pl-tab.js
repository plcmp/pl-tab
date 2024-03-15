import { PlElement, html, css } from "polylib";

class PlTab extends PlElement {
	static properties = {
		header: { type: String },
		selected: { type: Boolean, reflectToAttribute: true },
		hidden: { type: Boolean, reflectToAttribute: true },
		disabled: { type: Boolean, reflectToAttribute: true },
		name: { type: String }
	}

	static css = css`
		:host([hidden]) {
			display: none;
		}

		.header-text {
			display: flex;
			user-select: none;
			flex-shrink: 0;
			padding: 0 var(--pl-space-sm);
			cursor: pointer;
		}

		.header {
			display: flex;
            flex-direction: row;
			height: var(--pl-base-size);
            width: 100%;
            box-sizing: border-box;
            background: transparent;
			align-items: center;
			position: relative;
			color: var(--pl-header-color);
		}

		.header::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            height: 2px;
            width: 0%;
            background: var(--pl-primary-base);
            transition: all 0.5s ease;
        }

		.content {
			display: none;
		}

		:host([disabled]) {
			cursor: not-allowed;
		}

		:host([disabled]) .header {
			pointer-events: none;
			color: var(--pl-grey-base);
		}

		:host([selected]) .content {
			position: absolute;
			display: block;
			height: calc(100% - var(--pl-base-size));
			width: 100%;
			overflow: hidden;
			left: 0;
			top: var(--pl-base-size);
			padding-top: var(--pl-space-md);
			box-sizing: border-box;
			white-space: normal;
		}

		:host([selected]) .header::after {
            width: 100%;
            content:'';
            left: 0;
        }

		.header:hover, :host([selected]) {
            color: var(--pl-primary-base);
        }
	`;

	static template = html`
		<div part="header" class="header" on-click="[[onSelectClick]]">
			<slot name="prefix"></slot>
			<div class="header-text">
				<slot name="header"></slot>
				<span>[[header]]</span>
			</div>
			<slot name="suffix"></slot>
		</div>
		<div part="content" class="content">
			<slot></slot>
		</div>
	`;

	connectedCallback(){
		super.connectedCallback();
		if(!this.name) {
			this.name = (Math.random() + 1).toString(36).substring(2);
		}
	}

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