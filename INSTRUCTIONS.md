
Configuração Inicial
Instale as dependências do projeto:
Abra o terminal na raiz do projeto e execute o comando para instalar os pacotes do Node.js.

npm install
Crie o arquivo de ambiente (.env):
Este projeto usa um arquivo .env para gerenciar as credenciais do banco de dados. Crie um arquivo chamado .env na raiz do projeto e adicione o seguinte conteúdo. Estes valores devem ser os mesmos definidos no seu arquivo docker-compose.yml.

Snippet de código

1. Iniciar o Banco de Dados (Docker)
Com o Docker em execução na sua máquina, use o seguinte comando para iniciar o contêiner do banco de dados PostgreSQL.

docker compose up -d

Para verificar se o banco de dados subiu corretamente, você pode listar os contêineres ativos:

docker ps
Você deverá ver um contêiner com o nome postgres-database na lista.

2. Executar as Migrations
As migrations são responsáveis por criar toda a estrutura de tabelas e colunas no banco de dados que acabamos de iniciar.

npx knex migrate:latest
Após a execução, você verá uma lista dos arquivos de migration que foram aplicados com sucesso.

3. Executar as Seeds
As seeds servem para popular o banco de dados com dados iniciais (ou "sementes"), como agentes e casos de exemplo, para que o ambiente esteja pronto para desenvolvimento e testes.


npx knex seed:run
Este comando irá executar os arquivos da pasta db/seeds e inserir os registros nas tabelas.

Comandos Úteis
Para parar o contêiner do banco de dados:


docker compose down
Para reverter a última leva de migrations (rollback):


npx knex migrate:rollback