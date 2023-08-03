import React     from 'react'
import Info      from "./info/info";
import {devider} from "../../styleTemplates/devider";


const App = (): JSX.Element => {

    return <div style={{width: '500px', minHeight: '500px'}}>
        <Info/>
        <div style={devider}/>
    </div>
}

export default App
