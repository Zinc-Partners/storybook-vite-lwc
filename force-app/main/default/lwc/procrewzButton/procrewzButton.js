import { LightningElement, api } from 'lwc';

export default class ProcrewzButton extends LightningElement {
    @api label = 'Button';
    @api variant = 'primary'; // primary, secondary, navy, destructive
    @api size = 'medium'; // small, medium, large
    @api disabled = false;
    @api loading = false;
    @api iconUrl;
    @api iconPosition = 'left'; // left, right
    @api type = 'button'; // button, submit, reset

    get buttonClass() {
        return `procrewz-button ${this.variant} ${this.size} ${this.loading ? 'loading' : ''} ${this.disabled ? 'disabled' : ''}`;
    }

    get showIconLeft() {
        return this.iconUrl && this.iconPosition === 'left';
    }

    get showIconRight() {
        return this.iconUrl && this.iconPosition === 'right';
    }

    handleClick() {
        if (!this.disabled && !this.loading) {
            this.dispatchEvent(new CustomEvent('click'));
        }
    }
}
