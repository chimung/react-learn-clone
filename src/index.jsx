const React = {
  createElement: (...agrs) => {
    console.log(agrs)
    const [tagName, props, ...children] = agrs;
    const newEle = document.createElement(tagName);
    Object.keys(props)
      .filter((prop) => !prop.startsWith("__"))
      .forEach((prop) => {
        if (typeof props[prop] == "function") {
          newEle[prop] = props[prop]
        } else {
          newEle.setAttribute(prop, props[prop]);
        }
      });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        newEle.appendChild(document.createTextNode(child))
      } else {
        newEle.appendChild(child)
      }
    })
    return newEle;
  },
};


const App = () => {
  const test = () => {
    console.log('test')
  }
  return <div className={"test-css"}>
    <button onclick={() => alert(123)}>Button 1</button>
    <button onclick={test}>Button 2</button>
  </div>
};

function render(FC) {
  document.querySelector('#app').innerHTML = "";
  document.querySelector('#app').appendChild(FC())
}

render(App)