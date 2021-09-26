import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
        return <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="https://github.com/Draym/jajanken-evm"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span><FontAwesomeIcon icon={['fab', "github"]}/> Game Contracts</span>
                </a>

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small className="text-secondary">
                            <small id="account">{this.props.account}</small>
                        </small>
                    </li>
                </ul>
            </nav>
    }
}