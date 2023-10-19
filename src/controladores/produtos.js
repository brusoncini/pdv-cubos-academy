const knex = require("../conexao");

const registrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    
    if (!descricao || typeof descricao !== 'string') {
        return res.status(400).json({ mensagem: 'O campo "descricao" é obrigatório e deve ser uma string' });
      }
    
      if (!quantidade_estoque || typeof quantidade_estoque !== 'number') {
        return res.status(400).json({ mensagem: 'O campo "quantidade_estoque" é obrigatório e deve ser um número inteiro' });
      }
    
      if (!valor || typeof valor !== 'number') {
        return res.status(400).json({ mensagem: 'O campo "valor" é obrigatório e deve ser um número' });
      }
    
      if (!categoria_id || typeof categoria_id !== 'number') {
        return res.status(400).json({ mensagem: 'O campo "categoria_id" é obrigatório e deve ser um número inteiro' });
      }
    try {

    const categoriaExistente = await knex('categorias').where('id', categoria_id).first();
  
    if (!categoriaExistente) {
      return res.status(400).json({ mensagem: 'A categoria informada não existe' });
    }
   
    const produtoExistente = await knex('produtos').where('descricao', descricao).first();

    if (produtoExistente) {
      return res.status(400).json({ mensagem: 'A descrição informada já está em uso' });
    }
  
    
      
      const novoProduto = {
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      };
  
      const [produto] = await knex('produtos').insert(novoProduto).returning('*');
  
      res.status(201).json(produto);
    } catch (error) {
        return res.status(500).json(error.message);
    }
  };



  const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

  try {
    let produtos;

    if (categoria_id) {
      if (isNaN(categoria_id)) {
        return res.status(400).json({ mensagem: 'O parâmetro "categoria_id" deve ser um número inteiro válido' });
      }
      
      const categoriaExistente = await knex('categorias').where('id', categoria_id).first();

      if (!categoriaExistente) {
        return res.status(400).json({ mensagem: 'A categoria informada não existe' });
      }

      produtos = await knex('produtos').where('categoria_id', categoria_id);
    } else {
      produtos = await knex('produtos');
    }

    res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

  module.exports = {
    registrarProduto,
    listarProdutos
  }