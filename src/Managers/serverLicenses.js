const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

class serverLicenses {
    constructor(platform) {
        switch (platform) {
            case 'mcuniversal':
                this.filePath = path.join(__dirname, './credentials/mcuniversal/ServerLicenses.json');  
                break;
            // case 'server':
            //     this.filePath = path.join(__dirname, './Servers.json');
            //     break;
            default:
                break;
        }

        this.usersData = this.readJSONFile();
        this.hashSecureKeys(); 
    }
    readJSONFile() {
        try {
            const jsonData = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(jsonData);
        } catch (error) {
            // If the file doesn't exist or is empty, return an empty array
            return [];
        }
    }

    writeJSONFile(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data));
    }
    async hashSecureKeys() {
        const users = this.readJSONFile();
        for (let user of users) {
            if (!user.Password) {
                const hashedPassword = await bcrypt.hash(user.PlainPassword, 10); // 10 times hashing
                user.Password = hashedPassword;
                delete user.PlainPassword; // Remove the plain text password
            }
        }
        this.writeJSONFile(users);
    }

    async getUUID(UUID) {
        const user = this.usersData.find(u => u.UUID === UUID);
        if (!user) {
            return null; // User not found
        }
        // Omitting the PlainKey field before returning the user
        const userCopy = { ...user };
        delete userCopy.PlainKey;
        return userCopy;
    }


}

module.exports = serverLicenses;
