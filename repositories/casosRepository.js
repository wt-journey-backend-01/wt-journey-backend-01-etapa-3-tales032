const db = require("../db/db")

async function create(data) {
    try {
        
        const created = await db("casos").insert(data, ["*"])
        return created

    } catch (error) {

        console.log(error)
        return false
    }
}

async function read(id) {
    try {
        
        const result = await db("casos").where({id:id})
        
        if(!result){
            return false
        }
        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

async function update(id, data) {
    try {
        
        const updated = await db("casos").where({id:id}).update(data,["*"]) 

        if(!updated){
            return false
        }
        return updated[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

async function remove(id) {

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
