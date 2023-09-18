// elementBuilders.js
export function buildBooleanElement({ value, defaultValue, onChange, onExternalChange }, formItem) {
    const element = document.createElement("input");
    batchSetAttribute(element, {
        class: "b3-switch fn__flex-center",
        type: "checkbox",
        value: value || defaultValue,
    });
    element.addEventListener("change", () => {
        value = element.checked;
        onChange && onChange({ value });
    });
    onExternalChange && onExternalChange((newValue) => {
        element.checked = newValue;
    });
    return { element, value };
}
export function buildNumberElement({ value, defaultValue, max, min, step, unit, onChange, onExternalChange }, formItem) {
    const element = document.createElement("input");
    element.type = "range";
    element.value = value || defaultValue || 0;
    element.max = max || 100;
    element.min = min || 1;
    element.step = step || 1;
    element.className = "b3-slider";
    element.style.boxSizing = "border-box";
    element.addEventListener("mousemove", () => {
        value = element.value + (unit || "px");
        onChange && onChange({ value });
    });
    element.addEventListener("change", () => {
        value = element.value + (unit || "px");
        onChange && onChange({ value });
    });
    onExternalChange && onExternalChange((newValue) => {
        element.value = newValue;
    });
    return { element, value };
}
export function buildSelectElement({ value, defaultValue, options, multiple, onChange, onExternalChange }, formItem) {
    const element = document.createElement("select");
    element.className = "b3-select fn__flex-center fn__size200";
    options && options.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.value || item;
        option.text = item.label || item.value || item;
        if (option.value === defaultValue) {
            option.selected = true;
        }
        element.appendChild(option);
    });
    if (multiple) {
        // handle multiple select logic
    } else {
        element.addEventListener("change", () => {
            value = element.value;
            onChange && onChange({ value });
        });
    }
    onExternalChange && onExternalChange((newValue) => {
        element.value = newValue;
    });
    return { element, value };
}
export function buildDefaultElement({ value, defaultValue, onChange, onExternalChange }, formItem) {
    const element = document.createElement("textarea");
    element.value = value || defaultValue || "";
    element.className = "b3-text-field fn__flex-center fn__size200";
    element.addEventListener("change", () => {
        value = element.value;
        onChange && onChange({ value });
    });
    onExternalChange && onExternalChange((newValue) => {
        element.value = newValue;
    });
    return { element, value };
}
export function buildFileInputElement({ value, defaultValue, onChange, onExternalChange }, formItem) {
    const element = document.createElement("input");
    batchSetAttribute(element, {
        type: "file",
        value: value || defaultValue,
    });
    element.addEventListener("change", (event) => {
        value = event.target.files[0];
        onChange && onChange({ value });
        formItem.cb.bind(formItem)({ value });
    });
    onExternalChange && onExternalChange((newValue) => {
        element.value = newValue;
    });
    return { element, value };
}

function batchSetAttribute(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}