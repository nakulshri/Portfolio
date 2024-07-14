import { useState } from "react"
import "./login.css"
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../lib/upload";


const Login=()=>{
 const[avatar,setAvatar]=useState({
    file:null,
    url:""
 });

 const[loading,setLoading]=useState(false)


 const handleAvatar= (e) =>{
    if(e.target.files[0]){
    setAvatar({
        file:e.target.files[0],
        url:URL.createObjectURL(e.target.files[0])
    })
    }
 };

 const handleLogin= async(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target)

    const{email,password}=Object.fromEntries(formData);
   
    try {
        await signInWithEmailAndPassword(auth,email,password);

        toast.success("Success Notification !", {
            className: "black",
          });
    } catch (err) {
        console.log(err)
    toast.error(err.message, {
        className: "black",
      });
    }

    
    
 }
 const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);
    try {
        // Check if the username is already taken
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            throw new Error("Username is already taken. Please choose another one.");
        }

        const res = await createUserWithEmailAndPassword(auth, email, password);

        const imgUrl = await upload(avatar.file);
        await setDoc(doc(db, "user", res.user.uid), {
            username,
            email,
            avatar: imgUrl,
            id: res.user.uid,
            blocked: [],
        });

        await setDoc(doc(db, "userchats", res.user.uid), {
            chats: [],
        });

        toast.success("Success Notification !", {
            className: "black",
        });
    } catch (err) {
        console.log(err);
        toast.error(err.message, {
            className: "black",
        });
    } finally {
        setLoading(false);
    }
}

// Function to check if the username already exists
async function checkUsernameExists(username) {
    const q = query(collection(db, "user"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}
    return(
        <div className="Login">
            <div className="item">
                <h2>
                    Welcome Back to Firefly,
                </h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading?"Loading..":"Sign in"}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
            <h2>
                   Join Firefly,
                </h2>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <label htmlFor="file" >
                        <img src={avatar.url||"./avatar.png"} alt="" />
                     Profile Pic</label>
                    <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading?"Loading..":"Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}
export default Login