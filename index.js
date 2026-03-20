const express = require('express');
const app = express();

app.use(express.json());

// 10 registros iniciais
let livros = [
  { id: 1, titulo: "Diário de um Banana", autor: "Jeff Kinney", genero: "Comédia" },
  { id: 2, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", genero: "Fábula" },
  { id: 3, titulo: "Frozen", autor: "Disney", genero: "Infantil" },
  { id: 4, titulo: "A Bailarina Fantasma", autor: "Socorro Acioli", genero: "Mistério" },
  { id: 5, titulo: "O Que Aconteceu com Annie", autor: "C. J. Tudor", genero: "Suspense" },
  { id: 6, titulo: "A Menina que Roubava Livros", autor: "Markus Zusak", genero: "Drama" },
  { id: 7, titulo: "O Homem de Giz", autor: "C. J. Tudor", genero: "Suspense" },
  { id: 8, titulo: "Quem Pensa Enriquece", autor: "Napoleon Hill", genero: "Finanças" },
  { id: 9, titulo: "Pai Rico, Pai Pobre", autor: "Robert Kiyosaki", genero: "Finanças" },
  { id: 10, titulo: "Anne de Green Gables", autor: "Lucy Maud Montgomery", genero: "Romance" }
];

// função de validação
function validarLivro(req, res, next) {
  const { titulo, autor, genero } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 2) {
    return res.status(400).json({
      erro: 'O campo "titulo" é obrigatório e deve ter pelo menos 2 caracteres.'
    });
  }

  if (!autor || typeof autor !== 'string' || autor.trim().length < 2) {
    return res.status(400).json({
      erro: 'O campo "autor" é obrigatório e deve ter pelo menos 2 caracteres.'
    });
  }

  if (!genero || typeof genero !== 'string' || genero.trim().length < 2) {
    return res.status(400).json({
      erro: 'O campo "genero" é obrigatório e deve ter pelo menos 2 caracteres.'
    });
  }

  next();
}

// GET - listar todos os livros
app.get('/livros', (req, res) => {
  res.status(200).json(livros);
});

// GET - buscar livro por id
app.get('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const livro = livros.find(livro => livro.id === id);

  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }

  res.status(200).json(livro);
});

// POST - criar novo livro
app.post('/livros', validarLivro, (req, res) => {
  const { titulo, autor, genero } = req.body;

  const novoLivro = {
    id: livros.length > 0 ? livros[livros.length - 1].id + 1 : 1,
    titulo: titulo.trim(),
    autor: autor.trim(),
    genero: genero.trim()
  };

  livros.push(novoLivro);

  res.status(201).json({
    mensagem: 'Livro cadastrado com sucesso.',
    livro: novoLivro
  });
});

// PUT - atualizar livro
app.put('/livros/:id', validarLivro, (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const index = livros.findIndex(livro => livro.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }

  const { titulo, autor, genero } = req.body;

  livros[index] = {
    id: id,
    titulo: titulo.trim(),
    autor: autor.trim(),
    genero: genero.trim()
  };

  res.status(200).json({
    mensagem: 'Livro atualizado com sucesso.',
    livro: livros[index]
  });
});

// DELETE - remover livro
app.delete('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const index = livros.findIndex(livro => livro.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }

  const livroRemovido = livros.splice(index, 1);

  res.status(200).json({
    mensagem: 'Livro removido com sucesso.',
    livro: livroRemovido[0]
  });
});

// rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});