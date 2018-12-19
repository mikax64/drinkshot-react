import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import firebase from "firebase";
import { storageRef } from '../config/firebase';
import { createDrink } from "../actions";
import * as loadImage from 'blueimp-load-image'
import SimpleReactValidator from 'simple-react-validator';
import Input from 'muicss/lib/react/input';
import Panel from 'muicss/lib/react/panel';
import Button from 'muicss/lib/react/button';
import Select from 'muicss/lib/react/select';


class AddDrink extends Component {
    constructor(props) {
        super(props);
        this.validatorDrink = new SimpleReactValidator();
        this.state = {
            fileUrl: null,
            progressPercent: null,
            disableSubmit: false,
            drinkName: '',
            drinkType: 'beer',
            drinkOtherType: '',
            drinkComments: ''
        }
        this.uploadTask = null;

    }
    componentWillUnmount() {

        if (this.uploadTask) {
            this.uploadTask.cancel();
        }
    }


    setDrinkName = event => {
        this.setState({
            drinkName: event.target.value
        });
    }
    setDrinkType = event => {
        this.setState({
            drinkType: event.target.value
        });
    }
    setDrinkOtherType = event => {
        this.setState({
            drinkOtherType: event.target.value
        });
    }

    setDrinkComments = event => {
        this.setState({
            drinkComments: event.target.value
        });
    }

    getDate = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

    submitDrink = event => {
        event.preventDefault();

        if (this.validatorDrink.allValid()) {

            this.setState({ disableSubmit: true });
            const name = this.state.drinkName;
            const type = this.state.drinkType;
            const othertype = this.state.drinkOtherType;
            const comments = this.state.drinkComments;
            const photoUrl = this.state.fileUrl;
            const date = this.getDate();


            if (this.state.fileUrl) {
                // File or Blob named mountains.jpg


                let timestamp = new Date().getTime();
                // Upload file and metadata to the object 'images/mountains.jpg'
                this.uploadTask = storageRef.child('images/' + this.props.uploadFile.fileSelected.name + '_' + timestamp).putString(this.state.fileUrl, 'data_url');

                // Listen for state changes, errors, and completion of the upload.
                this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log('Upload is ' + progress + '% done');
                        this.setState({ progressPercent: progress });

                        console.log('Debut ' + this.state.progressPercent + '% done');

                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                break;
                            default:
                                break;
                        }
                    }, function (error) {

                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;

                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                            default:
                                break;
                        }
                    }, () => {
                        // Upload completed successfully, now we can get the download URL
                        this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            console.log('Upload is ' + this.state.progressPercent + '% done');
                            this.setState({
                                fileUrl: downloadURL
                            });

                            this.props.createDrink(name, type, othertype, comments, photoUrl, date, timestamp);
                            this.props.history.push("/drink-list");

                        });


                    });
            }




        } else {
            this.validatorDrink.showMessages();
            // rerender to show messages for the first time
            this.forceUpdate();
        }
    }




    componentDidMount() {

        if (this.props.uploadFile.fileSelected) {

            const file = URL.createObjectURL(this.props.uploadFile.fileSelected);

            let options = {
                canvas: false,
                pixelRatio: window.devicePixelRatio,
                downsamplingRatio: 0.5,
                orientation: true,
                maxWidth: 450
            }

            loadImage(file, this.updateResults, options);
        }else{
            this.props.history.push("/drink-list");
        }
    }

    updateResults = (canvas) => {
        //document.getElementById('canvas').appendChild(canvas);

        let imgurl = canvas.toDataURL('image/jpeg', 0.8);

        this.setState({
            fileUrl: imgurl
        })
    }


    render() {
        return (

            <Panel className="addCard cardContainer">
                <form>
                    <div className="form-group">
                        <Input type="text"
                            id="drinkName"
                            className="form-control"
                            value={this.state.drinkName} onChange={this.setDrinkName}
                            placeholder="Type drink name" />
                        <p className="error-message"> {this.validatorDrink.message('name', this.state.drinkName, 'required')}</p>
                    </div>
                    <div className="form-group">

                        <Select id="drinkType" className="form-control"
                            value={this.state.drinkType} onChange={this.setDrinkType}>
                            <option value="beer" >Beer</option>
                            <option value="wine" >Wine</option>
                            <option value="cider">Cider</option>
                            <option value="vodka">Vodka</option>
                            <option value="tequila">Tequila</option>
                            <option value="whisky">Whisky</option>
                            <option value="other" >Other</option>
                        </Select>


                        {this.state.drinkType === 'other' &&



                            <Input type="text" id="drinkTypeOther" placeholder="Type of drink" value={this.state.drinkOtherType} onChange={this.setDrinkOtherType} className="form-control" />

                        }


                    </div>

                    <div className="form-group">
                        <Input
                            id="drinkComments"
                            placeholder="Comments"
                            value={this.state.drinkComments} onChange={this.setDrinkComments}
                            type="textarea"
                            className="form-control" />

                    </div>
                    <div className="imgUploadZone">


                        <img alt="" src={this.state.fileUrl} />
                        {this.state.progressPercent ?
                            <div>
                                <p className="textUploading">Image uploading</p>
                                <div className="loader"></div>
                                <div className="percentageValue" >{this.state.progressPercent}%</div>
                            </div>

                            : null}
                    </div>

                    <Button
                        color="primary"
                        className="addDrink_bt"
                        onClick={this.submitDrink}
                        disabled={this.state.disableSubmit}
                    >Add drink</Button>
                </form>


            </Panel>


        )
    };


}

function mapStateToProps({ uploadFile }) {
    return {
        uploadFile
    };
}


export default withRouter(connect(mapStateToProps, { createDrink })(AddDrink))