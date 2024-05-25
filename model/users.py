import sqlite3

def create_users_db():
    # Δημιουργία του αντικειμένου σύνδεσης με τη βάση δεδομένων
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    # Δημιουργία του πίνακα, εάν δεν υπάρχει
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(15) NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CHECK (email LIKE '%_@__%.__%'),
        CONSTRAINT unique_username UNIQUE (username)  -- Έλεγχος μοναδικών ονομάτων χρηστών
    )
    """)


    # Κλείσιμο της σύνδεσης
    connection.commit()
    connection.close()
def show_users():
    # Σύνδεση με τη βάση δεδομένων
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()

    # Εκτέλεση εντολής SQL για την ανάκτηση των περιεχομένων του πίνακα "users"
    cursor.execute("SELECT * FROM users")

    # Εμφάνιση των αποτελεσμάτων
    rows = cursor.fetchall()
    for row in rows:
        print(row)

    # Κλείσιμο της σύνδεσης
    connection.close()

# Κλήση της συνάρτησης για να δεις τα περιεχόμενα του πίνακα "users"

# Κλήση της συνάρτησης για να δημιουργήσουμε τη βάση δεδομένων users.db
create_users_db()
show_users()