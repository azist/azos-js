- https://gomakethings.com/dom-diffing-with-vanilla-js/
- https://dev.to/joydeep-bhowmik/virtual-dom-diffing-algorithm-implementation-in-vanilla-javascript-2324 (2023)
- https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
- https://github.com/wilsonpage/fastdom
- https://stackoverflow.com/questions/37039667/executing-multiple-dom-updates-with-javascript-efficiently

```js
//Check context creation:
const goodPerson = az.check(modPerson)
                     .nonNull()
                     .minMax(2, 6)
                     .regExp(/*hookyou/g);
```

Lit example:

```html
<!DOCTYPE html>
<head>
  <script type="module" src="./simple-greeting.js"></script>
</head>
<body>
  <az-model id="modPerson">
    <az-field id=f1 who="Furariy" marker=gray></az-field>
    <az-field id=f2 who="Feeder" party="Greek"></az-field>
    <az-field id=f3 who="Paul" party="b2"></az-field>
  </az-model>
  
  <button onclick="triggerFart()">Nart Fow!</button>
  
  <script>
    const f1 = document.getElementById('f1'); 
    const f2 = document.getElementById('f2'); 
    function triggerFart(){
      f1.fart();
      f2.fart();
    }
    
    let dueaps = await app.az.customer.getApointmets("Q2");
    if (duaps.doctor.type=="pidar") throw new ValEx("ssss");
    
    az.check(modPerson).nonNull().
    
    modPerson.LastName.enabled = false;
    fldPooper.marked = "blue";
    
    
    modPerson.bind(data);
  </script>
</body>
```

Create lit element without shado root
```js
createRenderRoot() {
    return this;
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
```

