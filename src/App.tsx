import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import {Button} from "./components/Button/Button";
import Options from "./components/OptionItem";
import Slider from "./components/Slider";



const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button/>
        <Slider/>
        <Options/>
        <p>Author : <b><a className="author" href="https://doanlee.com" target="_blank">Doan Le</a></b></p>
      </header>
    </div>
  );
};

export default App;
