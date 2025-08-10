const db = require("../db/db");

async function createAgent(data) {
try {
  const result = await db("agentes").insert(data).returning("*");
  return result[0];
} catch (err) {
  console.error("Erro ao criar agente:", err);
  throw err;
}
}

async function getAgentByID(id) {
try {
  const result = await db("agentes").where({ id }).first();
  return result || null;
} catch (error) {
  console.error("Erro ao buscar agente:", error);
  throw error;
}
}

async function updateAgent(id, data) {
try {
  const result = await db("agentes").where({ id }).update(data).returning("*");
  return result[0] || null;
} catch (error) {
  console.error("Erro ao atualizar agente:", error);
  throw error;
}
}

async function patchAgent(id, data) {
try {
  const result = await db("agentes").where({ id }).update(data).returning("*");
  return result[0] || null;
} catch (error) {
  console.error("Erro ao fazer patch do agente:", error);
  throw error;
}
}

async function deleteAgent(id) {
try {
  const deleted = await db("agentes").where({ id }).del();
  return deleted > 0;
} catch (error) {
  console.error("Erro ao deletar agente:", error);
  throw error;
}
}

async function getAll(sortBy = 'id', order = 'asc') {
try {
  let query = db("agentes").select("*");
  
  const validSortFields = ['dataDeIncorporacao', 'nome', 'cargo', 'id'];
  const validOrders = ['asc', 'desc'];

  if (sortBy && validSortFields.includes(sortBy)) {
    const orderLower = order ? order.toLowerCase() : 'asc';
    if (validOrders.includes(orderLower)) {
      query = query.orderBy(sortBy, orderLower);
    }
  } else {
    query = query.orderBy('id', 'asc');
  }

  const result = await query;
  return result;
} catch (error) {
  console.error("Erro ao buscar agentes:", error);
  throw error;
}
}

module.exports = {
getAll,
getAgentByID,
createAgent,
updateAgent,
patchAgent,
deleteAgent
};