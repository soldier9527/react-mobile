import React, { Component} from 'react'
import {Link,withRouter} from 'react-router-dom';


class HomeIndex extends Component {
    constructor(props){
        super(props);
        this.state={
            index:null
        }
        import('./home.js').then(({Home}) => {
            console.log(Home)
           this.setState({
               index:Home
           })
        } ).catch( err => {
            import('./xy01/index.js').then(({Home}) => {
                console.log(Home)
                this.setState({
                    index:Home
                })
            } )

        } )
    }
    render(){
        return(
            <div>
                {/*{this.state.index}*/}
            </div>
        )
    }
}

export default withRouter(HomeIndex)
