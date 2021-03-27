import React from "react";
import "../index.css";
import { Button } from "@chakra-ui/react";

const App = ({ props }) => {
  fetch("/apiTest")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log("there was an error: ", err);
    });
  return (
    <div>
      <Button>Yo</Button>
      Hello World
    </div>
  );
};

export default App;
