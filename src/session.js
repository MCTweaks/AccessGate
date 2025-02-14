const Accounts = require('./Managers/accounts.js');

class Session {
    constructor(request, response) {
        this.req = request;
        this.res = response;
    }

    async validSession() {
        const { ArkaSphere_SessionID, ArkaSphere_SessionToken } = this.req.cookies;

        try {
            const userDB = new Accounts('arkasphere');
            const tokens = await userDB.checkUserTokens(ArkaSphere_SessionToken, ArkaSphere_SessionID);

            if (tokens) {
                return this.res.status(200);
            } else {
                return this.error("Failed User Identificaiton")
            }


        } catch (error) {
            console.error('Error during login: ', error);
            return this.res.status(500).json({ status: 'ERROR', message: 'Internal Server error' })
        }


    }

    error(message) {
        return this.res.status(401).json({ status: 'FAILED', reason: message });
    }

}

module.exports = Session;