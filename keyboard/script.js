// создаем h1, p, textarea
const elementH1 = document.createElement('h1');
const elementTextarea = document.createElement('textarea');
const elementP = document.createElement('p');

// добавляем класс для textarea
elementTextarea.classList.add('use-keyboard-input');

// добавляем в DOM

document.body.appendChild(elementH1);
document.body.appendChild(elementP);
document.body.appendChild(elementTextarea);

// добавляем текст в p и h1
elementH1.innerHTML = "RSS Виртуальная клавиатура";
elementP.innerHTML = "Клавиатура создана в операционной системе MacOS<br>Для переключения языка комбинация: cmd + space<br>Для появления клавиатуры кликните по textarea";



const Keyboard = {
    elements: {
        main: null, //главный контейнер для клавиатуры
        keyContainer: null, //контейнер keyboard__keys
        keys: [] //массив кнопок
    },

    eventHandlers: {
        oninput: null, //показывает клавиатуру
        onclose: null //скрывает клавиатуру
    },

    properties: {
        value: "", //значение кнопки
        capsLock: false //заглавная буква или нет
    },
    
    // для инициализации
    init() {
        // создаем main elements
        this.elements.main = document.createElement('div');
        this.elements.keyContainer = document.createElement('div');

        // добавляем классы
        this.elements.main.classList.add('keyboard', 'keyboard-hidden');
        this.elements.keyContainer.classList.add('keyboard__keys');
        this.elements.keyContainer.appendChild(this._creatKeys());

        this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard_key')

        // добавляем всё в DOM
        this.elements.main.appendChild(this.elements.keyContainer);
        document.body.appendChild(this.elements.main);

        // показ клавиатуры при клике на textarea
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    //для создания кнопок
    _creatKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "§","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "backspace",
            "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "/", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "shift",
            "ctrl", "alt", "cmd", "space", "alt", 
        ];

        // Создвать HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        }

        keyLayout.forEach((key) => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', ']', 'enter', 'shift'].indexOf(key) !== -1;

            // Add atributes and classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard_key');

            switch (key) {
                case "backspace":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = createIconHTML('backspace');

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });

                    break;

                case "caps":
                    keyElement.classList.add('keyboard_key--wide', 'keyboard_key--activatable');
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');
    
                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard_key--active', this.properties.capsLock);
                    });
    
                    break;

                case "enter":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_return');
            
                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n' ;
                        this._triggerEvent('oninput');
                    });
            
                    break;
                
                case "space":
                    keyElement.classList.add('keyboard_key--extra-wide');
                    keyElement.innerHTML = createIconHTML('space_bar');
        
                    keyElement.addEventListener('click', () => {
                        this.properties.value += " ";
                        this._triggerEvent('oninput');
                    });
        
                    break;
                case "tab":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_tab');
            
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "    ";
                        this._triggerEvent('oninput');
                    });
            
                    break;
            
                case "done":
                    keyElement.classList.add('keyboard_key--wide', 'keyboard_key--dark');
                    keyElement.innerHTML = createIconHTML('check_circle');
            
                    keyElement.addEventListener('click', () => {
                        this.close();
                        this._triggerEvent('onclose');
                    });
            
                    break;
                
                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    });
                
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }

        });

        return fragment;
    },

    //для показа клавиатуры
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    //для caps Lock режима
    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    //открыть клавиатуру
    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard-hidden');
    },

    //закрыть клавиатуру
    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard-hidden');
    }

};

window.addEventListener('DOMContentLoaded', function() {
    Keyboard.init();
});


