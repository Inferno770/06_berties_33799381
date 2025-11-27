# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

## Implementation Details

### 1. Database Security & Environment Variables
To secure database credentials, I implemented the **dotenv** module.
- Sensitive information (Database Host, User, Password, Name) is stored in a local `.env` file which is included in `.gitignore` to prevent it from being uploaded to the repository.
- The application loads these variables using `require('dotenv').config()` and accesses them via `process.env.BB_USER`, `process.env.BB_PASSWORD`, etc.

### 2. User Authentication & Password Hashing
User passwords are **never stored in plain text**.
- **Registration:** When a new user registers, I use the **bcrypt** library (`bcrypt.hash`) to encrypt their password with a salt round of 10 before storing it in the `users` table.
- **Login:** During login, the application retrieves the stored hash and uses `bcrypt.compare` to securely verify the entered password against the database record.

### 3. Login Audit Trail
To track security events, I implemented an audit logging system:
- **Database:** Created an `audit_log` table to store the username, action (e.g., "Successful Login", "Failed - Wrong Password"), and a timestamp.
- **Logic:** The `/users/loggedin` route automatically inserts a record into this table for every login attempt, whether successful or failed.
- **View:** A protected route `/users/audit` displays the full history of login activity.

## Access Control

I have implemented a middleware function `redirectLogin` to restrict access to sensitive areas of the application. If a user is not logged in, they are redirected to the login page.

**Restricted Pages (Logged-in users only):**
* **List Books (`/books/list`):** Restricted so that book inventory is not public.
* **Add Books (`/books/addbook`):** Restricted to prevent unauthorised users from modifying the database inventory.
* **List Users (`/users/list`):** Restricted to protect the privacy of registered users.
* **Audit Log (`/users/audit`):** Restricted because it contains sensitive security information about login attempts.

**Public Pages (Open to everyone):**
* **Home, About:** General information pages.
* **Register/Login:** Required entry points for new and existing users.
* **Search:** Allows potential customers to find books without needing an account.

## Data Validation

I implemented server-side validation using the `express-validator` module to ensure data integrity before processing it.

**Where Validation IS Applied:**
* **User Registration (`/users/registered`):**
    * **Email:** validated using `.isEmail()` to ensure the user provides a functioning contact method.
    * **Username:** validated using `.isLength({ min: 5, max: 20 })` to enforce consistency and database constraints.
    * **Password:** validated using `.isLength({ min: 8 })` to enforce a minimum security standard (e.g., passwords like `aaaaAAAA1234!` are accepted).
    * **Names:** validated using `.notEmpty()` to ensure incomplete profiles are not created.

**Where Validation is NOT Applied (Reasoning):**
* **Login Route:** I did not apply strict length/format validation to the login fields. The authentication process itself (checking the database) acts as the validation. If the input is too short or invalid, the lookup will simply fail to find a match, which is the desired behavior.
* **Search Route:** I did not restrict the length of search terms, as users may validly wish to search for short words or partial matches.

## Security: Input Sanitization (XSS Prevention)

To prevent Cross-Site Scripting (XSS) attacks, I implemented the `express-sanitizer` middleware. This strips dangerous HTML tags (like `<script>`) from user inputs before they are processed or stored in the database.

**Where Sanitization is Applied:**
1.  **Registration Form:** `username`, `first_name`, `last_name`, and `email` are sanitized. This ensures that if a malicious user registers with a name containing a script, it will not execute when other users view the "User List" page.
2.  **Add Book Form:** The book `name` is sanitized to prevent malicious scripts from being injected into the book inventory list.
3.  **Search Form:** The search keyword is sanitized to prevent XSS attacks on the search results page (where the keyword is echoed back to the user).
4.  **Login Form:** The `username` is sanitized as a general precaution.

**Where Sanitization is NOT Applied:**
* **Passwords:** I did **not** sanitize the password fields. Sanitizing passwords alters special characters (e.g., changing `<` to `&lt;`), which would cause the hash verification to fail and prevent legitimate users from logging in. Passwords are never displayed in HTML, so they do not pose an XSS risk.