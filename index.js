const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 8888;
const users = [
    {id: 1, userName: "admin", password: "admin"},
    {id: 2, userName: "guest", password: "admin2"},
    {id: 3, userName: "new", password: "admin3"},
]
const usingToken = []
const loginedUser = []

app.post("/login", (req, res) => {
    let loginTime = new Date();
    if (!req.body.userName || !req.body.password) {
        res
            .status(200)
            .send("Enter need to enter username and password")
        return;
    } else {
        const user = users.find((u) => {
            return u.userName === req.body.userName && u.password === req.body.password
        })

        if (!user) {
            res
                .status(401)
                .send("user doesn not exist")
            return;

        }

        id = user.id;

        if (!loginedUser.includes(id)) {
            const token = jwt.sign({
                sub: user.id,
                userName: user.userName,
                loginTime:loginTime
            }, "mysupersecretkey", {
                expiresIn: "3 hours"
            })
            usedToken = token;
            usingToken.push({id, usedToken,loginTime});
            loginedUser.push(id);
        }

        console.log(usingToken)
        console.log(loginedUser)

        res
            .status(200)
            .send({access_token: token})

    }

})

app.get("/status", (req, res) => {
    const localTime = (new Date()).toLocaleTimeString();

    res
        .status(200)
        .send(`server time = ${localTime}`);
})

app.get("*", (req, res) => {
    res
        .sendStatus(404)
})

app.listen(PORT, () => {
    console.log(`Port is running in ${PORT}`);
})