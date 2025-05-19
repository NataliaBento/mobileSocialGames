import cron from "cron";
import https from  "https";

const job = new cron.CronJob("*/14 * * * *", function () {
    https
    .get(process.env.API_URL, (res) => {
        if (res.statusCode === 2000) console.log("GET request sent successfully");
        else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;

//CRON JOB explicação
// o cron jobs progama as tarefas para serem realizadas por um intervalo de tempo fixo 
// eu quero mandar 1 GET request a cada 14 minutos 
// eu defino a programação usando o expressão cron, que consiste em 5 campos de representação 
// ! minuto, hora, dia do mês, mês, e dia da semana