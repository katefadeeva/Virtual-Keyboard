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
elementP.innerHTML = "Клавиатура создана в операционной системе MacOS<br>Для переключения языка, на физической клавиатуре, комбинация: tab + space<br>Для переключения языка, на виртуальной клавиатуре, нажмите: Cmd<br>Для появления клавиатуры кликните по textarea";


const Keyboard = {
    elements: {
        main: null, //главный контейнер для клавиатуры
        keyContainer: null, //контейнер keyboard__keys
        keys: [] //массив кнопок
    },

    language: {
        type: 'ru',
        en: [
            "§","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "|", "Enter",
            "done", "`","z", "x", "c", "v", "b", "n", "m", ",", ".", "ArrowUp", "/", 
            "Shift", "Control", "Alt", "Meta", "Space", "Alt", "ArrowLeft", "ArrowDown", "ArrowRight"
            ],
        ru: [
            ">","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ё", "Enter",
            "done", "[","я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ArrowUp", "/", 
            "Shift", "Control", "Alt", "Meta", "Space", "Alt", "ArrowLeft", "ArrowDown", "ArrowRight"
        ]
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
        if (!localStorage.getItem("language")) {
            localStorage.setItem("language",this.language.type);
        } else {
            this.language.type = localStorage.getItem("language");
        }

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
            element.addEventListener('keydown', (event) => {
                this.elements.keys.forEach((item) => {
                    if(event.key === item.value || event.code === item.value) {
                        item.click();
                        event.preventDefault();
                        item.classList.add('active');
                    } 
                }); 
            });


            element.addEventListener('keyup', (event) => {
                this.elements.keys.forEach((item) => {
                    if(event.key === item.value || event.code === item.value) {
                        item.classList.remove('active');
                    } 
                });
            });


            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

        runOnKeys(
            function() { Keyboard._changeLanguage()},
            "Tab",
            "Space"
          );
    },

    //для создания кнопок
    _creatKeys(keyLayout = this.language[localStorage.getItem("language")]) {
        const fragment = document.createDocumentFragment();
        
        // Создвать HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach((key) => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['Backspace', ']', 'ъ', 'Enter', '/'].indexOf(key) !== -1;

            // Add atributes and classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard_key');

            switch (key) {
                case "Backspace":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = createIconHTML('backspace');
                    keyElement.value = "Backspace";

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });

                    break;

                case "CapsLock":
                    keyElement.classList.add('keyboard_key--wide', 'keyboard_key--activatable');
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');
                    keyElement.value = "CapsLock";
    
                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard_key--active', this.properties.capsLock);
                    });
    
                    break;
                
                case "Shift":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = "<span>Shift</span>"
                    keyElement.value = "Shift";

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('active', this.properties.capsLock);
                    });
        
                    break;

                case "Enter":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_return');
                    keyElement.value = "Enter";
            
                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n' ;
                        this._triggerEvent('oninput');
                    });
            
                    break;
                    
                case "Control":
                    keyElement.innerHTML = "<span>Ctrl</span>";
                    keyElement.value = "Control";
    
                    keyElement.addEventListener('click', () => {
                        this._triggerEvent('oninput');
                    });
            
                    break;

                case "Alt":
                    keyElement.innerHTML = "<span>Alt</span>";
                    keyElement.value = "Alt";
        
                    keyElement.addEventListener('click', () => {
                        this._triggerEvent('oninput');
                    });
                
                    break;

                case "Meta":
                    keyElement.innerHTML = "<span>Cmd</span>";
                    keyElement.value = "Meta";
    
                    keyElement.addEventListener('click', () => {
                        this._changeLanguage();
                        this._triggerEvent('oninput');
                    });
            
                    break;

                case "Space":
                    keyElement.classList.add('keyboard_key--extra-wide');
                    keyElement.innerHTML = createIconHTML('space_bar');
                    keyElement.value = "Space";
        
                    keyElement.addEventListener('click', () => {
                        this.properties.value += " ";
                        this._triggerEvent('oninput');
                    });
        
                    break;
                
                case "Tab":
                    keyElement.classList.add('keyboard_key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_tab');
                    keyElement.value = "Tab";
            
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "    ";
                        this._triggerEvent('oninput');
                    });
            
                    break;
                
                case "ArrowUp":
                    keyElement.innerHTML = createIconHTML('keyboard_arrow_up');
                    keyElement.value = "ArrowUp";
                
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "↑";
                        this._triggerEvent('oninput');
                    });
                
                    break;
                
                case "ArrowLeft":
                    keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
                    keyElement.value = "ArrowLeft";
                    
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "←";
                        this._triggerEvent('oninput');
                    });
                    
                    break;

                case "ArrowDown":
                    keyElement.innerHTML = createIconHTML('keyboard_arrow_down');
                    keyElement.value = "ArrowDown";
                        
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "↓";
                        this._triggerEvent('oninput');
                    });
                        
                    break;

                case "ArrowRight":
                    keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
                    keyElement.value = "ArrowRight";
                        
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "→";
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
                    keyElement.value = key.toLowerCase();

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

    //добавление значения к значению textarea
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

    // для смены Языка
    _changeLanguage() {
        let el = this.elements.keyContainer;
        let child = el.lastElementChild;  
        while (child) { 
            el.removeChild(child); 
            child = el.lastElementChild; 
        } 
        this.language.type === 'ru' ? this.language.type = 'en' : this.language.type = 'ru';

        this.elements.keyContainer.appendChild(this._creatKeys(this.language[this.language.type]));
        this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard_key');
        localStorage.setItem("language",this.language.type);
    },

    //открыть клавиатуру
    open(initialValue, oninput) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = null;
        this.elements.main.classList.remove('keyboard-hidden');
    },

    //закрыть клавиатуру
    close() {
        this.properties.value = "";
        this.elements.main.classList.add('keyboard-hidden');
    }

};

function runOnKeys(func, ...codes) {
    let pressed = new Set();

    document.addEventListener('keydown', function(event) {
      pressed.add(event.code);

      for (let code of codes) { // все ли клавиши из набора нажаты?
        if (!pressed.has(code)) {
          return;
        }
      }
      pressed.clear();

      func();
    });

    document.addEventListener('keyup', function(event) {
      pressed.delete(event.code);
    });

  }

window.addEventListener('DOMContentLoaded', function() {
    Keyboard.init();
});