const express = require('express');
const app = express();
const PORT = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger'); 
const errorHandler = require('./utils/errorHandler'); // ADICIONAR

const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
  console.log(`Documentação da API disponível em http://localhost:${PORT}/docs`);
});