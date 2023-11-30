import ButtonTest from "./ButtonTest";
import Welcome from "./Wellcome";
// import FikeNode, { renderFikeTree } from "./fiberLike/FikeNode";
import FiberLike, { FikeNodeStruct } from "./fiberLike";
import React from './React'

function createElementInternal(...agrs) {
  const [tagName, props, ...children] = agrs;
  if (typeof tagName === "function") {
    return tagName();
  }
  const newEle = document.createElement(tagName);
  Object.keys(props)
    .filter((prop) => !prop.startsWith("__"))
    .forEach((prop) => {
      if (typeof props[prop] == "function") {
        newEle[prop] = props[prop];
      } else {
        newEle.setAttribute(prop, props[prop]);
      }
    });

  children.forEach((child) => {
    try {
      if (["string", "number", "boolean"].includes(typeof child)) {
        newEle.appendChild(document.createTextNode(child));
      } else if (Array.isArray(child)) {
        child.forEach((x) => newEle.appendChild(x));
      } else {
        newEle.appendChild(child);
      }
    } catch (error) {
      console.error("Child is", child);
    }
  });

  return newEle;
}

function App() {
  const [name, setName] = React.useState("Niteco");
  // const [count1, setCount1] = useState(0);
  // const [count2, setCount2] = useState(0);

  return (
    <div className={"test-css"}>
      {/* <p>Test</p>
      <p>Test2</p> */}
      <ButtonTest></ButtonTest>
      {/* {new Array(1).fill(true).map(() => (
        <Welcome />
      ))} */}

      {/* <div>
        <span>{count1}</span>
        <button onclick={() => setCount1(count1 + 1)}>Button 1</button>
      </div>

      <div>
        <span>{count2}</span>
        <button onclick={() => setCount2(count2 + 1)}>Button 2</button>
      </div> */}
    </div>
  );
};

React.render(App, document.querySelector('#app'))