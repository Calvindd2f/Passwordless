## Install the library
`npm install @passwordlessdev/passwordless-client`

## In all cases the frontend needs to import the library
`import { Client } from '@passwordlessdev/passwordless-client';`

-------------------------------------------------------------------

# Registrartion flow:

1. On the backend, generate a registration token by calling the API's `/register/token`.  While you can send in a number of options, the minimum arguments are `userId` and `username`, for example:

**Backend**
```js
// Node.js - Code written for this step should run on your backend.

const payload = {
  userId: '107fb578-9559-4540-a0e2-f82ad78852f7', // Required. A WebAuthn User Handle, which should be generated by your application. Max. 64 bytes.
  username: 'pjfry@passwordless.dev' // Required. A human readable username used for user authentication, should be chosen by the user.
  // ...For more options, please see the API reference for /register/token.
};

// POST the payload to the Passwordless.dev API using your API private secret.
const apiUrl = 'https://v4.passwordless.dev';
const { token } = await fetch(apiUrl + '/register/token', {
  method: 'POST',
  body: JSON.stringify(payload),
  headers: {
    'ApiSecret': 'myapplication:secret:11f8dd7733744f2596f2a28544b5fbc4',
    'Content-Type': 'application/json'
  }
}).then((r) => r.json());
```

2. For frontend, initiate the WebAuthn process to create and store a passkey using the generated registration token.

**Frontend**
```js
// Code written for this step should run on your frontend.
import { Client } from '@passwordlessdev/passwordless-client';

// Instantiate a passwordless client using your API public key.
const p = new Client({
  apiKey: 'myapplication:public:4364b1a49a404b38b843fe3697b803c8'
});

// Fetch the returned registration token from the backend.
const backendUrl = 'https://localhost:7002'; // Your backend.
const registerToken = await fetch(backendUrl + '/create-user').then((r) => r.json());

// Register the token with the end-user's device.
const { token, error } = await p.register(registerToken);
if (token) {
  // Successfully registered!
} else {
  console.error(error);
}
```

-------------------------------------------------------

# Build a signin flow

1. On your frontend, initiate your sign-in and retrieve an authentication token that will be checked by your backend to complete a sign-in.

**Frontend**
```js
// Code written for this step should run on your frontend.

// Instantiate a passwordless client using your API public key.
const p = new Client({
  apiKey: 'myapplication:public:4364b1a49a404b38b843fe3697b803c8'
});

// Allow the user to specify a username or alias.
const alias = 'pjfry@passwordless.dev';

// Generate an authentication token for the user.
const { token, error } = await p.signinWithAlias(alias);
// Tip: You can also try p.signinWithDiscoverable();

// Call your backend to verify the generated token.
const backendUrl = 'https://localhost:7002'; // Your backend.
const verifiedUser = await fetch(backendUrl + '/signin?token=' + token).then((r) => r.json());
if (verifiedUser.success === true) {
  // If successful, proceed!
}
```



2. Validate the authentication token by calling the Passwordless.dev API's `/signin/verify` endpoint.

**Backend**
```js
// Code written for this step should run on your backend.

// Fetch the authentication token from your frontend.
const token = { token: req.query.token };

// POST the authentication token to the Passwordless.dev API using your API private secret.
const apiUrl = 'https://v4.passwordless.dev';
const response = await fetch(apiurl + '/signin/verify', {
  method: 'POST',
  body: JSON.stringify({ token }),
  headers: {
    'ApiSecret': 'myapplication:secret:11f8dd7733744f2596f2a28544b5fbc4',
    'Content-Type': 'application/json'
  }
});

// Cache the API response (see below) to a variable.
const body = await response.json();

// Check the API response for successful verification.
// To see all properties returned by this endpoint, checkout the Backend API Reference for /signin/verify.
if (body.success) {
  console.log('Successfully verified sign-in for user.', body);
  // Set a cookie/userid.
} else {
  console.warn('Sign in failed.', body);
}
```