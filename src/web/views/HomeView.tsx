import React, {Component} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {BackgroundImd} from "../../resources/images"

interface HomeViewProperties extends RouteComponentProps {
}

interface HomeViewState {
    loading: Boolean
}

class HomeView extends Component<HomeViewProperties, HomeViewState> {

    constructor(props: HomeViewProperties) {
        super(props)
        this.state = {
            loading: true
        }
    }

    componentDidMount = async () => {
        this.setState({loading: false})
    }

    startColiseum = async () => {
        this.props.history.push('/coliseum')
    }

    render() {
        if (this.state.loading) {
            return <p id="loader" className="text-center">Loading...</p>
        } else {
            return <div>
                <div className="row horizontal-align">
                    <img id="main-img" src={BackgroundImd.jajanken} alt=""></img>
                </div>
                <div className="row horizontal-align">
                    <img id="title-img" src={BackgroundImd.title} alt=""></img>
                </div>
                <div className="row horizontal-align">
                    <button className="btn-info fw-bold" onClick={this.startColiseum}>Join Coliseum</button>
                </div>
            </div>
        }
    }
}

export default withRouter(HomeView)