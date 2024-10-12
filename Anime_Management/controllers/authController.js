const pool = require('../database/db'); // Assuming you have a db connection file
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Render the signup page
const renderSignupPage = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
};

// Handle signup form submission
const signupUser = async (req, res) => {
    const { name, email, password, confirm_password, fav_anime1, fav_anime2 } = req.body;

    // Simple validation
    if (password !== confirm_password) {
        return res.status(400).render('signup', { title: 'Sign Up', error: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 8) {
        return res.status(400).render('signup', { title: 'Sign Up', error: 'Password must be at least 8 characters' });
    }

    try {
        // Check if email already exists
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).render('signup', { title: 'Sign Up', error: 'Email already exists' });
        }

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, password] // Replace password with hashed password if you decide to hash in the future
        );

        const userId = result.rows[0].id;

        // Insert favorite anime if provided
        if (fav_anime1) {
            await pool.query('INSERT INTO anime (user_id, anime_title) VALUES ($1, $2)', [userId, fav_anime1]);
        }
        if (fav_anime2) {
            await pool.query('INSERT INTO anime (user_id, anime_title) VALUES ($1, $2)', [userId, fav_anime2]);
        }

        res.redirect('/login'); // Redirect to login or another page after signup
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).render('signup', { title: 'Sign Up', error: 'Error creating account' });
    }
};

const renderLoginPage = (req, res) => {
    res.render('login', { title: 'Login' });
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userQuery = `SELECT * FROM users WHERE email = $1`;
        const userResult = await pool.query(userQuery, [email]);
        const user = userResult.rows[0];
        console.log(user);

        if (!user) {
            return res.status(400).render('login', {
                title: 'Login',
                error: 'User not found',
            });
        }

        const passwordMatch = password === user.password; // Adjust if you want to hash passwords

        if (!passwordMatch) {
            return res.status(400).render('login', {
                title: 'Login',
                error: 'Invalid password',
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.name,
                email: user.email,
            },
            'randomsecret',
            {
                expiresIn: '2d',
            }
        );

        res.cookie('userToken', token, {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        });

        console.log('Logged in');
        // Redirect to a general dashboard
        return res.status(200).redirect('/dashboard');
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).render('login', { title: 'Login', error: 'Error logging in' });
    }
};



module.exports = {
    renderSignupPage,
    signupUser,
    renderLoginPage,
    loginUser,
};
