import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import SimpleCrypto from "simple-crypto-js"
import queryString from 'query-string'
import { Notification } from 'rsuite'
import baseUrl from './Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

class TicketUpdate extends Component {
    constructor (props) {
        super(props)

        this.state = {
            ticket_id: '',
            ticket_name: '',
            ticket_price: '',
            ticket_desc: '',
            ticket_status: 0,
            ticket_req_status: '',

            ticket_currency: 1,
            old_ticket_currency: '',

            show_price_mmk: '',
            show_price_dollar: '',

            user_id: '',
            role: '',
            email: ''
        }

        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.createTicket = this.createTicket.bind(this)
        this.requestInfo = this.requestInfo.bind(this)
        this.back = this.back.bind(this)
        this.updateTicket = this.updateTicket.bind(this)
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

        this.setState({
            user_id: cookies.get('user_id'),
            role: cookies.get('role'),
            email: cookies.get('email')
        })
    }

    componentDidMount() {
        let params = queryString.parse(this.props.location.search);
        const cookies = new Cookies();
        const { history } = this.props
        
        if (Object.entries(params).length > 0) {
            let _secretKey = "abcd123";
    
            let simpleCrypto = new SimpleCrypto(_secretKey);
            let ticketId = simpleCrypto.decrypt(params.id);

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+cookies.get('token'),
                'Accept': 'application/json'
            }

            const data = {
                id: ticketId
            };

            // const body = `email=soe@gmail.com&password=123456789`;
            document.getElementById('loading').style.display = "block";
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
            baseUrl.post('ticketDetail', data, {
                headers: headers,
                // body: body
            })
            .then((response) => {
                // console.log(response.data);
                this.setState({
                    ticket_id: response.data.success.ticket[0].id,
                    ticket_name: response.data.success.ticket[0].ticket_name,
                    old_ticket_currency: response.data.success.ticket[0].ticket_currency,
                    ticket_price: response.data.success.ticket[0].ticket_price,
                    ticket_desc: response.data.success.ticket[0].ticket_desc,
                    ticket_status: response.data.success.ticket[0].status,
                    ticket_req_status: response.data.success.ticket[0].req_status,
                })
                // cookies.set('token', response.data.success.token, { path: '/' });
                
            })
            .catch((error) => {
                console.log(error);
            })
            .then(function () {
                document.getElementsByTagName("body")[0].style.overflow = "auto";
                document.getElementById("loading").style.display = "none";
            });
        } else {
            if (cookies.get('role') != 1) {
                history.push('/list')
            }
        }
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    createTicket (event) {
        event.preventDefault();
        const { history } = this.props
        const cookies = new Cookies();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+cookies.get('token'),
            'Accept': 'application/json'
        }

