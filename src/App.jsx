import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg'

import './App.css';
import 'tachyons';


// CLARIFAI
//////////////////////////////////////////////////////////////////////////////////////////////////
    const MODEL_ID = 'face-detection';

    const returnClarifaiRequestOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = '3c886cb6ca344b89a3d10bca79135c5c';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    // Change these to whatever model and image URL you want to use
    const IMAGE_URL = imageUrl;
    
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                        // "base64": IMAGE_BYTES_STRING
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;

  };






class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      boxes:[],
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input});

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
        .then(result => {

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
        .catch(error => console.log('error', error));
  }

  // 2) Add a method to calculate box positions
  calculateFaceBoxes = () => {
    if (!this.state.boxes || this.state.boxes.length === 0)  return [];
    
    const image = document.getElementById('inputimage');
    if (!image) return [];  // guard to avoid null.width error

    const width = Number(image.width);
    const height = Number(image.height);
    console.log(`calculateFaceBoxes: width: ${width} height: ${height}`);
    

    return this.state.boxes.map(box => {
      return {
        leftCol: box.leftCol * width,
        topRow: box.topRow * height,
        rightCol: width - (box.rightCol * width),
        bottomRow: height - (box.bottomRow * height),  
      };
    });
    
  }

  render() {
    return (
      <>
        <div className="App">
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.calculateFaceBoxes()} />
          <ParticlesBg type="circle" bg={true} />
        </div>
      </>
    )
  }
}

export default App
