import { useState } from "react";
import { Button } from "./shared/ui/button";



function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button onClick={() => setCount((count) => count + 1)} size={"lg"}>
        count is {count}
      </Button>
      <Button onClick={() => setCount((count) => count + 1)} size={"lg"} variant={"ghost"}>
        count is {count}
      </Button>
      <Button onClick={() => setCount((count) => count + 1)} size={"lg"} variant="secondary">
        count is {count}
      </Button>
      <Button onClick={() => setCount((count) => count + 1)} size={"lg"} variant="link">
        count is {count}
      </Button>
      <Button onClick={() => setCount((count) => count + 1)} size={"lg"} variant="destructive">
        count is {count}
      </Button>
    </>
  );
}

export default App;