        if (this.state.role == 1) {
            const data = {
                ticket_name: this.state.ticket_name,
                ticket_price: this.state.ticket_price,
                ticket_desc: this.state.ticket_desc,
                ticket_currency: this.state.ticket_currency,
                email: this.state.email,
                user_id: this.state.user_id,
            };

            // const body = `email=soe@gmail.com&password=123456789`;
            document.getElementById('loading').style.display = "block";
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
            baseUrl.post('create', data, {
                headers: headers,
                // body: body
            })
            .then((response) => {
                // console.log(response.status);
                // cookies.set('token', response.data.success.token, { path: '/' });
                if (response.status == 200) {
                    Notification.success({
                        title: 'Ticket is successfully created.',
                        duration: 3000,
                        placement: 'bottomEnd',
                    });
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
        } else {
            const data = {
                role: this.state.role,
                ticket_id: this.state.ticket_id,
                email: this.state.email
            };

            // const body = `email=soe@gmail.com&password=123456789`;
            
            document.getElementById('loading').style.display = "block";
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
            baseUrl.post('approveTicket', data, {
                headers: headers,
                // body: body
            })
            .then((response) => {
                // console.log(response.data.success);
                // cookies.set('token', response.data.success.token, { path: '/' });
                if (response.status == 200) {
                    Notification.success({
                        title: 'Approve is successfully saved.',
                        duration: 3000,
                        placement: 'bottomEnd',
                    });
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
        }

        // console.log(cookies.get('token')); 
    }

    requestInfo(event) {
        event.preventDefault();
        const { history } = this.props
        const cookies = new Cookies();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+cookies.get('token'),
            'Accept': 'application/json'
        }

        const data = {
            role: this.state.role,
            ticket_id: this.state.ticket_id,
            email: this.state.email
        };

        // const body = `email=soe@gmail.com&password=123456789`;
        document.getElementById('loading').style.display = "block";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        baseUrl.post('requestTicketInfo', data, {
            headers: headers,
            // body: body
        })
        .then((response) => {
            // console.log(response.data.success.ticket[0].id);
            if (response.status == 200) {
                Notification.success({
                    title: 'Request is successfully saved.',
                    duration: 3000,
                    placement: 'bottomEnd',
                });
                history.push('/list')
            }

            if (response.status == 201) {
                Notification.success({
                    title: response.data.success.msg,
                    duration: 3000,
                    placement: 'bottomEnd',
                });
            }
            // cookies.set('token', response.data.success.token, { path: '/' });
            
        })
        .catch((error) => {
            console.log(error);
        })
        .then(function () {
            document.getElementsByTagName("body")[0].style.overflow = "auto";
            document.getElementById("loading").style.display = "none";
        });
    }

    back(event) {
        event.preventDefault();
        const { history } = this.props
        history.push('/list')
    }

    updateTicket(event) {
        event.preventDefault();
        const { history } = this.props
        const cookies = new Cookies();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+cookies.get('token'),
            'Accept': 'application/json'
        }

        const data = {
            ticket_id: this.state.ticket_id,
            ticket_name: this.state.ticket_name,
            ticket_price: this.state.ticket_price,
            ticket_desc: this.state.ticket_desc,
            ticket_currency: this.state.ticket_currency,
            email: this.state.email
        };

        // const body = `email=soe@gmail.com&password=123456789`;
        document.getElementById('loading').style.display = "block";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        baseUrl.post('updateTicketInfo', data, {
            headers: headers,
            // body: body
        })
        .then((response) => {
            // console.log(response.status);
            if (response.status == 200) {
                Notification.success({
                    title: 'Ticket is successfully updated.',
                    duration: 3000,
                    placement: 'bottomEnd',
                });
                history.push('/list')
            }

            if (response.status == 201) {
                Notification.success({
                    title: response.data.success.msg,
                    duration: 3000,
                    placement: 'bottomEnd',
                });
            }
            // cookies.set('token', response.data.success.token, { path: '/' });
            
        })
        .catch((error) => {
            console.log(error);
        })
        .then(function () {
            document.getElementsByTagName("body")[0].style.overflow = "auto";
            document.getElementById("loading").style.display = "none";
        });
    }

    // hasErrorFor (field) {
    //     return !!this.state.errors[field]
    // }

    // renderErrorFor (field) {
    //     if (this.hasErrorFor(field)) {
    //     return (
    //         <span className='invalid-feedback'>
    //         <strong>{this.state.errors[field][0]}</strong>
    //         </span>
    //     )
    //     }
    // }

    render () {
        var select = "";
        if (this.state.old_ticket_currency == 1 || this.state.old_ticket_currency == "") {
                select = <select name="ticket_currency" onChange={this.handleFieldChange}>
                    <option value="1" selected>MMK</option>
                    <option value="2">$</option>
                </select>;
        } else {
                select = <select name="ticket_currency" onChange={this.handleFieldChange}>
                    <option value="1">MMK</option>
                    <option value="2" selected>$</option>
                </select>;
        }

        console.log(this.state.ticket_req_status)
        return (
        <div className="login-form">
            <form onSubmit={this.createTicket}>
                <div className="ticket flex-box">
                    <div className="box-shadow-light">
                        {(this.state.ticket_status == 0) ? 
                            (this.state.role == 1) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <h1>Ticket</h1>
                                :
                                <h1>Ticket Update</h1>
                            :
                            (this.state.role == 2) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <h1>Ticket Approve</h1>
                                :
                                <h1>Ticket</h1>
                            :
                            <h1>Ticket</h1>
                        :
                        (this.state.ticket_status == 1) ? 
                            (this.state.role == 2) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <h1>Ticket</h1>
                                :
                                <h1>Ticket Update</h1>
                            :
                            (this.state.role == 3) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <h1>Ticket Approve</h1>
                                :
                                <h1>Ticket</h1>
                            :
                            <h1>Ticket</h1>
                        :
                        <h1>Ticket</h1>
                        }

                        {(this.state.ticket_status == 2) ? 
                            <div className="fa-check-bg">
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                        :
                            ''
                        }

                        <div className="cus-form-control flex-div flex-column">
                            {(this.state.role == 1) ? 
                                (this.state.ticket_req_status != 0 && this.state.ticket_status == 0) ?
                                <input type="text" name="ticket_name" onChange={this.handleFieldChange} value={this.state.ticket_name} required />
                                :
                                <input type="text" name="ticket_name" onChange={this.handleFieldChange} value={this.state.ticket_name} required disabled/>
                            :
                            <input type="text" name="ticket_name" onChange={this.handleFieldChange} value={this.state.ticket_name} required disabled/>
                            }
                            <label>Ticket Name</label>
                        </div>

                        
                        {(this.state.role == 1) ?
                            (this.state.old_ticket_currency == '' || this.state.ticket_req_status == 1) ? 
                            <div className="cus-form-control flex-div flex-column">
                                {select}
                            </div>
                            :
                            ''
                        :
                        ''
                        }

                        <div className="cus-form-control flex-div flex-column">
                            {(this.state.role == 1) ? 
                                (this.state.ticket_req_status != 0 && this.state.ticket_status == 0) ? 
                                <input type="text" name="ticket_price" onChange={this.handleFieldChange} value={(this.state.old_ticket_currency == 1) ? (this.state.ticket_req_status == 1) ? this.state.ticket_price : this.state.ticket_price+" MMK" : (this.state.old_ticket_currency == '') ? this.state.ticket_price : (this.state.ticket_req_status == 1) ? this.state.ticket_price : "$ "+this.state.ticket_price} required/>
                                : 
                                <input type="text" name="ticket_price" onChange={this.handleFieldChange} value={(this.state.old_ticket_currency == 1) ? (this.state.ticket_req_status == 1) ? this.state.ticket_price : this.state.ticket_price+" MMK" : (this.state.old_ticket_currency == '') ? this.state.ticket_price : "$ "+this.state.ticket_price} required disabled/>
                            :
                            <input type="text" name="ticket_price" onChange={this.handleFieldChange} value={(this.state.old_ticket_currency == 2) ? "$ "+this.state.ticket_price : (this.state.old_ticket_currency == '') ? this.state.ticket_price : this.state.ticket_price+" MMK"} required disabled/>
                            }
                            <label>Ticket Price</label>
                        </div>

                        <div className="cus-form-control flex-div flex-column">
                            {(this.state.role == 1) ? 
                                (this.state.ticket_req_status != 0 && this.state.ticket_status == 0) ?
                                <input type="text" name="ticket_desc" onChange={this.handleFieldChange} value={this.state.ticket_desc} required/>
                                :
                                <input type="text" name="ticket_desc" onChange={this.handleFieldChange} value={this.state.ticket_desc} required disabled/>
                            :
                            <input type="text" name="ticket_desc" onChange={this.handleFieldChange} value={this.state.ticket_desc} required disabled/>
                            }
                            <label>Ticket Description</label>
                        </div>

                        {(this.state.ticket_status == 0) ? 
                            (this.state.role == 1) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                                :
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.updateTicket}>Update</button>
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                            :
                            (this.state.role == 2) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.requestInfo}>More Info</button>
                                    <button type="submit">Approve</button>
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                                :
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                            :
                            <div className="cus-form-control space-around-flex-box">
                                <button type="button" onClick={this.back}>Cancel</button>
                            </div>
                        :
                        (this.state.ticket_status == 1) ? 
                            (this.state.role == 2) ? 
                                (this.state.ticket_req_status == 0) ? 
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                                :
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.requestInfo}>More Info</button>
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                            :
                            (this.state.role == 3) ? 
                                (this.state.ticket_req_status == 0) ?  
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.requestInfo}>More Info</button>
                                    <button type="submit">Approve</button>
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                                :
                                <div className="cus-form-control space-around-flex-box">
                                    <button type="button" onClick={this.back}>Cancel</button>
                                </div>
                            :
                            <div className="cus-form-control space-around-flex-box">
                                <button type="button" onClick={this.back}>Cancel</button>
                            </div>
                        :
                        (this.state.ticket_status == 2) ?
                        <div className="cus-form-control space-around-flex-box">
                            <button type="button" onClick={this.back}>Cancel</button>
                        </div>
                        :
                        <div className="cus-form-control space-around-flex-box">
                            <button type="submit">Save</button>
                            <button type="button" onClick={this.back}>Cancel</button>
                        </div>
                        }

                        {/* {(this.state.role == 1)
                        ?
                        <div className="cus-form-control space-around-flex-box">
                            {(this.state.ticket_req_status == 1)
                            ? 
                                <button type="submit">Update</button>
                            :
                                ''
                            }
                            <button type="button" onClick={this.back}>Cancel</button>
                        </div>
                        :
                        (this.state.role == 2)
                        ?
                        <div className="cus-form-control space-around-flex-box">
                            <button type="button" onClick={this.requestInfo}>More Info</button>
                            <button type="submit">Approve</button>
                            <button type="button" onClick={this.back}>Cancel</button>
                        </div>
                        :
                        <div className="cus-form-control space-around-flex-box">
                            <button type="button" onClick={this.requestInfo}>More Info</button>
                            <button type="submit">Host</button>
                            <button type="button" onClick={this.back}>Cancel</button>
                        </div>
                        } */}
                    </div>
                </div>
            </form>
        </div>
        )
    }
}

export default TicketUpdate