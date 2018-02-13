import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import Notifications from 'react-notification-system-redux';
import { register, socialLogin, checkAuthStatus, showNotification} from '../actions/auth/auth_actions';
import {auth} from '../../config/firebase_config';
import '../style/style.css';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unsubscribeAuthListener : null,
        }
    }

    /**
     * If user has logged in on other tab, put them to dashboard
     *
     * @memberof Login
     */
    handleLoggedInState() {
        this
            .props
            .history
            .push("dashboard");
    }

    /**
     * If user is not logged in, start auth listener
     */
    startAuthListener() {
        const unsubscribeAuthListener = auth().onAuthStateChanged((user) => {
            if (user) {
                this.handleLoggedInState();
            }
        });
        this.setState({
            unsubscribeAuthListener
        });
    }

    /**
     * Unsubscribe from auth listener
     *
     * @memberof Login
     */
    componentWillUnmount() {
        if (this.state.unsubscribeAuthListener)
            this.state.unsubscribeAuthListener();
    }

    /**
     * On load of loading page, check if user is logged in, put to dashboard,
     * Start auth listener too, so if user logs in with other tab put them to dashboard
     *
     * @memberof Login
     */
    componentWillMount() {
        this
                .props
                .checkAuthStatus()
                .then(() => {
                    const user = this.props.auth.data;
                    if (user && user.uid) {
                        this
                            .props
                            .history
                            .push("dashboard");
                    } else {

                        this.startAuthListener();
                    }
                })
                .catch(() => {
                    this.startAuthListener();
                });
    }
    /**
     * Render redux form field
     *
     * @param {any} field
     * @returns
     * @memberof Register
     */
    renderField(field) {
        const {
            meta: {
                touched,
                error
            }
        } = field;
        const className = `form-group has-feedback ${touched && error
                ? 'has-error'
                : ''}`;
        const inputClassName = `glyphicon ${field.icon} form-control-feedback`;
        let fieldContent = null;
        switch (field.type) {
            default:
            {
                fieldContent = (<input
    className={`form-control ${field.extraClass}`}
    type={field.type}
    placeholder={field.placeholder}
    {...field.input}/>);
                break;
            }
        }
        return (
                    <div className={className}>
                    {fieldContent}
                    <span className={inputClassName}></span>
                    <div className="help-block help-text">
                        {touched
                                ? error
                                        : ''}
                    </div>
                </div>
                )
    }
    /**
     * redux form field
     *
     * @memberof Submit Form
     */
    onSubmit = (props) => {
        this
                .props
                .register({...props})
                .then(() => {
                    this.setState({emailVerified: true});
                })
                .catch((error) => {
                    this
                            .props
                            .showNotification("Error", error.message, true);
                });
    }
    handleSocialButtons(provider) {
        this
                .props
                .socialLogin(provider)
                .then(() => {
                    this
                            .props
                            .history
                            .push("/");
                })
                .catch((error) => {
                    this
                            .props
                            .showNotification("Error", error.message, true);
                });
    }
    render() {
        const {handleSubmit, pristine, submitting} = this.props;
        return(
                <div className="register-page">
                    <div className="register-box">
                        <Notifications notifications={this.props.notifications}/>
                        <div className="register-logo">
                            <a href="#">Register</a>
                        </div>
                        <div className="register-box-body">
                            <p className="login-box-msg">Register a new member</p>
                            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                <Field
                                    name="username"
                                    type="text"
                                    icon="glyphicon-user"
                                    placeholder="User name"
                                    extraClass=""
                                    component={this.renderField}/>
                                <Field
                                    name="fname"
                                    type="text"
                                    icon="glyphicon-user"
                                    placeholder="Full name"
                                    extraClass=""
                                    component={this.renderField}/>
                                <Field
                                    name="email"
                                    type="email"
                                    icon="glyphicon-envelope"
                                    placeholder="Email Address"
                                    extraClass=""
                                    component={this.renderField}/>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    extraClass=""
                                    icon="glyphicon-lock"
                                    component={this.renderField}/>       
                                <Field
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Retype password"
                                    extraClass=""
                                    icon="glyphicon-log-in"
                                    component={this.renderField}/>                   
                                <div className="row">
                                    <div className="col-xs-6 col-xs-offset-3">
                                        <button type="submit" className="btn btn-primary btn-block btn-flat">Register</button>
                                    </div>
                                </div>
                            </form>
                            <br/>
                            <div className="social-auth-links text-center">
                                <p>- OR -</p>
                                <div id="google-button-container" onClick={() => this.handleSocialButtons("google")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <a title="Login with Google" className="btn btn-md btn-danger-red-outline text-component fs-13">
                                        <span>
                                            <i className="fa fa-google-plus"></i> Sign up using
                                            Google+
                                        </span>
                                    </a>
                                </div>
                                <div id="facebook-button-container" onClick={() => this.handleSocialButtons("facebook")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <a title="Login with Facebook" className="btn btn-md btn-primary-outline text-component fs-13">
                                        <span>
                                            <i className="fa fa-facebook"></i> Sign up using
                                            Facebook
                                        </span>
                                    </a>
                                </div>
                                <a href="#" className="text-center">Login</a>
                            </div>
                        </div>
                    </div>
                </div>
                );
    }
}

/**
 * Redux form inbuilt method to validate items
 *
 * @param {any} values
 * @returns
 */

function validate(values) {
    const errors = {};
    if (!values.email) {
        errors.email = "Please enter email";
    } else if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    }
    if (!values.username) {
        errors.username = "Please enter username";
    }
    if (!values.fname) {
        errors.fname = "Please enter full name";
    }
    if (!values.password) {
        errors.password = "Please enter password";
    }
    if (!values.confirm_password) {
        errors.confirm_password = "Please enter retype password";
    }
    if (values.password !== values.confirm_password && values.confirm_password) {
        errors.confirm_password = "Passwords do not match.";
    }
    return errors;
}

/**
 * Bind redux form with the component
 */
Register = reduxForm({form: 'registerForm', enableReinitialize: true, validate})(Register);
export default connect(state => ({notifications: state.notifications, auth: state.Auth}), {showNotification, socialLogin, register, checkAuthStatus})(Register);

