const db = require("../db/db")

async function createAgent(data) {
    try {
        
        const created = await db("agentes").insert(data).returning("*");
        return created

    } catch (error) {

        console.log(error)
        return false
    }
}

async function getAgentByID(id) {
    try {
        
        const result = await db("agentes").where({id:id})
        
        if(result.length === 0){
            return false
        }
        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

async function updateAgent(id, data) {
    try {
        
        const updated = await db("agentes").where({ id: id }).update(data).returning("*");
        if(!updated){
            return false
        }
        return updated[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

async function deleteAgent(id) {
    try {
        const deleted = await db("agentes").where({ id: id }).del();
        return deleted > 0; 
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getAll(sortBy, order) {
    try {
       
        let query = db("agentes").select("*");

        if (sortBy === "dataDeIncorporacao" && ["asc", "desc"].includes(order)) {
            query = query.orderBy(sortBy, order);
        }

        const agentes = await query;
        return agentes;
    } catch (error) {
        console.log(error);
        return false;
    }
}



module.exports = { getAll, getAgentByID ,createAgent, updateAgent, deleteAgent, patchAgent: updateAgent };