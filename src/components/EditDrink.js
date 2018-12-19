import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { db, authRef, storageRef } from '../config/firebase';
import firebase from "firebase";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import SimpleReactValidator from 'simple-react-validator';
import { editDrink } from "../actions";
import * as loadImage from 'blueimp-load-image'

import Button from 'muicss/lib/react/button';
import Input from 'muicss/lib/react/input';
import Panel from 'muicss/lib/react/panel';
import Select from 'muicss/lib/react/select';
import Textarea from 'muicss/lib/react/textarea';

class EditDrink extends Component {
    constructor(props, { match }) {

        super(props, { match });

        this.userId = authRef.currentUser.uid;
        this.drinkId = db.collection("users").doc(this.userId).collection('drinks').doc(this.props.match.params.id);
        this.validatorDrink = new SimpleReactValidator();

        this.state = {
            disableSubmit: false,
            progressPercent: null,
            fileObject: null,
            drinkId: '',
            drinkName: '',
            drinkType: '',
            drinkComments: '',
            drinkDate: '',
            photoUrl: '',
            newUrl: null
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

    submitDrink = event => {
        event.preventDefault();

        if (this.validatorDrink.allValid()) {
            this.setState({ disableSubmit: true });
            const id = this.state.drinkId;
            const name = this.state.drinkName;
            const type = this.state.drinkType;
            const othertype = this.state.drinkOtherType
            const comments = this.state.drinkComments;
            //const photoUrl = this.state.newUrl ? this.state.newUrl :this.state.photoUrl ;
            const photoUrl = this.state.photoUrl;

            if (this.state.newUrl) {

                let timestamp = new Date().getTime();

                // Upload file and metadata to the object 'images/mountains.jpg'
                this.uploadTask = storageRef.child('images/' + this.state.fileObject.name + '_' + timestamp).putString(this.state.newUrl, 'data_url');

                // Listen for state changes, errors, and completion of the upload.
                this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                        // this.setState({ progressPercent: 0 });
                        this.setState({
                            progressPercent: progress
                        });



                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
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
                        }
                    }, () => {
                        // Upload completed successfully, now we can get the download URL
                        this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            this.props.editDrink(id, name, type, othertype, comments, photoUrl);
                            this.props.history.push("/drink-list");

                        });
                    });
            } else {
                this.props.editDrink(id, name, type, othertype, comments, photoUrl);
                this.props.history.push("/drink-list");
            }


        } else {
            this.validatorDrink.showMessages();
            // rerender to show messages for the first time
            this.forceUpdate();
        }
    }

    deleteDrink = event => {
        event.preventDefault();
        this.drinkId.delete();
        this.props.history.push("/drink-list");
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



    componentDidMount() {

        this.drinkId.get().then((doc) => {
            this.setState({
                drinkId: doc.data().drinkId,
                drinkName: doc.data().drinkName,
                drinkType: doc.data().drinkType,
                drinkOtherType: doc.data().drinkOtherType,
                drinkComments: doc.data().drinkComments,
                drinkDate: doc.data().drinkDate,
                photoUrl: doc.data().photoUrl
            });

        });

    }


    onFileSelected = event => {

        const file = URL.createObjectURL(event.target.files[0]);
        this.setState({ fileObject: event.target.files[0] })

        let options = {
            canvas: false,
            pixelRatio: window.devicePixelRatio,
            downsamplingRatio: 0.5,
            orientation: true,
            maxWidth: 450
        }

        loadImage(file, this.updateResults, options);
    }

    updateResults = (canvas) => {

        let imgurl = canvas.toDataURL('image/jpeg', 0.8);

        this.setState({
            newUrl: imgurl

        })
        this.setState({

            photoUrl: this.state.newUrl
        })
    }



    render() {

        return (
            <div className="cardContainer edit">
                <Panel className="editCard">
                    <form>
                        <div className="form-group">

                            <Input type="text"
                                id="drinkName"
                                className="form-control"
                                label="Drink name"
                                placeholder="Drink name"
                                value={this.state.drinkName} onChange={this.setDrinkName} />

                            <p className="error-message"> {this.validatorDrink.message('name', this.state.drinkName, 'required')}</p>

                        </div>
                        <div className="form-group">

                            <Select id="drinkType" className="form-control" value={this.state.drinkType} onChange={this.setDrinkType}>
                                <option value="beer" >Beer</option>
                                <option value="wine">Wine</option>
                                <option value="cider">Cider</option>
                                <option value="vodka">Vodka</option>
                                <option value="tequila">Tequila</option>
                                <option value="whisky">Whisky</option>
                                <option value="other" >Other</option>
                            </Select>

                            {this.state.drinkType === 'other' &&
                                <div>
                                    <Input placeholder="Other type" label="Other type" type="text" id="drinkTypeOther" className="form-control" value={this.state.drinkOtherType} onChange={this.setDrinkOtherType} />
                                    <p className="error-message"> {this.validatorDrink.message('name', this.state.drinkOtherType, 'required')}</p>
                                </div>
                            }

                        </div>

                        <div className="form-group">
                            <Textarea
                                id="drinkComments"
                                placeholder="Comments"
                                type="textarea"
                                className="form-control"
                                value={this.state.drinkComments} onChange={this.setDrinkComments} >
                            </Textarea>
                        </div>
                        <div className="addDrinkZone">
                            <div className="addDrink">
                                <div className="addDrink_byPhoto">
                                    <label htmlFor="cameraInput">
                                        <span className="icon mat-icon material-icons">photo_camera</span>
                                        <p>Take an other photo</p>

                                    </label>
                                    <input type="file" capture="camera" accept="image/*" id="cameraInput" name="cameraInput" onChange={(event) => {
                                        this.onFileSelected(event)
                                        event.target.value = null
                                    }} />
                                </div>

                                <div className="addDrink_byFile">
                                    <label htmlFor="fileInput">
                                        <span className="icon mat-icon material-icons">image_search</span>
                                        <p>Choose an other image</p>

                                    </label>
                                    <input type="file" accept="image/*" id="fileInput" name="fileInput" onChange={(event) => {
                                        this.onFileSelected(event)
                                        event.target.value = null
                                    }} />

                                </div>


                            </div>
                            <div className="editImgContainer">
                                <img className="imageToModify" src={this.state.photoUrl} />
                                {this.state.progressPercent ?
                                    <div className="loadingContent">
                                        <p className="textUploading">Image uploading</p>
                                        <div className="loader"></div>
                                        <div className="percentageValue" >{this.state.progressPercent}%</div>
                                    </div>

                                    : null}
                            </div>
                        </div>

                        <div className="wrapperTwoButtons">
                            <Link to="/drink-list">
                                <Button color="accent" type="submit">Cancel</Button>
                            </Link>
                            <a>
                                <Button color="primary" className="btn btn-primary" onClick={this.submitDrink} disabled={this.state.disableSubmit}>Validate</Button>
                            </a>
                        </div>
                    </form>
                </Panel>
                <Button className="deleteBt mat-raised-button mat-warn" color="warn" onClick={this.deleteDrink}>

                    <span className="mat-button-wrapper"><span className="icon mat-icon material-icons">clear</span>Delete this drink</span>

                </Button>

            </div>
        )
    }

}


function mapStateToProps({ auth, uploadFile }) {
    return { auth, uploadFile };
}




export default withRouter(connect(mapStateToProps, { editDrink })(EditDrink))

