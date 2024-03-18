# Passwordless

## For my own usage.

**Understand core components**
- [x] `PasswordlessClient`: This class implements the IPasswordlessClient interface and provides methods for various passwordless operations such as setting aliases, creating register tokens, deleting credentials or users, listing aliases or credentials, verifying tokens, sending magic links, and generating authentication tokens. The constructor initializes an Axios client with a base URL and an API secret.

- [x] `IPasswordlessClient` Interface: Defines the contract for the PasswordlessClient, including methods for managing aliases, credentials, users, and authentication.

- [x] `PasswordlessOptions`: A simple interface that allows specifying options for the PasswordlessClient, currently only including `baseUrl`.

## Implementing Passwordless Authentication:


