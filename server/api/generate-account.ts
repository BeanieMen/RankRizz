import crypto from "crypto";

export default defineEventHandler((event) => {
  if (event.method == "GET") {
    const id = crypto.randomBytes(64).toString('hex');
    return {id: id}
  }
  
});
