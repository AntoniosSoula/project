import sqlite3

def create_users_db():
    # Δημιουργία του αντικειμένου σύνδεσης με τη βάση δεδομένων
    connection = sqlite3.connect("./model/users.db")
    cursor = connection.cursor()

    # Δημιουργία του πίνακα, εάν δεν υπάρχει
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(15) NOT NULL,
        comment  VARCHAR (200) NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    """)

    # Κλείσιμο της σύνδεσης
    connection.commit()
    connection.close()


create_users_db()
def drop_comments_table():
    # Δημιουργία του αντικειμένου σύνδεσης με τη βάση δεδομένων
    connection = sqlite3.connect("./model/users.db")
    cursor = connection.cursor()

    # Διαγραφή του πίνακα comments, εάν υπάρχει
    cursor.execute("DROP TABLE IF EXISTS comments")

    # Κλείσιμο της σύνδεσης
    connection.commit()
    connection.close()

# Κλήση της συνάρτησης για διαγραφή του πίνακα
#drop_comments_table()
