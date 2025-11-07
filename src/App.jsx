import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg'

import './App.css';
import 'tachyons';


const initialState = {
	input:'',
	imageUrl:null,
	boxes:[],
	route: 'signin', //keeps track of where we are in the page
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}


class App extends Component {
  constructor() {
	super();
	this.state = initialState;
  }

  // function called at Register that updates the user data in the main application
 loadUser = (data) => {
	this.setState({ user: {
		id: data.id,
		name: data.name,
		email: data.email,
		entries: data.entries,
		joined: data.joined
	}})
}

  onInputChange = (event) => {
	this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
	this.setState({ imageUrl: this.state.input});
	fetch ('https://face-recognition-api-cfs.onrender.com/imageurl', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			input: this.state.input
		})
	})			
		.then(response => response.json())
		.then(result => {
			if (result) {
				fetch('https://face-recognition-api-cfs.onrender.com/image', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(response => response.json())		// parse the response to the fetch of /image
				.then (count => {
					this.setState(Object.assign(this.state.user, { entries: count}))
				})
				.catch (error => console.log ('error updating count', error))
			}

			// Process the Clarifai results
			const regions = result.outputs[0].data.regions;

			// this code (copied from Clarifai website) only logs the results to the console : 
			// regions.forEach(region => {
			//     // Accessing and rounding the bounding box values
			//     const boundingBox = region.region_info.bounding_box;
			//     const topRow = boundingBox.top_row.toFixed(3);
			//     const leftCol = boundingBox.left_col.toFixed(3);
			//     const bottomRow = boundingBox.bottom_row.toFixed(3);
			//     const rightCol = boundingBox.right_col.toFixed(3);

			//     region.data.concepts.forEach(concept => {
			//         // Accessing and rounding the concept value
			//         const name = concept.name;
			//         const value = concept.value.toFixed(4);
					
			//         console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
			//     });
			// });
			
			// To draw boxes : 1) Store box data

			// Calculate all bounding boxes
			const boxes = regions.map(region => {
			  const boundingBox = region.region_info.bounding_box;
			  return {
				topRow: boundingBox.top_row,
				leftCol: boundingBox.left_col,
				bottomRow: boundingBox.bottom_row,
				rightCol: boundingBox.right_col
			  };
			});

			// Store boxes in state
			this.setState({ boxes: boxes });
			
		})
		.catch(error => console.log('error detecting faces', error));
  }

  // 2) Add a method to calculate box positions
  calculateFaceBoxes = () => {
	if (!this.state.boxes || this.state.boxes.length === 0)  return [];
	
	const image = document.getElementById('inputimage');
	if (!image) return [];  // guard to avoid null.width error

	const width = Number(image.width);
	const height = Number(image.height);
	
	return this.state.boxes.map(box => {
	  return {
		leftCol: box.leftCol * width,
		topRow: box.topRow * height,
		rightCol: width - (box.rightCol * width),
		bottomRow: height - (box.bottomRow * height),  
	  };
	});
	
  }

  onRouteChange = (route) => {
	if (route === 'signout') {
		this.setState(initialState)
	} else if (route === 'home') {
		this.setState({ isSignedIn: true, route:route })
	} else {
		this.setState({ route: route });
	}
  }

  render() {
	const { isSignedIn, imageUrl, route } = this.state;  // destructuring
	return (
	  <>
		<div className="App">
		  <ParticlesBg type="circle" bg={true} />
		  <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
		  { route === 'home' ?
			<div>
			  <Logo />
			  <Rank name={this.state.user.name} entries={this.state.user.entries} />
			  <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
			  <FaceRecognition imageUrl={imageUrl} boxes={this.calculateFaceBoxes()} />
			</div>
			: ( route === 'signin' ?
			  <SignIn loadUser={this.loadUser} onRouteChange={ this.onRouteChange }/>
			  : <Register loadUser={this.loadUser} onRouteChange={(this.onRouteChange )}/>
			  )
		  }
		</div>
	  </>
	)
  }
}

export default App
