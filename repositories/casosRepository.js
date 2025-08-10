const db = require("../db/db");

async function createCase(data) {
try {
  const result = await db("casos").insert(data).returning("*");
  return result[0];
} catch (error) {
  console.error("Erro ao criar caso:", error);
  throw error;
}
}

async function getCaseByID(id) {
try {
  const result = await db("casos").where({ id }).first();
  return result || null;
} catch (error) {
  console.error("Erro ao buscar caso:", error);
  throw error;
}
}

async function updateCase(id, data) {
try {
  const result = await db("casos").where({ id }).update(data).returning("*");
  return result[0] || null;
} catch (error) {
  console.error("Erro ao atualizar caso:", error);
  throw error;
}
}

async function patchCase(id, data) {
try {
  const result = await db("casos").where({ id }).update(data).returning("*");
  return result[0] || null;
} catch (error) {
  console.error("Erro ao fazer patch do caso:", error);
  throw error;
}
}

async function deleteCase(id) {
try {
  const deleted = await db("casos").where({ id }).del();
  return deleted > 0;
} catch (error) {
  console.error("Erro ao deletar caso:", error);
  throw error;
}
}

async function getAll(filtros = {}) {
try {
  let query = db("casos").select("*");

  if (filtros.status) {
    query = query.where('status', filtros.status);
  }
  if (filtros.agente_id) {
    query = query.where('agente_id', filtros.agente_id);
  }
  if (filtros.search) {
    query = query.where(function () {
      this.where('titulo', 'ilike', `%${filtros.search}%`)
        .orWhere('descricao', 'ilike', `%${filtros.search}%`);
    });
  }

  query = query.orderBy('id', 'asc');
  const result = await query;
  return result;
} catch (error) {
  console.error("Erro ao buscar casos:", error);
  throw error;
}
}

module.exports = {
getAll,
getCaseByID,
createCase,
updateCase,
patchCase,
deleteCase
};