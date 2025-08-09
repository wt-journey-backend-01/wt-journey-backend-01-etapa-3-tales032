/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
 
  await knex('agentes').del();
  

  await knex.raw('TRUNCATE TABLE agentes RESTART IDENTITY CASCADE');


  await knex('agentes').insert([
    { nome: 'Fox Mulder', dataDeIncorporacao: '1993-10-24', cargo: 'Agente Especial' },
    { nome: 'Dana Scully', dataDeIncorporacao: '1993-03-06', cargo: 'Agente Especial / Médica Legista' },
    { nome: 'Walter Skinner', dataDeIncorporacao: '1986-07-11', cargo: 'Diretor Adjunto' }
  ]);
};