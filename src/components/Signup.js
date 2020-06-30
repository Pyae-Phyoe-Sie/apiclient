import React, { Component } from 'react'
import { Notification } from 'rsuite'
import baseUrl from './Api'

class Signup extends Component {
    constructor (props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            role: 1,
            password: '',
            c_password: '',
        }

        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        // this.hasErrorFor = this.hasErrorFor.bind(this)
        // this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    register(event) {
        event.preventDefault();
        const { history } = this.props
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'JWT fefege...'
        }

        const data = {
            name: this.state.name,
            email: this.state.email,
            role: this.state.role,
            password: this.state.password,
            c_password: this.state.c_password
        };

        // const body = `email=soe@gmail.com&password=123456789`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('loading').style.display = "block";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        baseUrl.post('register', data, {
            headers: headers,
            // body: body
        })
        .then((response) => {
            // console.log(response.data.success.user.id);
            if (response.status == 200) {
                Notification.success({
                    title: 'Your account is registered',
                    duration: 3000,
                    placement: 'bottomEnd',
                });
                history.push('/login')
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

    login() {
        const { history } = this.props
        history.push('/login')
    }

    render () {
        return (
        <div className="login-form">
            <form onSubmit={this.register}>
                <div className="ticket flex-box">
                    <div>
                    <h1>Sign Up</h1>
                        <div className="cus-form-control flex-div flex-column">
                            <input type="text" name="name" onChange={this.handleFieldChange} value={this.state.name} required/>
                            <label>Name</label>
                        </div>

                        <div className="cus-form-control flex-div flex-column">
                            <input type="text" name="email" onChange={this.handleFieldChange} value={this.state.email} required/>
                            <label>Email Address</label>
                        </div>

                        <div className="cus-form-control flex-div flex-column">
                            <select name="role" value={this.state.role} onChange={this.handleFieldChange}>
                                <option value="1">Staff</option>
                                <option value="2">Supervisor</option>
                                <option value="3">Leader</option>
                            </select>
                        </div>

                        <div className="cus-form-control flex-div flex-column">
                            <input type="password" name="password" onChange={this.handleFieldChange} required/>
                            <label>Password</label>
                        </div>

                        <div className="cus-form-control flex-div flex-column">
                            <input type="password" name="c_password" onChange={this.handleFieldChange} required/>
                            <label>Confirm Password</label>
                        </div>

                        <div className="cus-form-control">
                            <button type="submit">Sign Up</button>
                            <div>
                                <span onClick={this.login} className="signup">Login</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        )
    }
}

export default Signup
