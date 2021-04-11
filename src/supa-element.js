/* SupaElement | MIT License | Harsh Singh */

const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
    "`": "&grave;"
};

const htmlEscapeReg = /[&<>"'`/]/ig;

/**
 * An utility function for sanitizing strings to prevent XSS Injection
 */

export const sanitize = str => str.replace(htmlEscapeReg, match => htmlEscapeMap[match]);

/**
 * A Tagged Function To Create CSSStyleSheets
 * Example: 
 *  const btnStyle = style`
 *      
 *      button {
 *          display: inline-block;
 *          color: #fff;
 *          background: #303;
 *      }
 * 
 *  `;
 */

export const style = (strings, ...values) => {

    const stylesheet = new CSSStyleSheet;

    stylesheet.replaceSync(
        values.reduce((css, value, index) => css + value + strings[index + 1], strings[0])
    );

    return stylesheet;

};

/**
 * A Tagged Function To Create HTML5 Templates
 * It Automatically Sanitizes Interpolations
 * Example:
 * const dangerousValue = "<b onclick='something()'>world</b>";
 * const myTemplate = template`
 * 
 *      <p>Hello, ${dangerousValue}!</p> 
 *      //It Will Be Converted Into: <p>Hello, &lt;b onclick=&#x27;something()&#x27;&gt;world&lt;/b&gt;
 * 
 * `; // returns a HTMLTemplateElement
 */

export const template = (strings, ...values) => {

    const tmpl = document.createElement('template');

    tmpl.innerHTML = values.reduce(

        (html, value, index) => html + sanitize(value) + strings[index + 1], 
        
        strings[0]
    
    );

    return tmpl;

};

/**
 * A Simple Base Class For Creating Your Own Custom Element
 * Example:
 * class MyButton extends SupaElement {
 * 
 *      static get styles() {
 * 
 *          return style`
 * 
 *              button {
 *                  color: red;
 *              }
 * 
 *          `;
 * 
 *          // return [styleA, styleB, styleC, ...styleN]
 * 
 *      }
 * 
 *      connectedCallback() {
 *      
 *          const tmpl = template`
 * 
 *              <button id="myBtn">Click me!</button>
 * 
 *          `; // create a template
 * 
 *          this.shadowRoot.appendChild(tmpl.content.cloneNode(true)); // clone and append its content to shadow root
 * 
 *          const btn = this.query('#myBtn'); // query an element from shadowRoot
 * 
 *          btn.addEventListener('click', () => {
 * 
 *              console.log('Hello world!');
 * 
 *          });
 * 
 *      }
 * 
 * }
 * 
 * customElements.define('my-button', MyButton);
 */

class HyperElement extends SupaElement {

    constructor() {
        
        super();
        
        this.attachShadow({ mode: 'open' });
        
        const styles = this.constructor.styles;

        if(styles) {

            this.shadowRoot.adoptedStyleSheets = Array.isArray(styles)
                
                ? styles

                : [styles];

        }
    
    }

    query(sel) {

        return this.shadowRoot.querySelector(sel);

    }

    queryAll(sel) {

        return this.shadowRoot.querySelectorAll(sel);

    }
    
    emit(type, detail) {

        this.dispatchEvent(new CustomEvent(type, {
            
            bubbles: true,
            
            composed: true,
            
            detail
        
        }));

    }

}

export default HyperElement;
