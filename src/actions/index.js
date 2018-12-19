import {  authRef, db, provider } from "../config/firebase";

const FETCH_USER = "FETCH_USER";

export const fetchUser = () => dispatch => {
  authRef.onAuthStateChanged(user => {
    if (user) {
      dispatch({
        type: FETCH_USER,
        payload: user
      });
    } else {
      dispatch({
        type: FETCH_USER,
        payload: null
      });
    }
  });
};
///////////////////////// AUTHENTIFICATION

export const signInEmail = (email, password ) => dispatch => {
  authRef
    .signInWithEmailAndPassword(email, password)
    .then(result => { })
    .catch(error => {
alert(error.message)


    });
};

export const errorData = error =>{
return error || null;
}



export const signInGoogle = () => dispatch => {
  authRef
    .signInWithPopup(provider)
    .then(result => {
      createNewUser(authRef.currentUser.uid);
    })
    .catch(error => {
      alert(error.message)
    });
};

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch(error => {
      alert(error.message)
    });
};

export const signUp = (email, password) => dispatch => {
  authRef
    .createUserWithEmailAndPassword(email, password)
    .then(result => {

      createNewUser(authRef.currentUser.uid);
    })
    .catch(error => {
      alert(error.message)
    });
};


const createNewUser = id => {
  db.collection("users").doc(id).set({
    id: id
  });
}


///////////////////////// DRINK SERVICE

export const createDrink = (name, type, othertype, comments, photoUrl, date, timestamp) => dispatch => {

  const userId = authRef.currentUser.uid;
  const drinkCollection = db.collection("users").doc(userId).collection('drinks');

  drinkCollection.get().then(
    (snapshot) => {
      const idDoc = '' + snapshot.docs.length;
      console.log('id'+idDoc)

      drinkCollection.doc(idDoc).set({
        drinkId: idDoc,
        drinkName: name,
        drinkType: type,
        drinkOtherType: othertype,
        drinkComments: comments,
        photoUrl: photoUrl,
        drinkDate: date,
        timestamp: timestamp
      });
    }
  );
};

export const editDrink = (id, name, type, othertype, comments, photoUrl ) => dispatch => {

  const userId = authRef.currentUser.uid;
  const drinkCollection = db.collection("users").doc(userId).collection('drinks');

  drinkCollection.get().then(
    (snapshot) => {

      drinkCollection.doc(id).update({
        drinkName: name,
        drinkType: type,
        drinkOtherType: othertype,
        drinkComments: comments,
        photoUrl: photoUrl
      });
    }
  );
};




