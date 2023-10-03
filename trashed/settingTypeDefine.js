import * as typedUIs from './typedUIs'
export function string2DOM(string) {
    string = string.trim()
    let div = document.createElement('div');
    div.innerHTML = string;

    // 如果 div 只有一个子元素，直接返回这个子元素
    if (div.childNodes.length === 1) {
        return div.firstChild;
    }
    // 否则，返回包含所有子元素的文档片段
    let fragment = document.createDocumentFragment();
    while (div.firstChild) {
        fragment.appendChild(div.firstChild);
    }
    return fragment;
}

class Setter {
    constructor(path, target) {
        this.path = path.split('.'); // 将路径字符串分解为数组
        this.target = target;
        this.elements = []
    }
    _validate(val) {
        // 检查子类是否实现了validate方法
        if (this.validate && typeof this.validate === 'function') {
            this.validate(val);
        } else {
            // 检查传入的值是否基础数据类型或者由字符串组成的数组
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || (Array.isArray(val) && val.every(item => typeof item === 'string'))) {
                // 如果target中对应路径的值存在$validate属性,使用它进行校验
                let targetValue = this.path.reduce((obj, key) => obj[key], this.target);
                if (targetValue && typeof targetValue.$validate === 'function') {
                    targetValue.$validate(val);
                }
            } else {
                throw new Error('Invalid value');
            }
        }
    }
    createUI() {
        // 检查子类是否实现了render方法
        if (this.render && typeof this.render === 'function') {
            // 调用子类的render方法生成UI
            let newElement = this.render();
            this.elements.push(newElement); // 将新元素添加到elements数组中
            return newElement;
        } else if (this.template && typeof this.template === 'string') {
            // 如果子类没有实现render方法，但是提供了template属性，使用template属性和string2DOM方法生成UI
            let newElement = string2DOM(this.template);
            this.elements.push(newElement);
            return newElement;
        } else {
            // 如果子类既没有实现render方法，也没有提供template属性，抛出一个错误
            throw new Error('The render method is not implemented in the subclass, and no template is provided');
        }
    }
    get value() {
        // 通过path定位target中对应位置的值并返回它
        return this.path.reduce((obj, key) => obj[key], this.target);
    }
    update(val) {
        // 设置一个标志来跳过onchange的调用
        this.skipOnchange = true;
    
        // 更新值
        this.value = val;
    
        // 保存旧元素的位置信息
        let parentElements = [];
        let nextSiblings = [];
        this.elements.forEach(element => {
            parentElements.push(element.parentNode);
            nextSiblings.push(element.nextSibling);
        });
    
        // 移除旧元素
        this.elements.forEach(element => {
            element.parentNode.removeChild(element);
        });
    
        // 清空elements数组
        this.elements = [];
    
        // 从模板更新元素
        this.createUI();
    
        // 将元素插入回它们原本所在的位置
        this.elements.forEach((element, index) => {
            parentElements[index].insertBefore(element, nextSiblings[index]);
        });
    
        this.skipOnchange = false;
    }

    set value(val) {
        // 为每一个element调用子类的onchange方法
        this.elements.forEach(element => {
            if (!this.skipOnchange && this.onchange && typeof this.onchange === 'function') {
                this.onchange(element, val);
            } else {
                // 如果子类没有实现onchange方法，抛出一个错误或者不做任何操作
                // throw new Error('The onchange method is not implemented in the subclass');
            }
        });
        // 通过path定位target中对应位置的值并设置它
        this.path.reduce((obj, key, idx, arr) => {
            if (idx === arr.length - 1) {
                if (obj[key] && typeof obj[key] === 'object' && '$value' in obj[key]) {
                    this._validate(val); // 调用validate方法进行校验
                    obj[key].$value = val;
                } else {
                    obj[key] = val;
                }
            } else {
                return obj[key];
            }
        }, this.target);
    }
}

let data = {
    message: 'Hello, world!',
    update: function(newMessage) {
    // 在这里存储新的 message 数据
    console.log(newMessage);
    }
    };
    
    let template =
    `<div x-data='${JSON.stringify(data)}'>
    <input type="text" x-model="message" x-on:input="update(message)" />
    </div>`
    
    
    // 然后你可以将这个模板插入到 DOM 中
    document.body.innerHTML = template;
    let vDOM = {
        div: {
          input: {
            $on: {
              change: (self, value) => { self.parent.emit('change', value) }
            }
          },
          $class: '',
          $on: {},
          $emit: {
            change: (self) => { self.input.value }
          },
          $text:'测试'
        }
      };
    `
    <label class="fn__flex b3-label config__item">
    <div class="fn__flex-1">
        <div class="fn__flex">
            图标
            <span class="fn__space"></span>
            <a href="javascript:void(0)" id="appearanceOpenIcon">打开图标文件夹</a>
        </div>
        <div class="b3-label__text">选择外观使用的图标</div>
    </div>
    <span class="fn__space"></span>
    <select class="b3-select fn__flex-center fn__size200" id="icon">
        <option value="ant">ant</option><option value="material" selected="">material</option>
    </select>
</label>
    
    `