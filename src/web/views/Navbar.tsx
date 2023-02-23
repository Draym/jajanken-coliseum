import React, {Component} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

type NavbarProperties = {
    account: String,
}
type NavbarState = {
    account: String,
    loading: Boolean
}

export default class Navbar extends Component<NavbarProperties, NavbarState> {
    constructor(props: NavbarProperties) {
        super(props)
        this.state = {
            account: props.account,
            loading: true
        }
    }

    async componentDidMount() {
        this.setState({loading: false})
    }

    render() {
        return <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0">
            <div className="col-md-2">
                <a className="navbar-brand"
                   href="https://github.com/Draym/jajanken-evm"
                   target="_blank"
                   rel="noopener noreferrer">
                    <span><FontAwesomeIcon icon={['fab', "github"]}/> smart-contracts</span>
                </a>
            </div>
            <div className="col-md-4">
                <small id="wallet-address" className="text-white bg-dark">{this.props.account}</small>
            </div>
        </nav>
    }
}