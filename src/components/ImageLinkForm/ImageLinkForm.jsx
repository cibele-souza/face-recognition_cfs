import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className='f3 center'>
                {'This Magic Brain will detect faces in your picture. Give it a try!'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} />
                    <button className='center w-30 grow f4 link ph3 pv2 dib pa2 white bg-light-purple detect'
                    onClick={onButtonSubmit}>Detect</button>
                </div>        
            </div>
        </div>
    );
}

export default ImageLinkForm;