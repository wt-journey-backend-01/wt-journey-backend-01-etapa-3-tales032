const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

function validateNewCase(data, res) {
    if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim() === '') {
        res.status(400).json({ message: "O campo 'titulo' é obrigatório." });
        return false;
    }
    if (!data.descricao || typeof data.descricao !== 'string' || data.descricao.trim() === '') {
        res.status(400).json({ message: "O campo 'descricao' é obrigatório." });
        return false;
    }
    if (!data.status || !['aberto', 'solucionado'].includes(data.status)) {
        res.status(400).json({ message: "Status inválido. Deve ser 'aberto' ou 'solucionado'." });
        return false;
    }
    if (!data.agente_id || !agentesRepository.getAgentByID(data.agente_id)) {
        res.status(404).json({ message: "Agente responsável não encontrado." });
        return false;
    }
    return true;
}

function validatePutCase(data, res) {
  if (data.id) {
      res.status(400).json({ message: "Não é permitido alterar o ID de um caso." });
      return false;
  }
  

  if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim() === '') {
      res.status(400).json({ message: "O campo 'titulo' é obrigatório." });
      return false;
  }
  if (!data.descricao || typeof data.descricao !== 'string' || data.descricao.trim() === '') {
      res.status(400).json({ message: "O campo 'descricao' é obrigatório." });
      return false;
  }
  if (!data.status || !['aberto', 'solucionado'].includes(data.status)) {
      res.status(400).json({ message: "Status inválido. Deve ser 'aberto' ou 'solucionado'." });
      return false;
  }
  if (!data.agente_id || !agentesRepository.getAgentByID(data.agente_id)) {
      res.status(404).json({ message: "Agente responsável não encontrado." });
      return false;
  }
  return true;
}

function validatePatchCase(data, res) {
  if (data.id) {
      res.status(400).json({ message: "Não é permitido alterar o ID de um caso." });
      return false;
  }
  if (data.titulo !== undefined && (typeof data.titulo !== 'string' || data.titulo.trim() === '')) {
      res.status(400).json({ message: "O campo 'titulo' deve ser uma string não vazia." });
      return false;
  }
  if (data.descricao !== undefined && (typeof data.descricao !== 'string' || data.descricao.trim() === '')) {
      res.status(400).json({ message: "O campo 'descricao' deve ser uma string não vazia." });
      return false;
  }
  if (data.status !== undefined && !['aberto', 'solucionado'].includes(data.status)) {
      res.status(400).json({ message: "Status inválido. Deve ser 'aberto' ou 'solucionado'." });
      return false;
  }
  if (data.agente_id !== undefined && !agentesRepository.getAgentByID(data.agente_id)) {
      res.status(404).json({ message: "Novo agente responsável não encontrado." });
      return false;
  }
  return true;
}

function checkExist(id, res) {
    const caso = casosRepository.getCaseByID(id);
    if (!caso) {
        res.status(404).json({ message: "Caso não cadastrado no banco de dados!" });
        return null;
    }
    return caso; 
}


function getCasosController(req, res) {
   
    let casos = casosRepository.getAll();
    const { status, agente_id, search } = req.query;

    if (status) {
        casos = casos.filter(caso => caso.status === status);
    }
    if (agente_id) {
        casos = casos.filter(caso => caso.agente_id === agente_id);
    }
    if (search) {
        const lowerSearch = search.toLowerCase();
        casos = casos.filter(caso =>
            caso.titulo.toLowerCase().includes(lowerSearch) ||
            caso.descricao.toLowerCase().includes(lowerSearch)
        );
    }

    res.status(200).json(casos);
}

function getCaseByIDController(req, res) {
        const { id } = req.params;
        const caso = checkExist(id, res);
        if (!caso) return; 
        res.status(200).json(caso);
}

function createCaseController(req,res){
        const data = req.body;
        if (!validateNewCase(data, res)) {
        return;
        }
        const newCase = casosRepository.createCase(data);
        res.status(201).json(newCase);
}

function updateCaseController(req,res){
        const { id } = req.params;
        const data = req.body;
         if (!checkExist(id, res)) return;
        if (!validatePutCase(data, res)) return;
        const updatedCase = casosRepository.updateCase(id, data);
        res.status(200).json(updatedCase);
}

function patchCaseController(req,res){
        const { id } = req.params;
         const data = req.body;
         if (!checkExist(id, res)) return;
        if (!validatePatchCase(data, res)) return;
        const patchedCase = casosRepository.patchCase(id, data);
         res.status(200).json(patchedCase);
}

function deleteCaseController(req,res){
        const { id } = req.params;
        if (!checkExist(id, res)) return;
        casosRepository.deleteCase(id);
        res.status(204).send();

        
}

module.exports = {
   getCasosController,
   getCaseByIDController,
   createCaseController,
   updateCaseController,
   deleteCaseController,
   patchCaseController
   
}