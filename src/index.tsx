import ButtonTest from "./ButtonTest";
import Welcome from "./Wellcome";
// import FikeNode, { renderFikeTree } from "./fiberLike/FikeNode";
import FiberLike, { FikeNodeStruct } from "./fiberLike";

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
export const React = {
  createElement: FiberLike.createElement,
};

const states = [];
let index = 0;

export function useState(initialState) {
  let state;
  if (states[index] !== undefined) {
    state = states[index];
  } else {
    state = initialState;
    states[index] = initialState;
  }

  let savedIndex = index;
  const setState = (value) => {
    if (typeof value === "function") {
      states[savedIndex] = value(states[savedIndex]);
    } else {
      states[savedIndex] = value;
    }
    reRender();
  };

  index++;
  return [state, setState];
}

const App = () => {
  const [name, setName] = useState("Niteco");
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

function render(FC, container) {
  container.innerHTML = "";
  FiberLike.render(FC(), container);
  // container.appendChild();
}

const reRender = () => {
  console.time("reRender");
  index = 0;
  render(App, document.querySelector("#app"));
  console.timeEnd("reRender");
};

reRender();
