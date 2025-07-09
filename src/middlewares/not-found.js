const notFound = (req, res) => res.status(404).send('URL inválida!');

module.exports = notFound;
