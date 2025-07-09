const verifySeller = async (req, res, next) => {
   try {
      if (!req.user || req.user.role !== 'vendedor(a)') {
         return res.status(403).json({
            message:
               'Acesso negado. Apenas vendedores podem acessar este recurso.',
         });
      }
      next();
   } catch (error) {
      res.status(500).json({ message: 'Erro interno no servidor' });
   }
};

module.exports = verifySeller;
