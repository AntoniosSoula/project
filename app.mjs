import express from 'express';
import exphbs from 'express-handlebars';
import * as loginModel from './model/model-login.mjs';
import * as contactModel from './model/model-comments.mjs';
import session from 'express-session'
const app = express();
const port = process.env.PORT || '3000';

const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
        not: function (value) {
            return !value;
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(session({
    secret: process.env.SESSION_SECRET || 'mMysecretcombination',
    resave: false,
    saveUninitialized: false
}));
// Στατικά αρχεία
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    req.session.username = req.session.username||''; // Αρχικοποίηση του username
    req.session.have_an_user =req.session.have_an_user|| false; // Αρχικοποίηση της μεταβλητής have_an_user
    req.session.message2='';
    next();
});
app.use((req, res, next) => {
    res.locals.username = req.session.username || '';
    res.locals.have_an_user=req.session.have_an_user||false;
    res.locals.message2=req.session.message2 || '';
    next();
});

async function contact(req, res) {
    try {
        const comments = await contactModel.getAllComments();
        const length = await contactModel.countComments();
        const displays = [];

        for (const comment of comments) {
            let displayValue = false; // Αρχική τιμή "none" για το display του κάθε σχολίου

            if (await loginModel.isAdmin(req.session.username)) {
                displayValue = true; // Αν είναι διαχειριστής, η τιμή είναι "block"
            } else if (req.session.username === comment.username) {
                displayValue = true; // Αν το σχόλιο ανήκει στον τρέχοντα χρήστη, η τιμή είναι "block"
            }

            displays.push(displayValue); // Προσθήκη της τιμής στον πίνακα displays
        }

        comments.forEach((comment, index) => {
            comment.displays = displays[index];
        });

        res.render('contact', {
            have_an_user:req.session.have_an_user||false,
            message2:req.session.message2,
            length,
            comments,
            style1: contactRoute.style1,
            style2: contactRoute.style2,
            title: contactRoute.title,
            js: contactRoute.js
        });
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).render('error', { title: 'Σφάλμα', message: 'Error getting comments' });
    }
}

app.get('/error', (req, res) => {
    res.status(500).render('error', { title: 'Σφάλμα', message: "404" });
});
;


