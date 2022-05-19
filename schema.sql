    START TRANSACTION;
    
    CREATE TABLE IF NOT EXISTS userTypes(
        id int AUTO_INCREMENT,
        name varchar(225), 
        label varchar(225), 
        PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS users(
        id int AUTO_INCREMENT,
        userTypeId int, 
        name varchar(225),
        email varchar(225), 
        gender varchar(225),
        phone varchar(225), 
        password varchar(225), 
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userTypeId) REFERENCES userTypes (id)
    );
        
    CREATE TABLE IF NOT EXISTS topics(
        id int AUTO_INCREMENT,
        name varchar(225),
        label varchar(225),
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );
    
    CREATE TABLE IF NOT EXISTS userPreferences(
        id int AUTO_INCREMENT,
        userId int,
        topicId int,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (topicId) REFERENCES topics (id)
    );
    
    COMMIT;
    