import * as elementBuilders from '../inputElements.js';
export class FormItem {
    constructor(Item, cb, destroyCb) {
        this.cb = cb;
        this.destroyCb = destroyCb ? destroyCb : () => { };
        this.element = document.createElement("label");
        this.element.setAttribute("class", "fn__flex b3-label");
        this.element.innerHTML = `
            <div class="fn__flex-1">
            <span class="b3-label__name">${Item.name}</span>
            <div class="b3-label__text">${Item.label}</div>
        </div>
        <span class="fn__space"></span>
            `;
        this.inputter = new FormInputter(Item, this);
        this.element.appendChild(this.inputter.element);
    }
    destroy() {
        if (this.pickrs) {
            this.pickrs.forEach((pickr) => {
                pickr.destroy();
                pickr = undefined;
            });
            this.pickrs = undefined;
            this.destroyCb();
        }
    }
}

export class FormInputter {
    constructor(options, formItem) {
        this.options = options;
        this.formItem = formItem;
        this.element = this.buildElement(options);
        this.value = options.value;
    }

    buildElement(options) {
        let builder = elementBuilders[`build${capitalize(options.type)}Element`] || elementBuilders.buildDefaultElement;
        let { element, value } = builder(options, this.formItem);
        element.addEventListener('valueChange', (event) => {
            this.value = event.detail.value;
            // 更新元素的值
        });
        return element;
    }

    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            // 触发自定义事件
            let event = new CustomEvent('valueChange', { detail: { value: newValue } });
            this.element.dispatchEvent(event);
        }
    }

    get value() {
        return this._value;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
