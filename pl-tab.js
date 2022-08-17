import { PlElement, html, css } from "polylib";

class PlTab extends PlElement {
	static properties = {
		header: { type: String },
		selected: { type: Boolean, reflectToAttribute: true },
		hidden: { type: Boolean, reflectToAttribute: true }
	}

	static css = css`
		:host([hidden]) {
			display: none;
		}
	`;

	static template = html`
		<slot></slot>
	`;

	connectedCallback() {
		super.connectedCallback();
		this.dispatchEvent(new CustomEvent('pl-tab-change', {
			bubbles: true
		}));
	}
}

customElements.define('pl-tab', PlTab);