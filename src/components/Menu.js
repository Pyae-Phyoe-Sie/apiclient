import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { Notification } from 'rsuite'

class Menu extends Component {
    constructor (props) {
        super(props)

        this.state = {
            token: false
        }

        this.logout = this.logout.bind(this)
        this.checkAgain = this.checkAgain.bind(this)
    }

    componentWillMount() {
        const cookies = new Cookies();
        this.setState({
            token: cookies.get('token') || false
        })
    }

    checkAgain() {
        const cookies = new Cookies();
        this.setState({
            token: cookies.get('token') || false
        })
    }

    logout() {
        const cookies = new Cookies();
        cookies.remove("token");
        cookies.remove('user_id');
        cookies.remove('role');
        cookies.remove('email');

        this.setState({
            token: false
        })

        Notification.success({
            title: 'Logout is successful.',
            duration: 3000,
            placement: 'bottomEnd',
        });

        document.getElementById("login").click();
    }

    render () {
        let unloginShow, loginShow;
        if (this.state.token === false) {
            unloginShow = "show";
            loginShow = "hide";
        } else {
            unloginShow = "hide";
            loginShow = "show";
        }

        return (
        <div className="menu-div box-shadow-light">
            <ul>
                <span className="hide" id="check-again" onClick={this.checkAgain}></span>
                <Link to="/login" id="login"><li className={unloginShow}>Login</li></Link>
                {/* <Link to="/create" id="create"><li className={loginShow}>Ticket</li></Link> */}
                <Link to="/list" id="list"><li className={loginShow}>Ticket List</li></Link>
                <a><li onClick={this.logout} className={loginShow}>Logout</li></a>
            </ul>
        </div>
        )
    }
}

export default Menu
