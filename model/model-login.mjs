import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config()
//Σύνδεση στην βάση δεδομένων


async function connectToDatabase() {
    try {
        const db = await open({
            filename: './model/users.db',
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

export async function userExists(username) {
    try {
        const db = await connectToDatabase();
        const user = await db.get('SELECT * FROM users WHERE username = ? ', username);
        return !!user; // Επιστρέφει true αν βρέθηκε ο χρήστης, αλλιώς false
    } catch (error) {
        console.error('Error checking user existence:', error);
        res.status(500).render('error', { title: 'Σφάλμα', message: 'Σφάλμα κατά τον έλεγχο της ύπαρξης χρήστη' });
    }
}

export async function checkCredentials(username, password) {
    try {
        const db = await connectToDatabase();
        const user = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            return match; // Επιστρέφει true αν ο κωδικός είναι σωστός, αλλιώς false
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking credentials:', error);
        res.status(500).render('error', { title: 'Σφάλμα', message: 'Σφάλμα κατά τον έλεγχο των διαπιστευτηρίων' });
    }
}

//ελέγχει εάν ο χρήστης είναι διαχειριστής
export async function isAdmin(username) {
    try {
        const db = await connectToDatabase();
        const user = await db.get('SELECT * FROM users WHERE username = ?', username);
        return user && (user.username === 'panagiotasmp10');

    } catch (error) {
        console.error('Error checking administrator status:', error);
        throw error;
    }
}

//συνδυάζει τις δύο προηγούμενες συναρτήσεις για να πραγματοποιήσει την είσοδο του χρήστη
export async function login(username, password) {
    const validCredentials = await checkCredentials(username, password);
    if (validCredentials) {
        return { success: true };
    } else {
        return { success: false };
    }
}

export async function deleteUser(username) {
    try {
        const db = await connectToDatabase();
        await db.run('DELETE FROM users WHERE username = ?', username);
        console.log(`User ${username} has been deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}
export async function signup(username, email, password) {
    const userExistsResult = await userExists(username);
    if (!userExistsResult) {
        try {
            const db = await connectToDatabase();
            const hashedPassword = await bcrypt.hash(password, 10); // Κρυπτογράφηση του κωδικού
            await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', username, email, hashedPassword);
            return { success: true };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    } else {
        return { success: false, message: 'Ο χρήστης υπάρχει ήδη' };
    }
}


