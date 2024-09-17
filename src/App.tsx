import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-3">
      <h1 className="font-semibold text-[1rem]">ECHOSTREAM</h1>
      <Button variant={"ghost"}>Click me!</Button>
    </div>
  );
};

export default App;
