import {} from "mocha";
import * as request from "supertest";
import * as express from "express";
import * as nock from "nock";
import addJwtSecretFromEnvVar from "@magda/typescript-common/dist/session/addJwtSecretFromEnvVar";
import fakeArgv from "@magda/typescript-common/dist/test/fakeArgv";
import createApiRouter from "../createApiRouter";

import mockDatabase from "./mockDatabase";
import Database from "../Database";

const IMAGE_FORMATS_SUPPORTED = ["png", "gif", "svg"];

describe("Content api router", function(this: Mocha.ISuiteCallbackContext) {
    let app: express.Express;
    let argv: any;
    let agent: request.SuperTest<request.Test>;

    before(function() {
        argv = retrieveArgv();
        app = buildExpressApp();
        agent = request.agent(app);
    });

    function retrieveArgv() {
        const argv = addJwtSecretFromEnvVar(
            fakeArgv({
                listenPort: 6999,
                dbHost: "localhost",
                dbPort: 5432,
                jwtSecret: "squirrel",
                authApiUrl: "http://admin.example.com"
            })
        );
        return argv;
    }

    function buildExpressApp() {
        const apiRouter = createApiRouter({
            jwtSecret: argv.jwtSecret,
            database: (new mockDatabase() as any) as Database,
            authApiUrl: argv.authApiUrl
        });

        const app = express();
        //app.use(require("body-parser").json());
        app.use(apiRouter);

        return app;
    }

    describe("READ", () => {
        it("should return data for existing - text", done => {
            agent
                .get("/text-1.text")
                .expect(200, "ass")
                .expect("Content-Type", /^text\/plain/)
                .end(done);
        });

        it("should return data for existing - json - as text", done => {
            agent
                .get("/json-1.text")
                .expect(200, "null")
                .expect("Content-Type", /^text\/plain/)
                .end(done);
        });

        it("should return data for existing - json - as json", done => {
            agent
                .get("/json-2.json")
                .expect(200, { acdc: "test" })
                .expect("Content-Type", /^application\/json/)
                .end(done);
        });

        IMAGE_FORMATS_SUPPORTED.forEach(format => {
            it(`should return data for existing - ${format} - as ${format}`, done => {
                agent
                    .get(`/${format}-id.bin`)
                    .expect(200)
                    .end(done);
            });
        });

        it("should return 404 for non-existant", done => {
            agent
                .get("/json-3.json")
                .expect(404)
                .end(done);
        });

        it("should return 500 for other errors", done => {
            agent
                .get("/svg-id.json")
                .expect(500)
                .end(done);
        });

        it("should not see list", done => {
            agent
                .get("/all")
                .expect(401)
                .end(done);
        });
    });

    describe("UPDATE", () => {
        const gifImage = new Buffer(
            "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            "base64"
        );

        const jwt = require("jsonwebtoken");

        function admin(req: request.Test): request.Test {
            const userId = "1";
            const isAdmin = true;
            nock(argv.authApiUrl)
                .get(`/private/users/${userId}`)
                .reply(200, { isAdmin });
            const id = jwt.sign({ userId: userId }, argv.jwtSecret);
            return req.set("X-Magda-Session", id);
        }

        it("should write and read", done => {
            admin(agent.post("/logo"))
                .set("Content-type", "image/gif")
                .send(gifImage)
                .expect(201)
                .then(() => {
                    agent
                        .get("/logo.text")
                        .expect(gifImage.toString("base64"))
                        .end(done);
                });
        });

        it("should not write non-existing", done => {
            admin(agent.post("/lego"))
                .set("Content-type", "image/gif")
                .send(gifImage)
                .expect(404)
                .end(done);
        });

        it("should not write non-conforming", done => {
            admin(agent.post("/logo"))
                .set("Content-type", "text/plain")
                .send(gifImage)
                .expect(500)
                .end(done);
        });

        it("should not write without access", done => {
            agent
                .post("/logo")
                .set("Content-type", "image/gif")
                .send(gifImage)
                .expect(401)
                .end(done);
        });

        it("should see list", done => {
            admin(agent.get("/all"))
                .expect(200, [
                    {
                        id: "text-1",
                        type: "plain/text"
                    },
                    {
                        id: "text-2",
                        type: "plain/html"
                    },
                    {
                        id: "json-1",
                        type: "application/json"
                    },
                    {
                        id: "json-2",
                        type: "application/json"
                    },
                    {
                        id: "png-id",
                        type: "image/png"
                    },
                    {
                        id: "gif-id",
                        type: "image/gif"
                    },
                    {
                        id: "svg-id",
                        type: "image/svg+xml"
                    },
                    {
                        id: "logo",
                        type: "image/gif"
                    }
                ])
                .end(done);
        });

        it("should not delete logo", done => {
            admin(agent.delete("/logo"))
                .expect(404)
                .end(done);
        });

        it("should upload and delete csvs", done => {
            admin(agent.post("/csv-xxx"))
                .set("Content-type", "text/csv")
                .send(gifImage)
                .expect(201)
                .then(() => {
                    agent
                        .get("/csv-xxx.text")
                        .expect(gifImage.toString("base64"))
                        .then(() => {
                            admin(agent.delete("/csv-xxx"))
                                .expect(204)
                                .then(() => {
                                    agent
                                        .get("/csv-xxx.txt")
                                        .expect(404)
                                        .end(done);
                                });
                        });
                });
        });
    });
});