const routes = [
    { path: '/', view: 'first_page', title: 'Καλώς Ορίσατε', js: '', style1: 'first_page', style2: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous"' },
    { path: '/knowing', view: 'knowing', title: 'Γνωρισέ μας..', js: '', style1: 'knowing', style2: '' },
    { path: '/sightseeings', view: 'sightseeings', title: 'Αξιοθέατα', js: '', style1: 'sightseeings', style2: '' },
    { path: '/aox', view: 'aox', title: 'Αθλητισμός', js: '', style1: 'aox', style2: '' },
    { path: '/contact', view: 'contact', title: 'Επικοινωνία', js: 'contact.js', style1: 'contact', style2: '' },
    { path: '/home', view: 'home', title: 'Διαμονή', js: '', style1: 'home', style2: '' },
    { path: '/photos', view: 'photos', title: 'Φωτογραφίες', js: 'photos.js', style1: 'photos', style2: '' },
    { path: '/pota', view: 'pota', title: 'Διασκέδαση', js: '', style1: 'pota', style2: '' },
    { path: '/restaurants', view: 'restaurants', title: 'Φαγητό', js: '', style1: 'restaurants', style2: '' },
    { path: '/login', view: 'login', title: 'Σύνδεση', js: 'login.js', style1: 'login', style2: ''},
    { path: '/signup', view: 'signup', title: 'Σύνδεση', js: 'login.js', style1: 'signup', style2: '' },
    { path: '/error', view: 'error', title: 'Σφάλμα', js: '', style1: 'error.css', style2: ''}
];

routes.forEach(route => {
    if (route.path !== "/contact") {
            app.get(route.path, (req, res) => {
                res.render(route.view, { have_an_user:req.session.have_an_user, style1: route.style1, style2: route.style2, title: route.title, js: route.js });
            });
        } 
            
    
});

const loginRoute = routes.find(route => route.path === '/login');
app.post('/login', async (req, res) => {
    let message='';
    let username = req.body.username;
    const password = req.body.password;
    const userExists = await loginModel.checkCredentials(username, password);
    if (userExists === true) {
        console.log(`${username} συνδέθηκε επιτυχώς`);
        message = "Συνδεθήκατε!";
        req.session.username = username;
        req.session.have_an_user = true;
    } else {
        console.log("Δεν υπάρχει τέτοιος χρήστης");
        message = "Δεν υπάρχει τέτοιος χρήστης!";
    }
    res.render(loginRoute.view, { message, style1: loginRoute.style1, style2: loginRoute.style2, title: loginRoute.title, js: loginRoute.js });
});

const signupRoute = routes.find(route => route.path === '/signup');
app.post('/signup', async (req, res) => {
    let message='';
    const username = req.body.username;
    const { password, email } = req.body;

    try {
        const userExists = await loginModel.userExists(username);
        console.log(userExists);

        if (userExists) {
            console.log(`O ${username} υπάρχει ήδη`);
            message = `O ${username} υπάρχει ήδη`;
        } else {
            const result = await loginModel.signup(username, email, password);
            if (result.success) {
                console.log(`${username} έχει εγγραφεί επιτυχώς`);
                message = `${username} έχει εγγραφεί επιτυχώς`;
        
            } else {
                console.log(`Υπήρξε πρόβλημα κατά την εγγραφή του χρήστη ${username}: ${result.message}`);
                message = `Υπήρξε πρόβλημα κατά την εγγραφή του χρήστη ${username}: ${result.message}`;
            }
        }
    } catch (error) {
        console.error('Error during signup:', error);
        message = 'Υπήρξε κάποιο σφάλμα κατά την εγγραφή.';
    }

    res.render(signupRoute.view, { message, style1: signupRoute.style1, style2: signupRoute.style2, title: signupRoute.title, js: signupRoute.js });
});

const contactRoute = routes.find(route => route.path === '/contact');
app.post('/contact', async (req, res) => {
    const { newcomment } = req.body;
    try {
        if (req.session.username !== "") {
            const result = await contactModel.addComment(req.session.username, newcomment);
            if (result.success) {
                console.log(`Τo σχόλιο από τον χρήστη ${req.session.username} προστέθηκε επιτυχώς.`);
                res.redirect('/contact'); // Ανακατεύθυνση στη σελίδα επικοινωνίας μετά την προσθήκη του σχολίου
            } else {
                console.log(`Υπήρξε κάποιο πρόβλημα κατά την προσθήκη του σχολίου.`);
                req.session.message2 = 'Υπήρξε κάποιο πρόβλημα κατά την προσθήκη του σχολίου.';
                await contact(req, res);
            }
        } else {
            console.log('Το όνομα χρήστη δεν μπορεί να είναι κενό.');
            req.session.message2 = 'Το όνομα χρήστη δεν μπορεί να είναι κενό.';
            await contact(req, res);
        }
    } catch (error) {
        console.error('Σφάλμα κατά την προσθήκη σχολίου:', error);
        req.session.message2 = 'Σφάλμα κατά την προσθήκη σχολίου.';
        await contact(req, res);
    }
});

app.post('/delete-comment', async (req, res) => {
    const { commentId } = req.body;

    try {
        if (req.session.username !== "") {
            const result = await contactModel.deleteComment(commentId);
            if (result.success) {
                console.log(`Το σχόλιο με ID ${commentId} διαγράφηκε επιτυχώς.`);
                res.redirect('/contact'); // Ανακατεύθυνση στη σελίδα επικοινωνίας μετά τη διαγραφή του σχολίου
            } else {
                console.log(`Υπήρξε κάποιο πρόβλημα κατά τη διαγραφή του σχολίου.`);
                req.session.message2 = 'Υπήρξε κάποιο πρόβλημα κατά τη διαγραφή του σχολίου.';
                await contact(req, res);
            }
        } else {
            console.log('Το όνομα χρήστη δεν μπορεί να είναι κενό.');
            req.session.message2 = 'Το όνομα χρήστη δεν μπορεί να είναι κενό.';
            await contact(req, res);
        }
    } catch (error) {
        console.error('Σφάλμα κατά τη διαγραφή σχολίου:', error);
        req.session.message2 = 'Σφάλμα κατά τη διαγραφή σχολίου.';
        await contact(req, res);
    }
});

app.post('/logout', async (req, res) => {
    req.session.username = ''; // Καθαρίζεις το username
    req.session.have_an_user = false;
    res.redirect('/');
});

app.get('/contact', contact);
app.use((req, res, next) => {
    res.status(404).render('error', { title: 'Σφάλμα 404', message: 'Η σελίδα που ψάχνετε δε βρέθηκε.' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).render('error', { title: 'Σφάλμα', message: 'Internal Server Error' });
});

// Έναρξη του server
const server = app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
