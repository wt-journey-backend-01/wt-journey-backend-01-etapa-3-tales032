const db = require("../db/db");

async function createAgent(data) {
try {
  const [createdAgent] = await db("agentes").insert(data).returning("*");
  return createdAgent;
} catch (err) {
  console.error(err);
  return false;
}
}

async function getAgentByID(id) {
try {
  const result = await db("agentes").where({ id });
  if (result.length === 0) return null;
  return result[0];
} catch (error) {
  console.log(error);
  return false;
}
}

async function updateAgent(id, data) {
try {
  const updated = await db("agentes").where({ id }).update(data).returning("*");
  if (!updated || updated.length === 0) return null;
  return updated[0];
} catch (error) {
  console.log(error);
  return false;
}
}

async function deleteAgent(id) {
try {
  const deleted = await db("agentes").where({ id }).del();
  return deleted > 0;
} catch (error) {
  console.log(error);
  return false;
}
}

async function getAll(sortBy = 'id', order = 'asc') {
try {
  let query = db("agentes").select("*");
  const validSortFields = ['dataDeIncorporacao', 'nome', 'cargo'];
  const validOrders = ['asc', 'desc'];

  if (sortBy && validSortFields.includes(sortBy)) {
    const orderLower = order ? order.toLowerCase() : 'asc';
    if (validOrders.includes(orderLower)) {
      query = query.orderBy(sortBy, orderLower);
    }
  }

  return await query;
} catch (error) {
  console.log(error);
  return false;
}
}

module.exports = {
getAll,
getAgentByID,
createAgent,
updateAgent,
deleteAgent,
patchAgent: updateAgent
};