// Banco de dados inicial — pré-carregado com preparações do HBM
// Baseado na conversa de formulação de cardápios com AQPC

export const DIAS_SEMANA = [
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
  'SÁBADO',
  'DOMINGO',
]

// Bases para cada tipo de dieta (fixas)
export const BASES_DIETA = {
  geralDL: ['ARROZ PARBOILIZADO', 'MASSA ESPAGUETE', 'MASSA PARAFUSO'],
  dm: ['ARROZ INTEGRAL'],
  branda: ['ARROZ BRANCO', 'MASSA'],
  pastosa: ['ARROZ BRANCO PAPA', 'MASSA', 'ARROZ BRANCO'],
  liquidaPastosa: ['CANJA LIQUIDIFICADA'],
}

// Saladas pré-cadastradas (somente Almoço)
export const SALADAS_INICIAIS = [
  { id: 'sal1', nome: 'Alface Simples', nomeAbrev: 'ALFACE' },
  { id: 'sal2', nome: 'Mix de Folhas Verdes', nomeAbrev: 'MIX VERDE' },
  { id: 'sal3', nome: 'Cenoura Ralada Crua', nomeAbrev: 'CENOURA RALADA' },
  { id: 'sal4', nome: 'Beterraba Cozida em Cubos', nomeAbrev: 'BETERRABA COZIDA' },
  { id: 'sal5', nome: 'Repolho Refogado', nomeAbrev: 'REPOLHO REFOGADO' },
  { id: 'sal6', nome: 'Couve Refogada no Alho', nomeAbrev: 'COUVE REFOGADA' },
  { id: 'sal7', nome: 'Abobrinha Crua Temperada', nomeAbrev: 'ABOBRINHA TEMPERADA' },
  { id: 'sal8', nome: 'Tomate em Rodelas', nomeAbrev: 'TOMATE' },
  { id: 'sal9', nome: 'Pepino com Tomate', nomeAbrev: 'PEPINO C/ TOMATE' },
  { id: 'sal10', nome: 'Espinafre Refogado', nomeAbrev: 'ESPINAFRE' },
]


