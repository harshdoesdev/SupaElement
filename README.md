# SupaElement
A Toolkit For Creating Lightning Fast Custom Elements
```javascript
import SupaElement, { template, style } from './src/supa-element.js';

class MyButton extends SupaElement {

  static get styles() {
    return style`
      button {
        display: inline-block;
        color: white;
        background: blue;
        border-radius: .5em;
        padding: .6em;
        box-sizing: border-box;
      }
    `;
  }

  connectedCallback() {
    
    const tmpl = template`
        <button id="myBtn">Click Me!</button>
    `;
    
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
    
    const btn = this.query('#myBtn');
    
    btn.addEventListener('click', () => console.log('Hello world!'));
    
  }

}
```
