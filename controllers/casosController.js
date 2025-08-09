const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");



async function validateCaso(data, isPatch = false) {

    if (isPatch) {
        if (data.id) return { isValid: false, message: "Não é permitido alterar o ID de um caso." };
        if (data.titulo !== undefined && (typeof data.titulo !== 'string' || data.titulo.trim() === '')) {
            return { isValid: false, message: "O campo 'titulo' deve ser uma string não vazia." };
        }
        if (data.descricao !== undefined && (typeof data.descricao !== 'string' || data.descricao.trim() === '')) {
            return { isValid: false, message: "O campo 'descricao' deve ser uma string não vazia." };
        }
        if (data.status !== undefined && !['aberto', 'solucionado'].includes(data.status)) {
            return { isValid: false, message: "Status inválido. Deve ser 'aberto' ou 'solucionado'." };
        }
       
        if (data.agente_id !== undefined) {
            const agentExists = await agentesRepository.getAgentByID(data.agente_id);
            if (!agentExists) {
                return { isValid: false, status: 404, message: "Novo agente responsável não encontrado." };
            }
        }
        return { isValid: true };
    }

    if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim() === '') {
        return { isValid: false, message: "O campo 'titulo' é obrigatório." };
    }
    if (!data.descricao || typeof data.descricao !== 'string' || data.descricao.trim() === '') {
        return { isValid: false, message: "O campo 'descricao' é obrigatório." };
    }
    if (!data.status || !['aberto', 'solucionado'].includes(data.status)) {
        return { isValid: false, message: "Status inválido. Deve ser 'aberto' ou 'solucionado'." };
    }
    if (!data.agente_id) {
        return { isValid: false, message: "O campo 'agente_id' é obrigatório." };
    }


    const agentExists = await agentesRepository.getAgentByID(data.agente_id);
    if (!agentExists) {
        return { isValid: false, status: 404, message: "Agente responsável não encontrado." };
    }

    return { isValid: true };
}



async function getCasosController(req, res) {
   try {
        
        const filtros = req.query; 
        const casos = await casosRepository.getAll(filtros);
        
        res.status(200).json(casos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}
async function getCaseByIDController(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "O ID deve ser um número." });

        const caso = await casosRepository.getCaseByID(id);
        if (!caso) {
            return res.status(404).json({ message: "Caso não encontrado." });
        }
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function createCaseController(req, res) {
    try {
        const data = req.body;
        const validation = await validateCaso(data, false); 

        if (!validation.isValid) {
            return res.status(validation.status || 400).json({ message: validation.message });
        }

        const newCase = await casosRepository.createCase(data);
        res.status(201).json(newCase[0]);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function updateCaseController(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "O ID deve ser um número." });

        const caseExists = await casosRepository.getCaseByID(id);
        if (!caseExists) {
            return res.status(404).json({ message: "Caso não encontrado." });
        }

        const data = req.body;
        const validation = await validateCaso(data, false); 
        if (!validation.isValid) {
            return res.status(validation.status || 400).json({ message: validation.message });
        }

        const updatedCase = await casosRepository.updateCase(id, data);
        res.status(200).json(updatedCase);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function patchCaseController(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "O ID deve ser um número." });

        const caseExists = await casosRepository.getCaseByID(id);
        if (!caseExists) {
            return res.status(404).json({ message: "Caso não encontrado." });
        }

        const data = req.body;
        const validation = await validateCaso(data, true); 
        if (!validation.isValid) {
            return res.status(validation.status || 400).json({ message: validation.message });
        }

        const patchedCase = await casosRepository.patchCase(id, data);
        res.status(200).json(patchedCase);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

async function deleteCaseController(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "O ID deve ser um número." });

        const caseExists = await casosRepository.getCaseByID(id);
        if (!caseExists) {
            return res.status(404).json({ message: "Caso não encontrado." });
        }

        await casosRepository.deleteCase(id);
        res.status(204).send();
    } catch (error) {
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
};