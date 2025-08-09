const db = require("../db/db")

async function createCase(data) {
    try {
        
        const created = await db("casos").insert(data).returning("*");
        return created

    } catch (error) {

        console.log(error)
        return false
    }
}

async function getCaseByID(id) {
    try {
        
        const result = await db("casos").where({id:id})
        
        if(result.length === 0){
            return false
        }
        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

async function updateCase(id, data) {
    try {
        
        const updated = await db("casos").where({ id: id }).update(data).returning("*");

        if(!updated){
            return false
        }
        return updated[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

async function deleteCase(id) {

    try {
        
        const deleted = await db("casos").where({id: id}).del()

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
        const casos = await db("casos").select("*");
        return casos;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { getAll, getCaseByID ,createCase, updateCase, deleteCase, patchCase: updateCase  };