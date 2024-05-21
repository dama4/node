// Import required module
const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_attendance'
});

// Function to get all students from the database
exports.getAllStudents = (callback) => {
    pool.query('SELECT * FROM students', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving students:', error);
            callback(error, null);
            return;
        }

        callback(null, results);
    });
};

// Method to get a student by ID
exports.getStudentById = (id, callback) => {
    // Define the SQL query to retrieve a student by ID
    const query = 'SELECT * FROM students WHERE id = ?';

    // Execute the query to retrieve the student
    pool.query(query, [id], (error, results) => {
        if (error) {
            callback(error);
            return;
        }

        // If successful, invoke the callback with null for the error and the student data
        callback(null, results[0]); // Assuming there is only one student with the given ID
    });
};

// Method to retrieve all users
exports.getAllUsers = (callback) => {
    const query = 'SELECT * FROM users';
    pool.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results);
    });
};

// Method to add a new student
exports.addStudent = (name, reg_no, username, password, institution_id, callback) => {
    // Generate a salt
    bcrypt.genSalt(10, (saltError, salt) => {
        if (saltError) {
            callback(saltError);
            return;
        }

        // Hash the password with the generated salt
        bcrypt.hash(password, salt, (hashError, hashedPassword) => {
            if (hashError) {
                callback(hashError);
                return;
            }

            // Construct the SQL query to insert a new student
            const studentQuery = 'INSERT INTO students (name, reg_no, institution_id) VALUES (?, ?, ?)';

            // Execute the query to insert student data
            pool.query(studentQuery, [name, reg_no, institution_id], (studentError, studentResults, studentFields) => {
                if (studentError) {
                    callback(studentError);
                    return;
                }

                // Get the ID of the newly inserted student
                const studentId = studentResults.insertId;

                // Construct the SQL query to insert user data with hashed password
                const userQuery = 'INSERT INTO users (username, password, role_id, created_by) VALUES (?, ?, ?, ?)';

                // Execute the query to insert user data
                pool.query(userQuery, [username, hashedPassword, 1, 'Admin'], (userError, userResults, userFields) => {
                    if (userError) {
                        callback(userError);
                        return;
                    }

                    // Get the ID of the newly inserted user
                    const userId = userResults.insertId;

                    // Update the student record with the user ID
                    const updateQuery = 'UPDATE students SET users_id = ? WHERE id = ?';
                    pool.query(updateQuery, [userId, studentId], (updateError, updateResults, updateFields) => {
                        if (updateError) {
                            callback(updateError);
                            return;
                        }

                        callback(null, 'Student added successfully');
                    });
                });
            });
        });
    });
};

// Method to update a student
exports.updateStudent = (id, name, reg_no, institution_id, role_id, created_by, callback) => {
    // Construct the SQL query to update the student
    const query = 'UPDATE students SET name = ?, reg_no = ?, institution_id = ?, role_id = ?, created_by = ? WHERE id = ?';
    
    // Execute the query
    pool.query(query, [name, reg_no, institution_id, role_id, created_by, id], (error, results, fields) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, 'Student updated successfully');
    });
};

// Method to partially update a student
exports.partialUpdateStudent = (id, updatedFields, callback) => {
    // Construct the SQL query to update the student record
    let query = 'UPDATE students SET ';
    const values = [];
    
    // Iterate over the updatedFields object and build the SET clause of the query
    Object.keys(updatedFields).forEach((key, index) => {
        query += `${key} = ?`;
        values.push(updatedFields[key]);
        
        // Add comma if it's not the last field
        if (index < Object.keys(updatedFields).length - 1) {
            query += ', ';
        }
    });

    // Add the WHERE clause to specify the student ID
    query += ' WHERE id = ?';
    values.push(id);

    // Execute the query
    pool.query(query, values, (error, results, fields) => {
        if (error) {
            // If an error occurs, invoke the callback with the error
            callback(error);
            return;
        }

        // If the update is successful, invoke the callback with null for the error
        callback(null, 'Student updated successfully');
    });
};

// Method to delete a student and associated user
exports.deleteStudent = (id, callback) => {
    // Construct the SQL query to delete the student and associated user
    const query = 'DELETE students, users FROM students JOIN users ON students.users_id = users.id WHERE students.id = ?';

    // Execute the query
    pool.query(query, [id], (error, results, fields) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, 'Student and associated user deleted successfully');
    });
};

