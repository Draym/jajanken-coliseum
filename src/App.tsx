import './App.scss';
import HomeView from "./web/views/HomeView";
import React, {Component} from 'react';
import Web3Utils from "./blockchain/Web3Utils";
import Navbar from "./web/views/Navbar";

import {library} from '@fortawesome/fontawesome-svg-core'
import {faGithub, faLinkedinIn} from '@fortawesome/free-brands-svg-icons';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import JaJankenColiseum from "./web/views/coliseum/JaJankenColiseum";

library.add(faGithub, faLinkedinIn);


interface AppProperties {
}

interface AppState {
    account: string,
    loading: boolean
}

export default class App extends Component<AppProperties, AppState> {
    constructor(props: AppProperties) {
        super(props)
        this.state = {
            account: '0x0',
            loading: true
        }
    }

    async componentDidMount() {
        await Web3Utils.loadMetamask()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const accounts = await Web3Utils.getAccounts()
        this.setState({account: accounts[0], loading: false})
    }

    render() {
        if (this.state.loading) {
            return <div className="animated fadeIn pt-1 text-center">Loading...</div>
        } else {
            return <div className="App">
                <Navbar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '100%'}}>
                            <BrowserRouter>
                                <Switch>
                                    <Route path={"/coliseum"}>
                                        <JaJankenColiseum account={this.state.account}/>
                                    </Route>
                                    <Route path={"/"}>
                                        <HomeView/>
                                    </Route>
                                </Switch>
                            </BrowserRouter>
                        </main>
                    </div>
                </div>
            </div>
        }
    }
}