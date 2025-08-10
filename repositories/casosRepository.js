const db = require("../db/db");

async function createCase(data) {
try {
  const [createdCase] = await db("casos").insert(data).returning("*");
  return createdCase; 
} catch (error) {
  console.log(error);
  return false;
}
}

async function getCaseByID(id) {
try {
  const result = await db("casos").where({ id });
  if (result.length === 0) return null;
  return result[0];
} catch (error) {
  console.log(error);
  return false;
}
}

async function updateCase(id, data) {
try {
  const updated = await db("casos").where({ id }).update(data).returning("*");
  if (!updated || updated.length === 0) return null;
  return updated[0];
} catch (error) {
  console.log(error);
  return false;
}
}

async function patchCase(id, data) {
try {

  const existingCase = await db("casos").where({ id }).first();
  if (!existingCase) return null;

  const updatedData = { ...existingCase, ...data };
  const updated = await db("casos").where({ id }).update(updatedData).returning("*");
  if (!updated || updated.length === 0) return null;
  return updated[0];
} catch (error) {
  console.log(error);
  return false;
}
}

async function deleteCase(id) {
try {
  const deleted = await db("casos").where({ id }).del();
  return deleted > 0;
} catch (error) {
  console.log(error);
  return false;
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

  // Default ordering
  query = query.orderBy('id', 'asc');

  return await query;
} catch (error) {
  console.log(error);
  return false;
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