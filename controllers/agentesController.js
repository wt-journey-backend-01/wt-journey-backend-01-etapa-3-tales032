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

function validateNewAgent(data, res) {

  if (!data || Object.keys(data).length === 0) {
      res.status(400).json({ message: "Dados são obrigatórios." });
      return false;
  }
  
  if (!data.nome || typeof data.nome !== 'string' || data.nome.trim() === '') {
      res.status(400).json({ message: "O campo 'nome' é obrigatório." });
      return false;
  }
  if (!data.dataDeIncorporacao || !isValidDate(data.dataDeIncorporacao)) {
      res.status(400).json({ message: "O campo 'dataDeIncorporacao' é obrigatório, deve estar no formato YYYY-MM-DD e não pode ser no futuro." }); 
      return false; 
  }
  if (!data.cargo || typeof data.cargo !== 'string' || data.cargo.trim() === '') {
      res.status(400).json({ message: "O campo 'cargo' é obrigatório." });
      return false;
  }
  return true;
}

function validatePutAgent(data, res) {
  if (data.id) {
      res.status(400).json({ message: "Não é permitido alterar o ID de um agente." });
      return false;
  }

  if (!data.nome || typeof data.nome !== 'string' || data.nome.trim() === '') {
      res.status(400).json({ message: "O campo 'nome' é obrigatório." });
      return false;
  }
  if (!data.dataDeIncorporacao || !isValidDate(data.dataDeIncorporacao)) {
      res.status(400).json({ message: "O campo 'dataDeIncorporacao' é obrigatório, deve estar no formato YYYY-MM-DD e não pode ser no futuro." });
      return false;
  }
  if (!data.cargo || typeof data.cargo !== 'string' || data.cargo.trim() === '') {
      res.status(400).json({ message: "O campo 'cargo' é obrigatório." });
      return false;
  }
  return true;
}


function validatePatchAgent(data, res) {
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


function checkExist(id, res) {
    const agente = agentesRepository.getAgentByID(id);
    if (!agente) {
        res.status(404).json({ message: "Agente não cadastrado no banco de dados!" });
        return null;
    }
    return agente; 
}

function getAllController(req, res) {
   let agentes = agentesRepository.getAll();
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
}

function getAgentByIDController(req, res) {
        const { id } = req.params;
        const agente = checkExist(id, res);
         if (!agente) return; 
        res.status(200).json(agente);
}

function createAgentController(req, res) {
         const data = req.body;
         if (!validateNewAgent(data, res)) {
        return;
        }
        const newAgent = agentesRepository.createAgent(data);
        res.status(201).json(newAgent);

}

function updateAgentController(req,res){
       const { id } = req.params;
       const data = req.body;
       if (!checkExist(id, res)) return;
       if (!validatePutAgent(data, res)) return;
       const updatedAgent = agentesRepository.updateAgent(id, data); 
       res.status(200).json(updatedAgent);
}

function patchAgentController(req,res){
       const { id } = req.params;
       const data = req.body;
       if (!checkExist(id, res)) return;
       if (!validatePatchAgent(data, res)) return;
       const patchedAgent = agentesRepository.patchAgent(id, data); 
       res.status(200).json(patchedAgent);
}


function deleteAgentController(req,res){
         const { id } = req.params;
         if (!checkExist(id, res)) return;
        agentesRepository.deleteAgent(id);
         res.status(204).send();
}

module.exports = {
   getAllController,
   getAgentByIDController,
   createAgentController,
   updateAgentController,
   patchAgentController,
   deleteAgentController
}