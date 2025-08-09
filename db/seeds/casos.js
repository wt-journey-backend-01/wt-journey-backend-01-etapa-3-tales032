/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

   await knex.raw('TRUNCATE TABLE casos RESTART IDENTITY CASCADE');
  

  await knex('casos').insert([
    { titulo: 'O Monstro de Jersey', descricao: 'Investigar aparição de criatura humanoide nos bosques de Nova Jersey.', status: 'solucionado', agente_id: 1 },
    { titulo: 'Gelo', descricao: 'Analisar amostras de um verme parasita pré-histórico encontrado em uma base no Alasca.', status: 'solucionado', agente_id: 2 },
    { titulo: 'O Milagre', descricao: 'Investigar um jovem com poder de cura, suspeito de ser uma farsa.', status: 'aberto', agente_id: 2 }
  ]);
};
