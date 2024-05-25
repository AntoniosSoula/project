import { open } from 'sqlite';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

dotenv.config();

// Σύνδεση στη βάση δεδομένων
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

export async function addComment(username, comment) {
    try {
        const db = await connectToDatabase();
        const result = await db.run('INSERT INTO comments (username, comment) VALUES (?, ?)', username, comment);
        
        return { success: true};
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}


export async function deleteComment(commentId) {
    try {
        const db = await connectToDatabase();
        await db.run('DELETE FROM comments WHERE id = ?', commentId);
        console.log(`Το σχόλιο με ID ${commentId} διαγράφηκε επιτυχώς.`);
        return { success: true };
    } catch (error) {
        console.error('Σφάλμα κατά τη διαγραφή σχολίου:', error);
        throw error;
    }
}


export async function getAllComments() {
    try {
        const db = await connectToDatabase();
        const comments = await db.all('SELECT id,username, comment, created FROM comments');
        return comments;
    } catch (error) {
        console.error('Error getting all comments:', error);
        throw error;
    }
}

export async function countComments() {
    try {
        const db = await connectToDatabase();
        const result = await db.get('SELECT COUNT(*) as count FROM comments');
        return result.count;
    } catch (error) {
        console.error('Error counting comments:', error);
        throw error;
    }
}
