import React from 'react';
import './scss/airplane.scss';
// import {HashRouter, Route, Switch} from "react-router-dom";
// import {constData6x4, constData9x5, constData9x6} from "./redux/store";
// import {GameComponent} from "./components/Game";
import Param from "./components/Param/Param";
import s from "./App.module.css";
import StartAndEnd from "./components/Pult/startAndEnd";
import Result from "./components/Result/result";
import Cabin from "./components/Cabin/cabin";
import Pult from "./components/Pult/Pult";
import Secret from "./components/secret/secret";
import GameSelect from "./components/GameSelect/gameSelect";
import RandomStat from "./RandomStat/randomStat"

// const dial = '/#1/abc'
const App = (props) => {
    /*
        <HashRouter>
            <Switch>
                <Route path='/param' render={() => <GameComponent GameParam={constData9x6} Game={props.game} haveParamComponent/>}/>
                <Route path='/9x6' render={() => <GameComponent GameParam={constData9x6} Game={props.game}/>}/>
                <Route path='/9x5' render={() => <GameComponent GameParam={constData9x5} Game={props.game}/>}/>
                <Route path='/6x4' render={() => <GameComponent GameParam={constData6x4} Game={props.game}/>}/>
                <Route path='/' render={() => <GameComponent GameParam={constData9x6} Game={props.game}/>}/>
            </Switch>
        </HashRouter>
    */
    // let path = document.location.pathname
    const paramComponent = props.game.haveParamComponent () ? <Param game={props.game}/> : <div/>
    if (props.game.isStatistic)
        return <div>
            <RandomStat game = {props.game}/>
        </div>
    else
    return (
        <div className={s.GameField}>
            <GameSelect game={props.game}/>
            {paramComponent}
            <StartAndEnd game={props.game}/>
            <Result game={props.game}/>
            <Cabin game={props.game}/>
            <Pult game={props.game}/>
            <Secret game={props.game}/>
        </div>
    );
};

export default App;
