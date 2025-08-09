const agentesRepository = require("../repositories/agentesRepository");


function isValidDate(dateString) {
   const regex = /^\d{4}-\d{2}-\d{2}$/; 
   if (!regex.test(dateString)) return false;

   const parts = dateString.split("-"); 
   const year = parseInt(parts[0], 10);
   const month = parseInt(parts[1], 10);
   const day = parseInt(parts[2], 10);
   const date = new Date(year, month - 1, day);

   const today = new Date();
   today.setHours(0, 0, 0, 0);

   const isValid = date.getFullYear() === year &&
                   date.getMonth() === month - 1 &&
                   date.getDate() === day &&
                   date <= today;

   return isValid;
}

function validateNewAgent(data) {
    
    if (!data.nome || typeof data.nome !== 'string' || data.nome.trim() === '') {
        return { isValid: false, message: "O campo 'nome' é obrigatório." };
    }
    if (!data.dataDeIncorporacao || !isValidDate(data.dataDeIncorporacao)) {
        return { isValid: false, message: "O campo 'dataDeIncorporacao' (YYYY-MM-DD) é obrigatório e não pode ser uma data futura." };
    }
    if (!data.cargo || typeof data.cargo !== 'string' || data.cargo.trim() === '') {
        return { isValid: false, message: "O campo 'cargo' é obrigatório." };
    }
    return { isValid: true };
}

function validatePutAgent(data) {
    if (data.id) {
        return { isValid: false, message: "Não é permitido alterar o ID de um agente." };
    }
    if (data.nome !== undefined && (typeof data.nome !== 'string' || data.nome.trim() === '')) {
        return { isValid: false, message: "O campo 'nome' deve ser uma string não vazia." };
    }
    if (data.dataDeIncorporacao !== undefined && !isValidDate(data.dataDeIncorporacao)) {
        return { isValid: false, message: "O campo 'dataDeIncorporacao' (YYYY-MM-DD) deve ser uma data válida e não futura." };
    }
    if (data.cargo !== undefined && (typeof data.cargo !== 'string' || data.cargo.trim() === '')) {
        return { isValid: false, message: "O campo 'cargo' deve ser uma string não vazia." };
    }
    return { isValid: true };
}


function validatePatchAgent(data) {
  if (data.id) {
      res.status(400).json({ message: "Não é permitido alterar o ID de um agente." });
      return false;
  }
  
  if (data.nome !== undefined && (typeof data.nome !== 'string' || data.nome.trim() === '')) {
      res.status(400).json({ message: "O campo 'nome' deve ser uma string não vazia." });
      return false;
  }
  if (data.dataDeIncorporacao !== undefined && !isValidDate(data.dataDeIncorporacao)) {
      res.status(400).json({ message: "O campo 'dataDeIncorporacao' deve estar no formato YYYY-MM-DD e não pode ser no futuro." });
      return false;
  }
  if (data.cargo !== undefined && (typeof data.cargo !== 'string' || data.cargo.trim() === '')) {
      res.status(400).json({ message: "O campo 'cargo' deve ser uma string não vazia." });
      return false;
  }
  return true;
}



async function getAllController(req, res) {
   try{
    let agentes = await agentesRepository.getAll();
   const { sortBy, order } = req.query; 

   if (sortBy === 'dataDeIncorporacao') {
       agentes.sort((a, b) => {
           const dateA = new Date(a.dataDeIncorporacao);
           const dateB = new Date(b.dataDeIncorporacao);
           if (order === 'desc') { 
               return dateB - dateA;
           }
           return dateA - dateB;
       });
   }
   
   res.status(200).json(agentes);

}   catch(error){
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
}
}

async function getAgentByIDController(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "O ID deve ser um número." });

        const agente = await agentesRepository.getAgentByID(id);
        if (!agente) {
            return res.status(404).json({ message: "Agente não cadastrado no banco de dados!" });
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function createAgentController(req, res) {
    try{
         const data = req.body;
         const validation = validateNewAgent(data);

        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }
        
        const newAgent = await agentesRepository.createAgent(data);
        res.status(201).json(newAgent[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
}
}

async function updateAgentController(req,res){
    try{
       const { id } = req.params;
       const data = req.body;

       const agentExists = await agentesRepository.getAgentByID(id);
        if (!agentExists) {
            return res.status(404).json({ message: "Agente não encontrado." });
        }


       const validation = validatePutAgent(data);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }
       const updatedAgent = await agentesRepository.updateAgent(id, data); 
       res.status(200).json(updatedAgent[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
}
}

async function patchAgentController(req,res){
    try{
       const { id } = req.params;
       const data = req.body;

       const agentExists = await agentesRepository.getAgentByID(id);
        if (!agentExists) {
            return res.status(404).json({ message: "Agente não encontrado." });
        }


       const validation = validatePatchAgent(data);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }
       const patchedAgent = await agentesRepository.patchAgent(id, data); 
       res.status(200).json(patchedAgent[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
}
}


async function deleteAgentController(req,res){
    try{
         const { id } = req.params;

         const agentExists = await agentesRepository.getAgentByID(id);
        if (!agentExists) {
            return res.status(404).json({ message: "Agente não encontrado." });
        }

        await agentesRepository.deleteAgent(id);
         res.status(204).send();
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
}
}

module.exports = {
   getAllController,
   getAgentByIDController,
   createAgentController,
   updateAgentController,
   patchAgentController,
   deleteAgentController
}