const Authentication = require('./src/authentication.js');
const Session = require('./src/session.js'); 

module.exports = function (app) {
    // Application API
    app.post('/api/application/authentication/:platform/login', (req, res) => {
        const auth = new Authentication(req, res);
        auth.login();
    });

    app.post('/api/application/authentication/:platform/license', (req, res) => {
        const auth = new Authentication(req, res);
        auth.licenses();
    });

    app.post('/api/application/authentication/:platform/license', (req, res) => {
        const auth = new Authentication(req, res);
        auth.licenses();
    });

    app.post('/api/application/authentication/:platform/logout', (req, res) => {
        const auth = new Authentication(req, res);
        auth.logoutforce();
    });

    app.post('/api/application/authentication/:platform/session', (req, res) => {
        const session = new Session(req, res);
        session.validSession();
    });

    console.log("AccessGate Endpoints loaded");
};
