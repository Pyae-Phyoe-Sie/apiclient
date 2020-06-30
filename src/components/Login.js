import React, { Component } from 'react'
import Banner from './banner.png';
import './App.css';
import Cookies from 'universal-cookie';
import { Notification } from 'rsuite'
import baseUrl from './Api';

class Login extends Component {
    constructor (props) {
        super(props)

        this.state = {
            email: '',
            password: '',
        }

        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.login = this.login.bind(this)
        this.signUp = this.signUp.bind(this)
        // this.hasErrorFor = this.hasErrorFor.bind(this)
        // this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    componentWillMount() {
        const cookies = new Cookies();
        const { history } = this.props
        var myToken = cookies.get('token') || false;
        if (myToken == false) {
            history.push('/login')
        }
        else if (myToken !== "") {
            history.push('/create')
        }
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    login (event) {
        event.preventDefault();
        const cookies = new Cookies();
        const { history } = this.props
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'JWT fefege...'
        }

        const data = {
            email: this.state.email,
            password: this.state.password
        };

        // const body = `email=soe@gmail.com&password=123456789`;
        document.getElementById('loading').style.display = "block";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        baseUrl.post('login', data, {
            headers: headers,
            // body: body
        })
        .then((response) => {
            // console.log(response.data.success.user.id);
            if (response.status == 200) {
                cookies.set('token', response.data.success.token, { path: '/' });
                cookies.set('user_id', response.data.success.user.id, { path: '/' });
                cookies.set('role', response.data.success.user.role, { path: '/' });
                cookies.set('email', response.data.success.user.email, { path: '/' });

                Notification.success({
                    title: 'Login is successful.',
                    duration: 3000,
                    placement: 'bottomEnd',
                });

                document.getElementById("check-again").click();
                history.push('/list')
            }

            if (response.status == 201) {
                Notification.success({
                    title: response.data.success.msg,
                    duration: 3000,
                    placement: 'bottomEnd',
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .then(function () {
            document.getElementsByTagName("body")[0].style.overflow = "auto";
            document.getElementById("loading").style.display = "none";
        });

        // console.log(cookies.get('token'));
    }

    signUp() {
        const { history } = this.props
        history.push('/signup')
    }

    render () {
        return (
        <div className="login-form">
            <form onSubmit={this.login}>
                <div className="ticket flex-box">
                    <img src={Banner} className="login-photo"/>
                    <div>
                    <h1>Login</h1>
                        <div className="cus-form-control flex-div flex-column">
                            <input type="text" name="email" onChange={this.handleFieldChange} value={this.state.email} required/>
                            <label>Email Address</label>
                        </div>

                        <div className="cus-form-control flex-div flex-column">
                            <input type="password" name="password" onChange={this.handleFieldChange} required/>
                            <label>Password</label>
                        </div>

                        <div className="cus-form-control">
                            <button type="submit">Login</button>
                            <div>
                                <span onClick={this.signUp} className="signup">Sign Up</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        )
    }
}

export default Login
