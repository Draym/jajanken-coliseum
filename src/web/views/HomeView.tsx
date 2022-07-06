import React, {Component} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"


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
                <button className="btn-info h-align h-center" onClick={this.startColiseum}>Launch Coliseum</button>
            </div>
        }
    }
}

export default withRouter(HomeView)