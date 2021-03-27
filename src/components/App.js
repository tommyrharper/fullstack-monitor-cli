import React from "react";

const App = ({ props }) => {
  fetch('/apiTest').then((res) => res.json()).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log('there was an error: ', err);
  });
  return <div>Webpack HMR Example</div>;
};

export default App;
