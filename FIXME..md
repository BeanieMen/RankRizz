# Database code style

change every

```ts
db.get(..., ..., (...) => {
  // resolve reject
});

// with

await promisify(db.get(..., ...)) // promisify is in node utils
```

## Make database singleton class object

functions should be methods instead

calling any method while the database initialization has not been called should throw

while any method should await for database initialization

example code:

```ts
class DB {
  constructor(/*db connection params*/) {
    this.pass = pass; // however you please
    this.state = "DISCONNECTED"; // CONNECTING, CONNECTED
    this.connectPromise = null;
  }

  async connect() {
    this.state = "CONNECTING";
    let resolve;
    let reject;
    this.connectPromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    // connecting code
    try {
      await this.db.connect(); // or whatever you do
      resolve();
    } catch (e) {
      reject(e);
    }
  }

  async disconnect() {
    this.state = "DISCONNECTED";
    this.connectPromise = null;
  }

  async #waitDbConnection() {
    if (this.state == "DISCONNECTED") throw ...;

    await this.connectPromise;
  }

  async upsertImageLocation() {
    await this.#waitDbConnection();

    const query = ...;

    // actual query
  }
}
```

# Databse setup

Database setup file not found

this should be a single sql file containing all models

ask me if u don't know what im talking about

# REST API endpoint documentation

Doesn't have to be fancy, just make one

you are free to use auto dog gen such as swagger
