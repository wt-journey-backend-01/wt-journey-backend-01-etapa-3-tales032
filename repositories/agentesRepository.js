const db = require("../db/db")

async function createAgent(data) {
    try {
        
        const created = await db("agentes").insert(data, ["*"])
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
        
        const updated = await db("agentes").where({id:id}).update(data,["*"]) 

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
        
        const deleted = await db("agentes").where({id: id}).del()

         if(!deleted){
            return false
        }
        return true;


    } catch (error) {
        
        console.log(error)
        return false
    }
    
}

async function getAll() {
    try {
        const agentes = await db("agentes").select("*");
        return agentes;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { getAll, getAgentByID ,createAgent, updateAgent, deleteAgent };