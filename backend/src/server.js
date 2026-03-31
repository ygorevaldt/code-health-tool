import createApp from "./app.js";

const app = createApp();

app.listen(3000, () => {
  console.log("Backend rodando em http://localhost:3000");
});
