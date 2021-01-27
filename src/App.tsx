import * as React from "react";
import logo from "./logo.svg";
import night_icon from "./night_icon.svg";
import "./App.css";
import {Button} from "./components/Button/Button";
import Options from "./components/OptionItem";
import Slider from "./components/Slider";
import Background from "./components/Background";



const App = () => {
  return (
    <>
      <div className="Main">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Button/>
            <Slider/>
            <Options/>
          </header>
        </div>
        <div className="App">
          <header className="App-header">
            <img src={night_icon} className="App-night-icon" alt="logo" />
          </header>
          <Background/>
        </div>
      </div>
      <p className="author_p">Author : <b><a className="author" href="https://doanlee.com" target="_blank">Doan Le</a></b></p>
    </>
  );
};

export default App;
