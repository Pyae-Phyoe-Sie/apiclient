import React, { Component } from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'
import SimpleCrypto from "simple-crypto-js"
import baseUrl from './Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class TicketList extends Component {
    constructor (props) {
        super(props)

        this.state = {
            ticketList: [],
            user_id: '',
            role: ''
        }

        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.GetSerialNumber = this.GetSerialNumber.bind(this)
        this.GetActionFormat = this.GetActionFormat.bind(this)
        this.create = this.create.bind(this)
        this.ticketDetail = this.ticketDetail.bind(this)
        this.showPrice = this.showPrice.bind(this)
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
            role: cookies.get('role')
        })
    }

    componentDidMount() {
        const cookies = new Cookies();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+cookies.get('token'),
            'Accept': 'application/json'
        }

        const data = {
            role: this.state.role
        };
        
        document.getElementById('loading').style.display = "block";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        baseUrl.post('getTicketList', data, {
            headers: headers,
            // body: body
        })
        .then((response) => {
            // console.log(response.data.success.tickets);
            this.setState({
                ticketList: response.data.success.tickets
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
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    GetSerialNumber (cell, row, index) {
        return (
          <div>
            {index+1}.
          </div>
        );
    }

    showPrice (cell, row, index) {
        return (
          <div>
                {(row.ticket_currency == 1)
                ?
                row.ticket_price+" MMK"
                :
                "$ "+row.ticket_price
                }
          </div>
        );
    }

    GetActionFormat (cell, row, index) {
        return (
            <div>
                {(row.status == 0) ? 
                    (this.state.role == 1) ? 
                        (row.req_status == 0) ? 
                        <FontAwesomeIcon icon={faEye} onClick={() => this.ticketDetail(row.id)} />
                        :
                        <FontAwesomeIcon icon={faEdit} onClick={() => this.ticketDetail(row.id)} />
                    :
                    (this.state.role == 2) ? 
                        (row.req_status == 0) ? 
                        <FontAwesomeIcon icon={faThumbsUp} onClick={() => this.ticketDetail(row.id)} />
                        :
                        <FontAwesomeIcon icon={faEye} onClick={() => this.ticketDetail(row.id)} />
                    :
                    <FontAwesomeIcon icon={faStopwatch} onClick={() => this.ticketDetail(row.id)} />
                :
                (row.status == 1) ? 
                    (this.state.role == 2) ? 
                        (row.req_status == 0) ? 
                        <FontAwesomeIcon icon={faEye} onClick={() => this.ticketDetail(row.id)} />
                        :
                        <FontAwesomeIcon icon={faEdit} onClick={() => this.ticketDetail(row.id)} />
                    :
                    (this.state.role == 3) ? 
                        (row.req_status == 0) ? 
                        <FontAwesomeIcon icon={faThumbsUp} onClick={() => this.ticketDetail(row.id)} />
                        :
                        <FontAwesomeIcon icon={faEye} onClick={() => this.ticketDetail(row.id)} />
                    :
                    <FontAwesomeIcon icon={faStopwatch} onClick={() => this.ticketDetail(row.id)} />
                :
                <FontAwesomeIcon icon={faCheck} onClick={() => this.ticketDetail(row.id)} />
                // <FontAwesomeIcon icon={faShieldAlt} onClick={() => this.ticketDetail(row.id)} />
                }
            </div>
        );
    }

    create(event) {
        event.preventDefault();
        const { history } = this.props
        history.push('/create')
    }

    ticketDetail(id) {
        const { history } = this.props;
        let _secretKey = "abcd123";
    
        let simpleCrypto = new SimpleCrypto(_secretKey);
        let chiperText = simpleCrypto.encrypt(id);

        var check = chiperText.includes("+");
        if (check) {
            this.ticketDetail(id);
        } else {
            history.push('/detail?id='+chiperText);
        }
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
        const {ticketList} = this.state;
        const columns = [{
            text: 'Action', 
            editable: false,
            align: "center", 
            headerStyle: { width: 120 }, 
            formatter: this.GetActionFormat,
        }, {
            dataField: '',
            text: 'Sr.',
            editable: false,
            formatter: this.GetSerialNumber,
        }, {
            dataField: 'ticket_name',
            text: 'Name'
        }, {
            dataField: '',
            text: 'Price',
            editable: false,
            formatter: this.showPrice,
        }, {
            dataField: 'ticket_desc',
            text: 'Description'
        }];

        return (
        <div className="login-form">
            <div className="flex-box">
                <div className="box-shadow-light">
                    {(this.state.role == 1) ?
                    <div className="cus-form-control">
                        <button type="button" className="btn-green" onClick={this.create}>Create <FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                    :
                    ''
                    }
                    <BootstrapTable keyField='id' data={ticketList} columns={ columns } pagination={ paginationFactory() } />
                </div>
            </div>
        </div>
        )
    }
}

export default TicketList