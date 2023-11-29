import { useState, React } from "./index";

export default function Welcome() {
  const [name, setName] = useState("Niteco");
  return (
    <div>
      <h2>Hello {name}</h2>
      <input
        type="text"
        placeholder="Content here"
        onchange={(e) => {
          setName(e.target.value);
        }}
      />
    </div>
  );
}
