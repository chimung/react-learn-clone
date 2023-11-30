import React from "./React";

function sleepms(value) {
  const start = Date.now();
  while (Date.now() < start + value) {}
}
export default function ButtonTest() {
  const [isTrigger, setTrigger] = React.useState(false);
  const [count, setCount] = React.useState(0);

  function sleepAndWrite() {
    for (let i = 0; i < 100; i++) {
      setCount((value) => value + 1);
      sleepms(10);
    }
  }

  function sleepAndWriteTimeOut() {
    let count = 0;
    const handler = () =>
      setTimeout(() => {
        setCount((value) => value + 1);
        sleepms(10);
        count += 1;
        if (count < 100) {
          handler();
        }
      }, 1000 / 60);

    handler();
    // for (let i = 0; i < 100; i++) {
    //   setCount((value) => value + 1);
    //   sleepms(10);
    // }
  }

  const trigger = () => {
    sleepAndWriteTimeOut();
    // isTrigger ? setTrigger(false) : setTrigger(true);
  };

  function somethingTakeTime() {
    sleepms(10);
  }

  function onlyForThenable() {
    sleepms(15);
  }

  function sleepWithChunk(total) {
    let count = 0;

    return () => {
      const handler = () =>
        count < total &&
        requestIdleCallback((timeoutObj) => {
          while (timeoutObj.timeRemaining() > 10) {
            sleepms(5);
            count += 1;
          }
          handler();
        });

      handler();
    };
  }

  const triggerRAF = () => {
    let count = 0;
    const handler = () =>
      requestAnimationFrame(() => {
        setCount((value) => value + 1);
        // sleepms(30);
        count += 1;
        // setTimeout(somethingTakeTime, 0);
        // Promise.resolve().then(onlyForThenable);
        if (count < 100) {
          handler();
        }
      });

    handler();

    // const otherTask = sleepWithChunk(1000);
    // otherTask();
  };

  function triggerNormal() {
    for (let i = 0; i < 100; i++) setCount((i) => i + 1);
  }

  console.log("render count", count);
  return (
    <div>
      <p>{count}</p>
      <button onclick={trigger}>Tigger by Timeout</button>
      <button onclick={triggerRAF}>Tigger by rAF</button>
      <button onclick={triggerNormal}>Tigger Nomarl</button>
    </div>
  );
}