// Proteínas/Carnes pré-cadastradas
export const PROTEINAS_INICIAIS = [
  // ──── PEITO DE FRANGO ────
  {
    id: 'pf1',
    categoria: 'Frango — Peito',
    nome: 'Peito de Frango ao Molho Cremoso de Milho',
    nomeAbrev: 'PEITO DE FRANGO AO MOLHO CREMOSO DE MILHO',
    nomeBranda: 'PEITO DE FRANGO EM CUBOS',
    nomePastosa: 'FRANGO DESFIADO COM CALDO/MOLHO',
    nomeLiquida: 'CARNE COM CALDO/MOLHO LIQUIDIFICADA',
  },
  {
    id: 'pf2',
    categoria: 'Frango — Peito',
    nome: 'Iscas de Peito de Frango Aceboladas ao Molho Ferrugem',
    nomeAbrev: 'FRANGO ACEBOLADO AO MOLHO FERRUGEM',
    nomeBranda: 'FRANGO ACEBOLADO AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'pf3',
    categoria: 'Frango — Peito',
    nome: 'Strogonoff de Frango',
    nomeAbrev: 'STROGONOFF DE FRANGO',
    nomeBranda: 'STROGONOFF DE FRANGO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'pf4',
    categoria: 'Frango — Peito',
    nome: 'Peito de Frango Desfiado ao Molho de Tomate Rústico',
    nomeAbrev: 'FRANGO DESFIADO AO MOLHO DE TOMATE',
    nomeBranda: 'FRANGO DESFIADO AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },

  // ──── SOBRECOXA DE FRANGO ────
  {
    id: 'sc1',
    categoria: 'Frango — Sobrecoxa',
    nome: 'Sobrecoxa Assada ao Forno com Alho e Cebola',
    nomeAbrev: 'SOBRECOXA ASSADA',
    nomeBranda: 'SOBRECOXA COZIDA EM CUBOS',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADA',
  },
  {
    id: 'sc2',
    categoria: 'Frango — Sobrecoxa',
    nome: 'Sobrecoxa Ensopada com Ervilha e Milho ao Molho Vermelho',
    nomeAbrev: 'SOBRECOXA C/ ERVILHA E MILHO',
    nomeBranda: 'SOBRECOXA C/ ERVILHA E MILHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADA',
  },
  {
    id: 'sc3',
    categoria: 'Frango — Sobrecoxa',
    nome: 'Sobrecoxa Desfiada ao Molho Ferrugem Acebolado',
    nomeAbrev: 'SOBRECOXA DESFIADA AO MOLHO FERRUGEM',
    nomeBranda: 'SOBRECOXA DESFIADA AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADA',
  },
  {
    id: 'sc4',
    categoria: 'Frango — Sobrecoxa',
    nome: 'Sobrecoxa Ensopada ao Molho Suave de Tomate Pelado',
    nomeAbrev: 'SOBRECOXA AO MOLHO DE TOMATE',
    nomeBranda: 'SOBRECOXA AO MOLHO DE TOMATE',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADA',
  },

  // ──── CARNE MOÍDA DE FRANGO ────
  {
    id: 'cmf1',
    categoria: 'Frango — Moído',
    nome: 'Almôndegas de Frango ao Molho de Tomate Rústico',
    nomeAbrev: 'ALMÔNDEGAS DE FRANGO AO MOLHO',
    nomeBranda: 'ALMÔNDEGAS DE FRANGO AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'cmf2',
    categoria: 'Frango — Moído',
    nome: 'Polpetone de Frango Assado Recheado com Queijo',
    nomeAbrev: 'POLPETONE DE FRANGO C/ QUEIJO',
    nomeBranda: 'POLPETONE DE FRANGO AO MOLHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'cmf3',
    categoria: 'Frango — Moído',
    nome: 'Frango Moído Refogado com Seleta de Legumes ao Molho',
    nomeAbrev: 'CARNE MOÍDA DE FRANGO C/ SELETA',
    nomeBranda: 'FRANGO MOÍDO REFOGADO C/ SELETA',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'cmf4',
    categoria: 'Frango — Moído',
    nome: 'Rocambole de Frango Moído Recheado com Presunto e Queijo',
    nomeAbrev: 'ROCAMBOLE DE FRANGO C/ PRESUNTO',
    nomeBranda: 'ROCAMBOLE DE FRANGO AO MOLHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },

  // ──── CARNE MOÍDA BOVINA ────
  {
    id: 'cmb1',
    categoria: 'Bovina — Moída',
    nome: 'Almôndegas Bovinas ao Molho Ferrugem',
    nomeAbrev: 'ALMÔNDEGAS BOV. AO MOLHO FERRUGEM',
    nomeBranda: 'ALMÔNDEGAS BOV. AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'AO MOLHO LIQUIDIFICADO',
  },
  {
    id: 'cmb2',
    categoria: 'Bovina — Moída',
    nome: 'Carne Moída com Ervilha ao Molho de Tomate Pelado',
    nomeAbrev: 'CARNE MOÍDA BOV. C/ ERVILHA',
    nomeBranda: 'CARNE MOÍDA BOV. C/ ERVILHA',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'AO MOLHO LIQUIDIFICADO',
  },
  {
    id: 'cmb3',
    categoria: 'Bovina — Moída',
    nome: 'Rocambole de Carne Moída Recheado com Presunto e Queijo',
    nomeAbrev: 'ROCAMBOLE BOV. C/ PRESUNTO E QUEIJO',
    nomeBranda: 'ROCAMBOLE BOV. AO MOLHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'AO MOLHO LIQUIDIFICADO',
  },
  {
    id: 'cmb4',
    categoria: 'Bovina — Moída',
    nome: 'Carne Moída Refogada com Cebola e Extrato de Tomate',
    nomeAbrev: 'CARNE MOÍDA BOV. COM MOLHO',
    nomeBranda: 'CARNE MOÍDA BOV. COM MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'COM MOLHO LIQUIDIFICADO',
  },

  // ──── COXÃO DE DENTRO ────
  {
    id: 'cd1',
    categoria: 'Bovina — Coxão de Dentro',
    nome: 'Iscas de Coxão de Dentro Aceboladas ao Molho Ferrugem',
    nomeAbrev: 'COXÃO AO MOLHO FERRUGEM',
    nomeBranda: 'COXÃO EM CUBOS MACIOS AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'cd2',
    categoria: 'Bovina — Coxão de Dentro',
    nome: 'Cubos de Coxão de Dentro ao Molho de Tomate com Seleta',
    nomeAbrev: 'COXÃO C/ TOMATE E SELETA',
    nomeBranda: 'COXÃO C/ TOMATE E SELETA',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'cd3',
    categoria: 'Bovina — Coxão de Dentro',
    nome: 'Carne Louca — Coxão Desfiado Acebolado',
    nomeAbrev: 'CARNE LOUCA (COXÃO DESFIADO)',
    nomeBranda: 'CARNE LOUCA (COXÃO DESFIADO)',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'cd4',
    categoria: 'Bovina — Coxão de Dentro',
    nome: 'Iscas de Coxão ao Molho Suave de Extrato de Tomate',
    nomeAbrev: 'COXÃO AO MOLHO DE TOMATE',
    nomeBranda: 'COXÃO AO MOLHO DE TOMATE',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },

  // ──── PATINHO ────
  {
    id: 'pt1',
    categoria: 'Bovina — Patinho',
    nome: 'Strogonoff de Patinho com Milho e Creme de Leite',
    nomeAbrev: 'STROGONOFF DE PATINHO',
    nomeBranda: 'STROGONOFF DE PATINHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'pt2',
    categoria: 'Bovina — Patinho',
    nome: 'Iscas de Patinho com Pimentão e Cebola ao Molho Suave',
    nomeAbrev: 'PATINHO C/ PIMENTÃO E CEBOLA',
    nomeBranda: 'PATINHO EM CUBOS AO MOLHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'pt3',
    categoria: 'Bovina — Patinho',
    nome: 'Picadinho de Patinho com Ervilha ao Molho Ferrugem',
    nomeAbrev: 'PICADINHO DE PATINHO C/ ERVILHA',
    nomeBranda: 'PICADINHO DE PATINHO C/ ERVILHA',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'pt4',
    categoria: 'Bovina — Patinho',
    nome: 'Iscas de Patinho ao Molho de Tomate Rústico com Ervas',
    nomeAbrev: 'PATINHO AO MOLHO DE TOMATE',
    nomeBranda: 'PATINHO AO MOLHO DE TOMATE',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },

  // ──── VAZIO ────
  {
    id: 'vz1',
    categoria: 'Bovina — Vazio',
    nome: 'Vazio Assado Fatiado ao Molho Acebolado',
    nomeAbrev: 'VAZIO ASSADO AO MOLHO ACEBOLADO',
    nomeBranda: 'VAZIO COZIDO EM CUBOS MACIOS',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'vz2',
    categoria: 'Bovina — Vazio',
    nome: 'Vazio Desfiado ao Molho de Tomate Pelado e Cebola',
    nomeAbrev: 'VAZIO DESFIADO AO MOLHO',
    nomeBranda: 'VAZIO DESFIADO AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'vz3',
    categoria: 'Bovina — Vazio',
    nome: 'Cubos de Vazio Cozidos ao Molho Ferrugem Rústico',
    nomeAbrev: 'VAZIO AO MOLHO FERRUGEM',
    nomeBranda: 'VAZIO AO MOLHO FERRUGEM',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'vz4',
    categoria: 'Bovina — Vazio',
    nome: 'Iscas de Vazio Salteadas com Cebola e Molho Encorpado',
    nomeAbrev: 'ISCAS DE VAZIO ACEBOLADAS',
    nomeBranda: 'ISCAS DE VAZIO AO MOLHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },

  // ──── PERNIL SUÍNO ────
  {
    id: 'ps1',
    categoria: 'Suíno — Pernil',
    nome: 'Iscas de Pernil Aceboladas ao Molho de Extrato de Tomate',
    nomeAbrev: 'PERNIL ACEBOLADO AO MOLHO',
    nomeBranda: 'PERNIL EM CUBOS AO MOLHO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'ps2',
    categoria: 'Suíno — Pernil',
    nome: 'Pernil Desfiado Acebolado na Pressão',
    nomeAbrev: 'PERNIL DESFIADO ACEBOLADO',
    nomeBranda: 'PERNIL DESFIADO ACEBOLADO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'ps3',
    categoria: 'Suíno — Pernil',
    nome: 'Cubos de Pernil Ensopados ao Molho de Tomate com Milho',
    nomeAbrev: 'PERNIL C/ TOMATE E MILHO',
    nomeBranda: 'PERNIL ENSOPADO C/ MILHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'ps4',
    categoria: 'Suíno — Pernil',
    nome: 'Iscas de Pernil ao Molho de Cebola Caramelizada com Ervas',
    nomeAbrev: 'PERNIL C/ CEBOLA CARAMELIZADA',
    nomeBranda: 'PERNIL C/ MOLHO SUAVE',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },

  // ──── FILÉ DE PEIXE ────
  {
    id: 'fp1',
    categoria: 'Peixe — Filé',
    nome: 'Filé de Peixe Assado ao Forno com Cebola e Ervas',
    nomeAbrev: 'FILÉ DE PEIXE ASSADO',
    nomeBranda: 'FILÉ DE PEIXE COZIDO AO MOLHO',
    sufixoPastosa: 'AO MOLHO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'fp2',
    categoria: 'Peixe — Filé',
    nome: 'Filé de Peixe Ensopado ao Molho de Tomate com Pimentão',
    nomeAbrev: 'FILÉ DE PEIXE AO MOLHO DE TOMATE',
    nomeBranda: 'FILÉ DE PEIXE AO MOLHO DE TOMATE',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'fp3',
    categoria: 'Peixe — Filé',
    nome: 'Filé de Peixe Empanado Assado no Forno',
    nomeAbrev: 'FILÉ DE PEIXE EMPANADO',
    nomeBranda: 'FILÉ DE PEIXE COZIDO AO FORNO',
    sufixoPastosa: 'LIQUIDIFICADO',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
  {
    id: 'fp4',
    categoria: 'Peixe — Filé',
    nome: 'Filé de Peixe ao Molho Cremoso de Requeijão com Milho',
    nomeAbrev: 'FILÉ DE PEIXE AO CREME DE REQUEIJÃO',
    nomeBranda: 'FILÉ DE PEIXE AO CREME DE REQUEIJÃO',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
  },
]

// Leguminosas pré-cadastradas
export const LEGUMINOSAS_INICIAIS = [
  {
    id: 'leg1',
    nome: 'Feijão Preto',
    nomeAbrev: 'FEIJÃO',
    nomeBranda: 'CALDO DE FEIJÃO',
    nomePastosa: 'FEIJÃO LIQUIDIFICADO',
    nomeLiquida: 'FEIJÃO LIQUIDIFICADO',
  },
  {
    id: 'leg2',
    nome: 'Creme de Ervilha',
    nomeAbrev: 'CREME DE ERVILHA',
    nomeBranda: 'CALDO DE ERVILHA',
    nomePastosa: 'CREME DE ERVILHA LIQ.',
    nomeLiquida: 'CREME DE ERVILHA LIQ.',
  },
  {
    id: 'leg3',
    nome: 'Lentilha',
    nomeAbrev: 'LENTILHA',
    nomeBranda: 'CALDO DE LENTILHA',
    nomePastosa: 'LENTILHA LIQUIDIFICADA',
    nomeLiquida: 'LENTILHA LIQUIDIFICADA',
  },
  {
    id: 'leg4',
    nome: 'Grão de Bico',
    nomeAbrev: 'GRÃO DE BICO',
    nomeBranda: 'CALDO DE GRÃO DE BICO',
    nomePastosa: 'GRÃO DE BICO LIQ.',
    nomeLiquida: 'GRÃO DE BICO LIQ.',
  },
]

// Guarnições pré-cadastradas
export const GUARNICOES_INICIAIS = [
  // Peito de Frango
  {
    id: 'g1',
    nome: 'Purê de Moranga Cabotiá',
    nomeAbrev: 'PURÊ DE MORANGA',
    nomeBranda: 'PURÊ DE MORANGA',
    nomePastosa: 'PURÊ DE MORANGA CREMOSO',
    nomeLiquida: '',
  },
  {
    id: 'g2',
    nome: 'Batata Assada no Forno com Ervas',
    nomeAbrev: 'BATATA ASSADA C/ ERVAS',
    nomeBranda: 'BATATA COZIDA',
    nomePastosa: 'PURÊ DE BATATA',
    nomeLiquida: '',
  },
  {
    id: 'g3',
    nome: 'Abobrinha Refogada em Rodelas na Manteiga',
    nomeAbrev: 'ABOBRINHA REFOGADA',
    nomeBranda: 'ABOBRINHA COZIDA',
    nomePastosa: 'PURÊ DE ABOBRINHA',
    nomeLiquida: '',
  },
  {
    id: 'g4',
    nome: 'Creme de Espinafre com Leite e Farinha',
    nomeAbrev: 'CREME DE ESPINAFRE',
    nomeBranda: 'CREME DE ESPINAFRE',
    nomePastosa: 'CREME DE ESPINAFRE BATIDO',
    nomeLiquida: '',
  },
  // Sobrecoxa
  {
    id: 'g5',
    nome: 'Polenta Cremosa na Manteiga',
    nomeAbrev: 'POLENTA CREMOSA',
    nomeBranda: 'POLENTA CREMOSA',
    nomePastosa: 'POLENTA MOLE',
    nomeLiquida: '',
  },
  {
    id: 'g6',
    nome: 'Purê de Batata Inglesa Aveludado',
    nomeAbrev: 'PURÊ DE BATATA',
    nomeBranda: 'PURÊ DE BATATA',
    nomePastosa: 'PURÊ DE BATATA AVELUDADO',
    nomeLiquida: '',
  },
  {
    id: 'g7',
    nome: 'Cenoura Cozida no Vapor com Salsinha',
    nomeAbrev: 'CENOURA COZIDA',
    nomeBranda: 'CENOURA COZIDA NO VAPOR',
    nomePastosa: 'PURÊ DE CENOURA',
    nomeLiquida: '',
  },
  {
    id: 'g8',
    nome: 'Couve Chinesa Refogada no Alho',
    nomeAbrev: 'COUVE CHINESA REFOGADA',
    nomeBranda: 'COUVE REFOGADA BEM MACIA',
    nomePastosa: '',
    nomeLiquida: '',
  },
  // Frango moído
  { id: 'g9', nome: 'Batata Inglesa Cozida em Cubos na Manteiga', nomeAbrev: 'BATATA COZIDA NA MANTEIGA' },
  { id: 'g10', nome: 'Berinjela Refogada com Tomate Pelado e Cebola', nomeAbrev: 'BERINJELA REFOGADA' },
  { id: 'g11', nome: 'Massa Parafuso no Alho e Azeite', nomeAbrev: 'MASSA PARAFUSO AO ALHO' },
  // Carne moída
  { id: 'g12', nome: 'Abobrinha Salteada com Cebola', nomeAbrev: 'ABOBRINHA SALTEADA' },
  { id: 'g13', nome: 'Cenoura Cozida em Rodelas na Manteiga', nomeAbrev: 'CENOURA NA MANTEIGA' },
  // Coxão de dentro
  { id: 'g14', nome: 'Mandioca Cozida na Manteiga com Cheiro-Verde', nomeAbrev: 'MANDIOCA COZIDA' },
  { id: 'g15', nome: 'Espinafre Refogado Simples', nomeAbrev: 'ESPINAFRE REFOGADO' },
  { id: 'g16', nome: 'Berinjela Assada no Forno com Orégano', nomeAbrev: 'BERINJELA ASSADA' },
  // Patinho
  { id: 'g17', nome: 'Batata Assada Corada com Páprica Doce', nomeAbrev: 'BATATA C/ PÁPRICA' },
  { id: 'g18', nome: 'Purê de Batata com Requeijão', nomeAbrev: 'PURÊ DE BATATA C/ REQUEIJÃO' },
  { id: 'g19', nome: 'Cenoura Assada no Forno com Azeite', nomeAbrev: 'CENOURA ASSADA' },
  // Vazio
  { id: 'g20', nome: 'Batata Inglesa Cozida em Rodelas com Salsinha', nomeAbrev: 'BATATA COZIDA C/ SALSINHA' },
  // Pernil
  { id: 'g21', nome: 'Abobrinha em Cubos Refogada', nomeAbrev: 'ABOBRINHA EM CUBOS' },
  { id: 'g22', nome: 'Batata Rústica Assada com Ervas', nomeAbrev: 'BATATA RÚSTICA ASSADA' },
  { id: 'g23', nome: 'Polenta Cremosa Amarela', nomeAbrev: 'POLENTA CREMOSA AMARELA' },
  // Peixe
  { id: 'g24', nome: 'Espinafre Refogado no Alho', nomeAbrev: 'ESPINAFRE AO ALHO' },
  { id: 'g25', nome: 'Cenoura Cozida no Vapor', nomeAbrev: 'CENOURA NO VAPOR' },
]

// Observações padrão de dieta líquida
export const OBS_LIQUIDA_PADRAO = {
  liquidaCompleta: 'CALDO DE FEIJÃO, CALDO DE LENTILHA E CALDO DE CANJA',
  liquidaSemResiduos: 'CALDO DE CANJA',
}

// Insumos/Ingredientes com tabela de valores e preços
export const INSUMOS_INICIAIS = [
  // CARNES/PROTEÍNAS — Aves
  { id: 'ins1',  nome: 'FRANGO - FILÉ',              un: 'KG', valorUnitario: 11.20, fatorCorrecao: 1.000, categoria: 'AVES' },
  // CARNES/PROTEÍNAS — Bovinos
  { id: 'ins15', nome: 'CARNE BOVINA MOÍDA',          un: 'KG', valorUnitario: 28.90, fatorCorrecao: 1.000, categoria: 'BOVINOS' },
  // Hortifrúti
  { id: 'ins2',  nome: 'CEBOLA',                      un: 'KG', valorUnitario:  3.20, fatorCorrecao: 1.000, categoria: 'HORTIFRÚTI' },
  { id: 'ins4',  nome: 'TOMATE',                      un: 'KG', valorUnitario:  2.29, fatorCorrecao: 1.250, categoria: 'HORTIFRÚTI' },
  { id: 'ins8',  nome: 'LIMÃO',                       un: 'KG', valorUnitario:  8.99, fatorCorrecao: 1.000, categoria: 'HORTIFRÚTI' },
  { id: 'ins16', nome: 'BATATA INGLESA',              un: 'KG', valorUnitario:  4.50, fatorCorrecao: 1.150, categoria: 'HORTIFRÚTI' },
  { id: 'ins17', nome: 'CENOURA',                     un: 'KG', valorUnitario:  3.90, fatorCorrecao: 1.100, categoria: 'HORTIFRÚTI' },
  { id: 'ins6',  nome: 'COGUMELO CHAMPIGNON (FRESCO)',un: 'KG', valorUnitario: 43.00, fatorCorrecao: 1.000, categoria: 'HORTIFRÚTI' },
  // Secos / Cereais / Leguminosas
  { id: 'ins13', nome: 'ARROZ PARBOILIZADO',          un: 'KG', valorUnitario:  5.50, fatorCorrecao: 1.000, categoria: 'SECOS' },
  { id: 'ins14', nome: 'FEIJÃO PRETO',               un: 'KG', valorUnitario:  7.80, fatorCorrecao: 1.000, categoria: 'SECOS' },
  { id: 'ins11', nome: 'AÇÚCAR',                     un: 'KG', valorUnitario:  2.00, fatorCorrecao: 1.000, categoria: 'SECOS' },
  { id: 'ins7',  nome: 'CASTANHA',                   un: 'KG', valorUnitario: 30.00, fatorCorrecao: 1.000, categoria: 'SECOS' },
  // Condimentos / Temperos
  { id: 'ins3',  nome: 'SAL REFINADO',               un: 'KG', valorUnitario:  2.00, fatorCorrecao: 1.000, categoria: 'CONDIMENTOS' },
  { id: 'ins5',  nome: 'ALHO',                       un: 'KG', valorUnitario: 20.99, fatorCorrecao: 1.000, categoria: 'CONDIMENTOS' },
  { id: 'ins9',  nome: 'PIMENTA BRANCA',             un: 'KG', valorUnitario: 42.90, fatorCorrecao: 1.000, categoria: 'CONDIMENTOS' },
  { id: 'ins10', nome: 'AÇAFRÃO',                    un: 'KG', valorUnitario: 14.00, fatorCorrecao: 1.000, categoria: 'CONDIMENTOS' },
  { id: 'ins12', nome: 'AZEITE',                     un: 'ML', valorUnitario: 15.00, fatorCorrecao: 1.000, categoria: 'CONDIMENTOS' },
]

// Exemplo inicial de Ficha Técnica de Preparação conforme anexo do usuário
export const FICHAS_TECNICAS_INICIAIS = [
  {
    id: 'ft_strogonoff',
    nomePreparacao: 'STROGONOFF DE FRANGO',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 20,
    modoPreparo: `1. Limpe e corte o frango em cubos pequenos.
2. Refogue o alho e a cebola na margarina até dourar. Acrescente a carne e deixe refogar por 10 minutos.
3. Acrescente o molho de tomate, o açafrão e o sal. Cozinhe até a carne ficar macia.
4. Acrescente os cogumelos e o creme de castanha. Misture bem e desligue o fogo.

Em geral este prato é servido com arroz e batata palha. Fica muito bom também com legumes no vapor, batata cozida ou com purês de batata, mandioca, inhame.`,
    insumos: [
      { item: 'FRANGO - FILÉ', un: 'KG', pesoBruto: 1.000, pesoLiquido: 1.000, fatorCorrecao: 1.000, valorUnitario: 11.20 },
      { item: 'CEBOLA', un: 'KG', pesoBruto: 0.200, pesoLiquido: 0.155, fatorCorrecao: 1.000, valorUnitario: 3.20 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.030, pesoLiquido: 0.030, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'TOMATE', un: 'KG', pesoBruto: 0.225, pesoLiquido: 0.198, fatorCorrecao: 1.250, valorUnitario: 2.29 },
      { item: 'ALHO', un: 'KG', pesoBruto: 0.025, pesoLiquido: 0.020, fatorCorrecao: 1.000, valorUnitario: 20.99 },
      { item: 'COGUMELO CHAMPIGNON (FRESCO)', un: 'KG', pesoBruto: 0.340, pesoLiquido: 0.340, fatorCorrecao: 1.000, valorUnitario: 43.00 },
      { item: 'CASTANHA', un: 'KG', pesoBruto: 0.150, pesoLiquido: 0.150, fatorCorrecao: 1.000, valorUnitario: 30.00 },
      { item: 'LIMÃO', un: 'KG', pesoBruto: 0.288, pesoLiquido: 0.200, fatorCorrecao: 1.000, valorUnitario: 8.99 },
      { item: 'PIMENTA BRANCA', un: 'KG', pesoBruto: 0.003, pesoLiquido: 0.003, fatorCorrecao: 1.000, valorUnitario: 42.90 },
      { item: 'AÇAFRÃO', un: 'KG', pesoBruto: 0.003, pesoLiquido: 0.003, fatorCorrecao: 1.000, valorUnitario: 14.00 },
      { item: 'AÇÚCAR', un: 'KG', pesoBruto: 0.001, pesoLiquido: 0.003, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'AZEITE', un: 'ML', pesoBruto: 0.001, pesoLiquido: 0.001, fatorCorrecao: 1.000, valorUnitario: 15.00 },
    ],
  },
  {
    id: 'ft_frango_assado',
    nomePreparacao: 'SOBRECOXA ASSADA AO FORNO',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 25,
    modoPreparo: `1. Higienizar e temperar as sobrecoxas com alho amassado, sal, azeite e limão.
2. Dispor em assadeiras sem sobrepor.
3. Levar ao forno combinado pré-aquecido a 180°C por 45 minutos até dourar.`,
    insumos: [
      { item: 'CEBOLA', un: 'KG', pesoBruto: 0.300, pesoLiquido: 0.250, fatorCorrecao: 1.000, valorUnitario: 3.20 },
      { item: 'ALHO', un: 'KG', pesoBruto: 0.050, pesoLiquido: 0.040, fatorCorrecao: 1.000, valorUnitario: 20.99 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.050, pesoLiquido: 0.050, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'AZEITE', un: 'ML', pesoBruto: 0.050, pesoLiquido: 0.050, fatorCorrecao: 1.000, valorUnitario: 15.00 },
    ],
  },
  {
    id: 'ft_carne_moida',
    nomePreparacao: 'CARNE MOÍDA REFOGADA C/ ERVILHA',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 30,
    modoPreparo: `1. Dourar o alho e cebola no azeite.
2. Adicionar a carne moída bovina e refogar bem desfazendo os grumos.
3. Adicionar o tomate, sal e ervilhas. Cozinhar em fogo brando.`,
    insumos: [
      { item: 'CARNE BOVINA MOÍDA', un: 'KG', pesoBruto: 3.500, pesoLiquido: 3.500, fatorCorrecao: 1.000, valorUnitario: 28.90 },
      { item: 'CEBOLA', un: 'KG', pesoBruto: 0.400, pesoLiquido: 0.350, fatorCorrecao: 1.000, valorUnitario: 3.20 },
      { item: 'TOMATE', un: 'KG', pesoBruto: 0.500, pesoLiquido: 0.400, fatorCorrecao: 1.250, valorUnitario: 2.29 },
      { item: 'ALHO', un: 'KG', pesoBruto: 0.040, pesoLiquido: 0.035, fatorCorrecao: 1.000, valorUnitario: 20.99 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.040, pesoLiquido: 0.040, fatorCorrecao: 1.000, valorUnitario: 2.00 },
    ],
  },
  {
    id: 'ft_pure_batata',
    nomePreparacao: 'PURÊ DE BATATA INGLESA',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 30,
    modoPreparo: `1. Lavar, descascar e picar as batatas em cubos uniformes.
2. Cozinhar em água fervente com sal até ficarem macias.
3. Passar pelo espremedor e bater com azeite até obter consistência lisa e cremosa.`,
    insumos: [
      { item: 'BATATA INGLESA', un: 'KG', pesoBruto: 4.500, pesoLiquido: 3.900, fatorCorrecao: 1.150, valorUnitario: 4.50 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.030, pesoLiquido: 0.030, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'AZEITE', un: 'ML', pesoBruto: 0.050, pesoLiquido: 0.050, fatorCorrecao: 1.000, valorUnitario: 15.00 },
    ],
  },
  {
    id: 'ft_arroz_parboilizado',
    nomePreparacao: 'ARROZ PARBOILIZADO SOLTINHO',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 40,
    modoPreparo: `1. Dourar o alho picado no óleo/azeite.
2. Adicionar o arroz parboilizado e refogar por 2 minutos.
3. Acrescentar água fervente na proporção 2:1 e o sal.
4. Cozinhar em fogo brando com a panela semitampada até secar.`,
    insumos: [
      { item: 'ARROZ PARBOILIZADO', un: 'KG', pesoBruto: 3.000, pesoLiquido: 3.000, fatorCorrecao: 1.000, valorUnitario: 5.50 },
      { item: 'ALHO', un: 'KG', pesoBruto: 0.030, pesoLiquido: 0.025, fatorCorrecao: 1.000, valorUnitario: 20.99 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.040, pesoLiquido: 0.040, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'AZEITE', un: 'ML', pesoBruto: 0.050, pesoLiquido: 0.050, fatorCorrecao: 1.000, valorUnitario: 15.00 },
    ],
  },
  {
    id: 'ft_feijao_preto',
    nomePreparacao: 'FEIJÃO PRETO TEMPERADO',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 40,
    modoPreparo: `1. Escolher, lavar e deixar o feijão de molho por 8 a 12 horas (descartar a água do molho).
2. Cozinhar sob pressão com água nova até amolecer os grãos.
3. Em frigideira, refogar o alho e cebola no azeite e incorporar ao feijão.
4. Deixar ferver em fogo brando até o caldo encorpar.`,
    insumos: [
      { item: 'FEIJÃO PRETO', un: 'KG', pesoBruto: 2.500, pesoLiquido: 2.500, fatorCorrecao: 1.000, valorUnitario: 7.80 },
      { item: 'ALHO', un: 'KG', pesoBruto: 0.040, pesoLiquido: 0.035, fatorCorrecao: 1.000, valorUnitario: 20.99 },
      { item: 'CEBOLA', un: 'KG', pesoBruto: 0.300, pesoLiquido: 0.250, fatorCorrecao: 1.000, valorUnitario: 3.20 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.035, pesoLiquido: 0.035, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'AZEITE', un: 'ML', pesoBruto: 0.040, pesoLiquido: 0.040, fatorCorrecao: 1.000, valorUnitario: 15.00 },
    ],
  },
  {
    id: 'ft_cenoura_salsinha',
    nomePreparacao: 'CENOURA COZIDA NO VAPOR C/ SALSINHA',
    profissional: 'Nutricionista HBM',
    fotoUrl: '',
    rendimentoPorcoes: 25,
    modoPreparo: `1. Lavar, descascar e cortar as cenouras em rodelas médias.
2. Cozinhar no vapor até ficar al dente.
3. Finalizar salpicando salsinha fresca picada e um fio de azeite.`,
    insumos: [
      { item: 'CENOURA', un: 'KG', pesoBruto: 2.500, pesoLiquido: 2.250, fatorCorrecao: 1.100, valorUnitario: 3.90 },
      { item: 'SAL REFINADO', un: 'KG', pesoBruto: 0.020, pesoLiquido: 0.020, fatorCorrecao: 1.000, valorUnitario: 2.00 },
      { item: 'AZEITE', un: 'ML', pesoBruto: 0.030, pesoLiquido: 0.030, fatorCorrecao: 1.000, valorUnitario: 15.00 },
    ],
  },
]
