// we create an smart component for SignIn, with its own states
// SignIn is a child of an app, but it has its own states -> it's OK as long as this state is just concerned about SignIn

import { Component } from 'react';

class SignIn extends Component {
    constructor(props) {
	   super();
	   this.state = {
		signInEmail: '',
		signInPassword: ''
	   }
    }
    
    onEmailChange = (event) => {
	   this.setState ({ signInEmail: event.target.value })
    }
    
    onPasswordChange = (event) => {
	   this.setState ({ signInPassword: event.target.value })
    }
    
    onSubmitSignIn = () => {
		fetch('https://face-recognition-api-cfs.onrender.com/signin', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
			.then (response => response.json())
			.then (user => {
				if (user.id) {		// does the user exist? Did we receive an user with a property of id?
					this.props.loadUser(user);
					this.props.onRouteChange('home');   
				}
			})
			.catch (error => console.log ('error signin in'))
	}

	handleSignInKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.onSubmitSignIn();
        }
    }

    render() {
	   const { onRouteChange } = this.props;
	   return (
	   <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 shadow-5 center">
		  <main className="pa4 black-80">
				<div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
						<legend className="f2 fw6 ph0 mh0">Sign In</legend>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
							<input  
								onChange={this.onEmailChange}
								className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
								type="email" 
								name="email-address"  
								id="email-address" 
							/>
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
							<input 
								onChange={this.onPasswordChange}
								onKeyDown={this.handleSignInKeyDown}
								className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
								type="password" 
								name="password"  
								id="password" 
							/>
						</div>
					</fieldset>
					<div className="">
						<input 
							onClick={this.onSubmitSignIn} 
							tabIndex='0'
                            role='button'   // Tells screen readers this behaves like a button (good for accessibility)
							className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
							type="submit" 
							value="Sign in" 
						/>
					</div>
					<div className="lh-copy mt3">
						<p
						onClick={() => onRouteChange("register")} 
						className="f6 link dim black db pointer">Register</p>
					</div>
			 	</div>
		  </main>
	   </article>
	   );
    }

};

export default SignIn;
