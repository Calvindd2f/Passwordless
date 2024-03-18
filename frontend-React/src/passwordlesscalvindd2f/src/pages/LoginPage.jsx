import {useContext, useRef, useState} from "react";
import authContext from "../context/AuthProvider";
import * as Passwordless from "@passwordlessdev/passwordless-client";
import YourBackendClient from "../services/YourBackendClient";
import {PASSWORDLESS_API_KEY, PASSWORDLESS_API_URL} from "../configuration/PasswordlessOptions";

export default function LoginPage() {
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const { setAuth }  = useContext(authContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // In case of self-hosting PASSWORDLESS_API_URL will be different than https://v4.passwordless.dev
        const passwordless = new Passwordless.Client({
            apiUrl: PASSWORDLESS_API_URL,
            apiKey: PASSWORDLESS_API_KEY
        });
        const yourBackendClient = new YourBackendClient()

        // First we obtain our token
        const token = await passwordless.signinWithDiscoverable();
        if (!token) {
            return;
        }

        // Then you verify on your backend the validity of the token.
        const verifiedToken = await yourBackendClient.signIn(token.token);
        
        // Your backend could return a JWT token for example if your token is deemed to be valid.
        localStorage.setItem('jwt', verifiedToken.jwt);
        
        // We are good to proceed. Otherwise fuck off.
        setAuth({ verifiedToken });
        setSuccess(true);
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>{/* <a href="#">Go to Home</a> */}</p>
                </section>
            ) : (
                <section>
                    <p
                        ref={errRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <h1>Sign In</h1>
                    <button onClick={handleSubmit}>Sign In</button>
                    <p>
                        Need an Account?
                        <br />
                        <span className="line">
                            <button>Sign Up</button>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
}