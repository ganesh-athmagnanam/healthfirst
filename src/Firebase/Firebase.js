import firebase from 'firebase';
const  firebaseConfig = {
    /*apiKey: "AIzaSyCbwbwOVlkDO-tGo7ogu1cYW_pXUihj5dA",
    authDomain: "crisis-8cb42.firebaseapp.com",
    projectId: "crisis-8cb42",
    storageBucket: "crisis-8cb42.appspot.com",
    messagingSenderId: "301010701623",
    appId: "1:301010701623:web:84854e26a4d2d2d4f1deb2"*/
    apiKey: "AIzaSyCxLpM7nZK_l4kmlS-qXS69JZArWIcu_Kc",
  authDomain: "crisis-management-eaffb.firebaseapp.com",
  databaseURL: "https://crisis-management-eaffb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "crisis-management-eaffb",
  storageBucket: "crisis-management-eaffb.appspot.com",
  messagingSenderId: "246408278215",
  appId: "1:246408278215:web:53496406d4291deb538ee2",
  measurementId: "G-7HFR52WHXH"
  };
 const database=firebase.initializeApp(firebaseConfig);
 
 export default database;