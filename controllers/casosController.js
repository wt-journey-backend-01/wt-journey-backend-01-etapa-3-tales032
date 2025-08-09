const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

async function validateNewCase(data, res) {
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
       if (!data.agente_id) {
        return { valid: false, status: 400, message: "O campo 'agente_id' é obrigatório." };
    }
    const agentExists = await agentesRepository.read(data.agente_id);
    if (!agentExists) {
        return { valid: false, status: 404, message: "Agente responsável não encontrado." };
    }
    return { valid: true };
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


async function getCasosController(req, res) {
   try{
    let casos = await casosRepository.getAll();
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
}catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function getCaseByIDController(req, res) {
    try{
        const { id } = req.params;
        const caso = await checkExist(id, res);
        if (!caso) return; 
        res.status(200).json(caso);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function createCaseController(req,res){
    try{
        const data = req.body;
        if (!validateNewCase(data, res)) {
        return;
        }
        const newCase = await casosRepository.createCase(data);
        res.status(201).json(newCase);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function updateCaseController(req,res){
    try{
        const { id } = req.params;
        const data = req.body;
         if (!checkExist(id, res)) return;
        if (!validatePutCase(data, res)) return;
        const updatedCase = await casosRepository.updateCase(id, data);
        res.status(200).json(updatedCase);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function patchCaseController(req,res){
    try{
        const { id } = req.params;
         const data = req.body;
         if (!checkExist(id, res)) return;
        if (!validatePatchCase(data, res)) return;
        const patchedCase = await casosRepository.patchCase(id, data);
         res.status(200).json(patchedCase);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function deleteCaseController(req,res){
    try{
        const { id } = req.params;
        if (!checkExist(id, res)) return;
        await casosRepository.deleteCase(id);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
        
}

module.exports = {
   getCasosController,
   getCaseByIDController,
   createCaseController,
   updateCaseController,
   deleteCaseController,
   patchCaseController
   
}