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

async function getAllController(req, res) {
try {
  const { sortBy, order } = req.query;
  const validSortFields = ['dataDeIncorporacao', 'nome', 'cargo'];
  const validOrders = ['asc', 'desc'];

  if (sortBy && !validSortFields.includes(sortBy)) {
    return res.status(400).json({ message: `sortBy inválido. Use um dos seguintes: ${validSortFields.join(', ')}` });
  }
  if (order && !validOrders.includes(order)) {
    return res.status(400).json({ message: `order inválido. Use 'asc' ou 'desc'.` });
  }

  const agentes = await agentesRepository.getAll(sortBy, order);
  return res.status(200).json(agentes);
} catch (error) {
  console.error("Erro no getAllController:", error);
  return res.status(500).json({ message: "Erro interno do servidor." });
}
}

async function getAgentByIDController(req, res) {
  try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
          return res.status(400).json({ message: "O ID deve ser um número." });
      }

      const agente = await agentesRepository.getAgentByID(id);
      if (!agente) {
          return res.status(404).json({ message: "Agente não cadastrado no banco de dados!" });
      }
      return res.status(200).json(agente);
  } catch (error) {
      console.error("Erro no getAgentByIDController:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function createAgentController(req, res) {
  try {
       const data = req.body;
       const validation = validateNewAgent(data);

      if (!validation.isValid) {
          return res.status(400).json({ message: validation.message });
      }
      
      const newAgent = await agentesRepository.createAgent(data);
      return res.status(201).json(newAgent);
  } catch(error) {
      console.error("Erro no createAgentController:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function updateAgentController(req, res) {
  try {
     const id = parseInt(req.params.id, 10);
     if (isNaN(id)) {
         return res.status(400).json({ message: "O ID deve ser um número." });
     }

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
     return res.status(200).json(updatedAgent);
  } catch(error) {
      console.error("Erro no updateAgentController:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function patchAgentController(req, res) {
  try {
     const id = parseInt(req.params.id, 10);
     if (isNaN(id)) {
         return res.status(400).json({ message: "O ID deve ser um número." });
     }

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
     return res.status(200).json(patchedAgent);
  } catch(error) {
      console.error("Erro no patchAgentController:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function deleteAgentController(req, res) {
  try {
       const id = parseInt(req.params.id, 10);
       if (isNaN(id)) {
           return res.status(400).json({ message: "O ID deve ser um número." });
       }

       const agentExists = await agentesRepository.getAgentByID(id);
      if (!agentExists) {
          return res.status(404).json({ message: "Agente não encontrado." });
      }

      const deleted = await agentesRepository.deleteAgent(id);
      if (!deleted) {
          return res.status(500).json({ message: "Erro ao deletar agente." });
      }

       return res.status(204).send();
  } catch(error) {
      console.error("Erro no deleteAgentController:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

module.exports = {
 getAllController,
 getAgentByIDController,
 createAgentController,
 updateAgentController,
 patchAgentController,
 deleteAgentController
};