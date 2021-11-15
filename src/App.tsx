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
    networkId: number | null,
    account: string,
    loading: boolean
}

export default class App extends Component<AppProperties, AppState> {
    constructor(props: AppProperties) {
        super(props)
        this.state = {
            networkId: null,
            account: '0x0',
            loading: true
        }
    }

    async componentDidMount() {
        let metamaskLoaded = await Web3Utils.loadMetamask()
        if (metamaskLoaded) {
            await this.loadBlockchainData()
            await this.listenNetworkChanges()
        }
    }

    async loadBlockchainData() {
        const accounts = await Web3Utils.getAccounts()
        let networkId = await Web3Utils.getNetwork()
        console.log("accounts: ", accounts)
        this.setState({account: accounts[0], loading: false, networkId: networkId})
    }

    async listenNetworkChanges() {
        Web3Utils.getEth().on('chainChanged', (chainId: number) => {
            this.setState({networkId: chainId})
        })
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
                                    {this.state.networkId != null &&
                                    <Route path={"/coliseum"}>
                                        <JaJankenColiseum account={this.state.account} network={this.state.networkId}/>
                                    </Route>
                                    }
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