export const populate = `/* Script SQL para criação e povoamento de tabelas 
Grupo: 
	Gabriel		(gvmgs)
	Jailson		(jcd2)
	Leonardo	(las3)
	Marcos		(msb5)
	Matheus		(mlrbc)
	Moabe		(mrov)
	Thomas 		(tafm)
	Vinicius	(vrm)
*/

-- 1. Criação de tabelas

-- 1.1 Pessoa

CREATE TABLE Pessoa (
	cpf varchar(15),
	nome varchar(50) NOT NULL,
	datanascimento timestamp(0) NOT NULL,
	sexo char(1) NOT NULL,
	CONSTRAINT pessoa_pkey PRIMARY KEY (cpf),
	CONSTRAINT pessoa_checkSexo CHECK (sexo In ('M', 'F'))
);

-- 1.2 Endereço

CREATE TABLE Endereco (
	cpf_pessoa varchar(15),
	cep varchar(30) NOT NULL,
	cidade varchar(30) NOT NULL,
	bairro varchar(50) NOT NULL,
	rua varchar(50) NOT NULL,
	numero varchar(20) NOT NULL,
	CONSTRAINT endereco_pkey PRIMARY KEY (cpf_pessoa),
	CONSTRAINT endereco_fkey1 FOREIGN KEY (cpf_pessoa) REFERENCES Pessoa (cpf)
);

-- 1.3 Telefone

CREATE TABLE Telefone (
	cpf varchar(15),
	numero varchar(50),
	CONSTRAINT telefone_pkey1 PRIMARY KEY (cpf, numero),
	CONSTRAINT pessoa_fkey1 FOREIGN KEY (cpf) REFERENCES Pessoa (cpf)
);

-- 1.4 Plano

CREATE TABLE Plano (
	descricao varchar(50),
	preco decimal(5,2) NOT NULL,
	CONSTRAINT plano_pkey PRIMARY KEY (descricao)
);

-- 1.5 Assinante

CREATE TABLE Assinante (
	cpf varchar(15),
	plano varchar(50) NOT NULL,
	dataAssinatura timestamp(0) NOT NULL,
	CONSTRAINT assinante_pkey PRIMARY KEY (cpf),
	CONSTRAINT assinante_pessoa_fkey1 FOREIGN KEY (cpf) REFERENCES Pessoa (cpf),
	CONSTRAINT assinante_plano_fkey2 FOREIGN KEY (plano) REFERENCES Plano (descricao)
);

-- 1.6 Funcionário

CREATE TABLE Funcionario (
	cpf varchar(15),
	salario decimal(10,2) NOT NULL,
	dataAdmissao timestamp(0) NOT NULL,
	CONSTRAINT funcionario_pkey1 PRIMARY KEY (cpf),
	CONSTRAINT func_pessoa_fkey1 FOREIGN KEY (cpf) REFERENCES Pessoa (cpf),
	CONSTRAINT Funcionario_checkSal CHECK (salario >= 880.00)
);

-- 1.7 Fotografo

CREATE TABLE Fotografo (
	cpf varchar(15),
	certificado bytea,
	CONSTRAINT fotografo_pkey1 PRIMARY KEY (cpf),
	CONSTRAINT fotografo_funcionario_fkey1 FOREIGN KEY (cpf) REFERENCES Funcionario (cpf)
);

-- 1.8 Jornalista

CREATE TABLE Jornalista (
	cpf varchar(15),
	mtb varchar(20),
	cpf_supervisor varchar(15),
	CONSTRAINT jornalista_pkey1 PRIMARY KEY (cpf),
	CONSTRAINT jornalista_funcionario_fkey1 FOREIGN KEY (cpf) REFERENCES Funcionario (cpf),
	CONSTRAINT jornalista_fkey1 FOREIGN KEY (cpf_supervisor) REFERENCES Jornalista (cpf)
);

-- 1.9 Titulação

CREATE TABLE Titulacao (
	cpf varchar(15),
	data timestamp(0) NOT NULL,
	instituicao varchar(50) NOT NULL,
	grau varchar(30) NOT NULL,
	CONSTRAINT titulacao_jornalista_fkey1 FOREIGN KEY (cpf) REFERENCES Jornalista (cpf)  
);

-- 1.10 Edição

CREATE SEQUENCE ID_EDICAO
	minvalue 1
	maxvalue 9999999999
	start with 1
	increment by 1
	cycle
;

CREATE TABLE Edicao (
	numero integer,
	cpf_chefe varchar(15),
	data timestamp(0) NOT NULL,
	CONSTRAINT edicao_pkey PRIMARY KEY (numero),
	CONSTRAINT edicao_jornalista_fkey1 FOREIGN KEY (cpf_chefe) REFERENCES Jornalista (cpf)
);

-- 1.11 Seção

CREATE TABLE Secao (
	nome varchar(30),
	cpf_coord varchar(15),
	CONSTRAINT secao_pkey PRIMARY KEY (nome),
	CONSTRAINT secao_jornalista_fkey1 FOREIGN KEY (cpf_coord) REFERENCES Jornalista (cpf)
);

-- 1.12 Matéria

CREATE SEQUENCE ID_MATERIA
	minvalue 1
	maxvalue 9999999999
	start with 1
	increment by 1
	cycle
;

CREATE TABLE Materia (
	id integer,
	secao varchar(30),
	edicao integer,
	titulo varchar(255) NOT NULL,
	conteudo TEXT,
	anexos TEXT,
	CONSTRAINT materia_pkey PRIMARY KEY (id),
	CONSTRAINT materia_edicao_fkey1 FOREIGN KEY (edicao) REFERENCES Edicao (numero),
	CONSTRAINT materia_secao_fkey2 FOREIGN KEY (secao) REFERENCES Secao (nome)
 );

-- 1.13 Jornalista <escreve> Matéria

CREATE TABLE JornTrabMateria (
	cpf varchar(15),
	id_materia integer,
	CONSTRAINT jorntab_pkey PRIMARY KEY (cpf, id_materia),
	CONSTRAINT jorntab_jornalista_fkey1 FOREIGN KEY (cpf) REFERENCES Jornalista (cpf),
	CONSTRAINT jorntab_materia_fkey2 FOREIGN KEY (id_materia) REFERENCES Materia (id)
);

-- 1.14 Premiação

CREATE SEQUENCE ID_PREMIACAO
	minvalue 1
	maxvalue 9999999999
	start with 1
	increment by 1
	cycle
;

CREATE TABLE Premiacao (
	id integer,
	evento varchar(50) NOT NULL,
	data timestamp(0) NOT NULL,
	categoria varchar(50),
	CONSTRAINT Premiacao_pkey PRIMARY KEY (id)
);

-- 1.15 (Jornalista <escreve> Matéria) <ganha> Premiação

CREATE TABLE Ganha (
    premiacao integer,
    cpf varchar(15),
    id_materia integer,
    CONSTRAINT ganha_pkey PRIMARY KEY (cpf, id_materia, premiacao),
    CONSTRAINT ganha_premiacao_fkey1 FOREIGN KEY (premiacao) REFERENCES Premiacao (id),
    CONSTRAINT ganha_jortrabmateria_fkey2 FOREIGN KEY (cpf, id_materia) REFERENCES JornTrabMateria (cpf, id_materia)
);

-- 1.16 Fotos

CREATE SEQUENCE ID_FOTO
	minvalue 1
	maxvalue 9999999999
	start with 1
	increment by 1
	cycle
;

CREATE TABLE Foto (
	id integer,
	fotografo varchar(15),
	materia integer,
	foto BYTEA,
	CONSTRAINT foto_pkey PRIMARY KEY (id),
	CONSTRAINT foto_fotografo_fkey1 FOREIGN KEY (fotografo) REFERENCES Fotografo (cpf),
	CONSTRAINT foto_materia_fkey2 FOREIGN KEY (materia) REFERENCES Materia (id)
);

-- 2. Povoamento de tabelas

-- 2.1 Pessoa

INSERT INTO Pessoa(cpf, nome, datanascimento, sexo) VALUES
 ('123456789-45', 'Leonardo Alves',       TO_DATE('16/12/1996', '%d/%m/%Y'), 'M'),
 ('888777666-85', 'Marcos Barreto',       TO_DATE('16/08/1996', '%d/%m/%Y'), 'M'),
 ('456228741-99', 'Afonso Gomes',         TO_DATE('09/05/1987', '%d/%m/%Y'), 'M'),
 ('648752006-56', 'Roberto Andrade',      TO_DATE('30/05/1990', '%d/%m/%Y'), 'M'),
 ('160742365-48', 'Alice Ayres',          TO_DATE('01/01/2000', '%d/%m/%Y'), 'F'),
 ('283492009-11', 'Ana Maria',            TO_DATE('10/05/1997', '%d/%m/%Y'), 'F'),
 ('945632778-12', 'Ana Alves',            TO_DATE('02/02/1987', '%d/%m/%Y'), 'F'),
 ('549316775-00', 'Bob Jones',            TO_DATE('05/06/1988', '%d/%m/%Y'), 'M'),
 ('654823004-11', 'Amanda Nunes',         TO_DATE('06/04/1944', '%d/%m/%Y'), 'F'),
 ('684997235-01', 'João Silva',           TO_DATE('10/07/1980', '%d/%m/%Y'), 'M'),
 ('234908724-88', 'Vitor Pereira',        TO_DATE('15/12/1995', '%d/%m/%Y'), 'M'),
 ('171615142-21', 'Amanda Kezia',         TO_DATE('23/10/1994', '%d/%m/%Y'), 'F'),
 ('881391402-21', 'Letícia Silva',        TO_DATE('01/11/1980', '%d/%m/%Y'), 'F'),
 ('143234503-91', 'Cláudio Roberto',      TO_DATE('09/10/1977', '%d/%m/%Y'), 'M'),
 ('144319847-45', 'Antônio Flávio',       TO_DATE('08/03/1990', '%d/%m/%Y'), 'M'),
 ('238432464-99', 'Priscila Alcântara',   TO_DATE('25/06/1979', '%d/%m/%Y'), 'F'),
 ('234353455-44', 'Maria Aparecida',      TO_DATE('20/09/1960', '%d/%m/%Y'), 'F'),
 ('893451348-30', 'Renato Arruda',        TO_DATE('30/03/1990', '%d/%m/%Y'), 'M'),
 ('635752445-80', 'Ricardo Junior',       TO_DATE('05/12/1972', '%d/%m/%Y'), 'M'),
 ('353234979-23', 'Regina Oliveira',      TO_DATE('10/08/1996', '%d/%m/%Y'), 'F'),
 ('658775462-03', 'Catarina Abreu',       TO_DATE('28/02/1988', '%d/%m/%Y'), 'F'),
 ('782662490-13', 'Alberto Maia',         TO_DATE('13/12/1977', '%d/%m/%Y'), 'M'),
 ('665482660-02', 'Francisco Cunha',      TO_DATE('02/08/1968', '%d/%m/%Y'), 'M'),
 ('554826331-22', 'Julia Andrade',        TO_DATE('03/02/1998', '%d/%m/%Y'), 'F'),
 ('785663215-00', 'Roberto Santos',       TO_DATE('16/07/1973', '%d/%m/%Y'), 'M'),
 ('153664872-66', 'Robin Wood',           TO_DATE('06/12/1939', '%d/%m/%Y'), 'M'),
 ('456987415-44', 'Roberta Gomes',        TO_DATE('01/01/1944', '%d/%m/%Y'), 'F'),
 ('785441365-99', 'Marcelo Resende',      TO_DATE('02/03/1955', '%d/%m/%Y'), 'M'),
 ('548662300-11', 'Edinanci Gomes',       TO_DATE('06/08/1982', '%d/%m/%Y'), 'F'),
 ('569552330-32', 'Amanda Freitas',       TO_DATE('22/12/1974', '%d/%m/%Y'), 'F');

-- 2.2 Endereço

INSERT INTO Endereco(cpf_pessoa, cep, cidade, bairro, rua, numero) VALUES
 ('123456789-45', '44900000', 'Irecê',          'Bairro',               'Rua Aquela Mesma',     '16'    ),
 ('888777666-85', '99212300', 'Irecê',          'Bairro2',              'Rua do Beco',          '188'   ),
 ('456228741-99', '05465203', 'São Paulo',      'Liberdade',            'Av.Paulista',          '548'   ),
 ('648752006-56', '54862066', 'Rio de Janeiro', 'Leblon',               'Rua 10',               '9'     ),
 ('160742365-48', '98212340', 'Irecê',          'Recanto',              'Antonio Cardoso',      '61'    ),
 ('283492009-11', '54896211', 'Brasília',       'Centro',               'Rua JK',               '7'     ),
 ('945632778-12', '66975233', 'São Paulo',      'Morumbi',              'Av. Santo Antônio',    '400'   ),
 ('549316775-00', '75264977', 'Acre',           'Floresta',             'Árvore',               '7'     ),
 ('654823004-11', '65482236', 'Recife',         'CDU',                  'Polidoro',             '344'   ),
 ('684997235-01', '95877236', 'Recife',         'CDU',                  'UFPE',                 '455'   ),
 ('234908724-88', '23456000', 'Recife',         'Bairro do Caxanga',    'Avenida Caxangá',      '230'   ),
 ('171615142-21', '77800000', 'Recife',         'Várzea',               'João F. Lisboa',       '120'   ),
 ('881391402-21', '99134817', 'Fortaleza',      'Padre Miguel',         'Marechal Deodoro',     '23'    ),
 ('143234503-91', '88123491', 'Caruaru',        'Centro',               'Agamenon Magalhães',   '23'    ),
 ('144319847-45', '23495302', 'Palmas',         'Floresta',             'Prefeito Miguel',      '621'   ),
 ('238432464-99', '83475843', 'Florianópolis',  'Mangue',               'Madre Tereza',         '33'    ),
 ('234353455-44', '14124984', 'Porto Alegre',   'Conde Boa Vista',      'Mariano Amaro',        '21'    ),
 ('893451348-30', '82886234', 'São Paulo',      'Cracolândia',          'Rua da Neblina',       '66'    ),
 ('635752445-80', '23476784', 'Rio de Janeiro', 'Nova Morada',          'Teófilo Antônio',      '99'    ),
 ('353234979-23', '82346248', 'Santos',         'Litoral',              'Av. Mascarenhas',      '806'   ),
 ('658775462-03', '35741200', 'Fortaleza',      'Meireles',             'Rua Oswaldo Cruz',     '1'     ),
 ('782662490-13', '60160230', 'Fortaleza',      'Aldeota',              'Av.Don Luis',          '1200'  ),
 ('665482660-02', '96578266', 'Manaus',         'Adrianópolis',         'Av.Mario Ypiranga',    '1300'  ),
 ('554826331-22', '56475300', 'Manaus',         'Japiim',               'Rua Santa Luzia',      '438'   ),
 ('785663215-00', '06955712', 'João Pessoa',    'Tambaú',               'Av.Rui Carneiro',      '232'   ),
 ('153664872-66', '32654788', 'Rondonia',       'Flodoaldo Pinto',      'Av.Rio Madeira',       '3288'  ),
 ('456987415-44', '45987455', 'São Luis',       'Jaracati',             'Av.Prof.Carlos Cunha', '1000'  ),
 ('785441365-99', '45699822', 'Porto Alegre',   'Carvalhada',           'Av.Eduardo Prado',     '425'   ),
 ('548662300-11', '45698520', 'Porto Alegre',   'Boa Vista',            'Av.Nilo Peçanha',      '2131'  ),
 ('569552330-32', '32145874', 'Porto Alegre',   'Praia de Belas',       'Praia de Belas',       '1181'  );

-- 2.3 Telefone

INSERT INTO Telefone(cpf, numero) VALUES
 ('123456789-45', '081-982661311'),
 ('123456789-45', '074-9818-9022'),
 ('123456789-45', '074-999473373'),
 ('888777666-85', '055-946223584'),
 ('888777666-85', '081-994687752'),
 ('684997235-01', '021-994627756'),
 ('684997235-01', '021-956317785'),
 ('684997235-01', '055-976331520'),
 ('283492009-11', '091-936547785'),
 ('283492009-11', '081-912003600');

-- 2.4 Plano

INSERT INTO Plano(descricao, preco) VALUES
 ('Básico',    10.00),
 ('Combo',     15.00),
 ('Ultra',     20.00);

-- 2.5 Assinante

INSERT INTO Assinante(cpf, plano, dataAssinatura) VALUES
 ('123456789-45', 'Combo',   TO_DATE('05/04/2013', '%d/%m/%Y')),
 ('888777666-85', 'Básico',  TO_DATE('12/09/2015', '%d/%m/%Y')),
 ('456228741-99', 'Básico',  TO_DATE('27/01/2010', '%d/%m/%Y')),
 ('648752006-56', 'Ultra',   TO_DATE('15/06/2012', '%d/%m/%Y')),
 ('160742365-48', 'Básico',  TO_DATE('01/12/2012', '%d/%m/%Y')),
 ('283492009-11', 'Básico',  TO_DATE('21/02/2008', '%d/%m/%Y')),
 ('945632778-12', 'Básico',  TO_DATE('07/10/2016', '%d/%m/%Y')),
 ('549316775-00', 'Combo',   TO_DATE('20/07/2011', '%d/%m/%Y')),
 ('654823004-11', 'Combo',   TO_DATE('16/01/2015', '%d/%m/%Y')),
 ('684997235-01', 'Ultra',   TO_DATE('23/05/2014', '%d/%m/%Y'));

-- 2.6 Funcionário

INSERT INTO Funcionario(cpf, salario, dataAdmissao) VALUES
 ('234908724-88', 1500.00, TO_DATE('13/10/2014', '%d/%m/%Y')),
 ('171615142-21', 1450.00, TO_DATE('30/11/2015', '%d/%m/%Y')),
 ('881391402-21', 1600.00, TO_DATE('20/02/2014', '%d/%m/%Y')),
 ('143234503-91', 2000.00, TO_DATE('29/08/2012', '%d/%m/%Y')),
 ('144319847-45', 1400.00, TO_DATE('06/01/2016', '%d/%m/%Y')),
 ('238432464-99', 1500.00, TO_DATE('25/10/2012', '%d/%m/%Y')),
 ('234353455-44', 1650.00, TO_DATE('09/03/2012', '%d/%m/%Y')),
 ('893451348-30', 1800.00, TO_DATE('12/05/2013', '%d/%m/%Y')),
 ('635752445-80', 1900.00, TO_DATE('18/12/2013', '%d/%m/%Y')),
 ('353234979-23', 1760.00, TO_DATE('24/07/2014', '%d/%m/%Y')),
 ('658775462-03', 1600.00, TO_DATE('15/08/2014', '%d/%m/%Y')),
 ('782662490-13', 1000.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('665482660-02', 1250.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('554826331-22', 3000.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('785663215-00', 1950.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('153664872-66', 1550.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('456987415-44', 4650.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('785441365-99', 1700.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('548662300-11', 1900.00, TO_DATE('05/10/2011', '%d/%m/%Y')),
 ('569552330-32', 1650.00, TO_DATE('05/10/2011', '%d/%m/%Y'));

-- 2.7 Fotógrafo

INSERT INTO Fotografo(cpf, certificado) VALUES
 ('234908724-88', NULL),
 ('171615142-21', NULL),
 ('881391402-21', NULL),
 ('143234503-91', NULL),
 ('144319847-45', NULL),
 ('238432464-99', NULL),
 ('234353455-44', NULL),
 ('893451348-30', NULL),
 ('635752445-80', NULL),
 ('353234979-23', NULL);

-- 2.8 Jornalista

INSERT INTO Jornalista(cpf, mtb, cpf_supervisor) VALUES
 ('554826331-22', '22355/99/23/PE', '554826331-22'),
 ('456987415-44', '09833/53/87/AL', '456987415-44'),
 ('658775462-03', '92425/12/43/SP', '554826331-22'),
 ('782662490-13', '23490/01/65/RJ', '456987415-44'),
 ('665482660-02', '38495/24/45/SP', '554826331-22'),
 ('785663215-00', '28421/71/42/PE', '456987415-44'),
 ('153664872-66', '20349/12/10/RS', '554826331-22'),
 ('785441365-99', '83452/49/23/CE', '456987415-44'),
 ('548662300-11', '35983/36/84/RN', '554826331-22'),
 ('569552330-32', '05235/25/67/AC', '456987415-44');

-- 2.9 Titulação

INSERT INTO Titulacao(cpf, data, instituicao, grau) VALUES
 ('658775462-03', TO_DATE('22/04/1979','%d/%m/%Y') , 'Universidade Federal de Pernambuco'            , 'Bacharelado'  ),
 ('782662490-13', TO_DATE('30/10/1984','%d/%m/%Y') , 'Universidade Estadual de São Paulo'            , 'Mestrado'     ),
 ('665482660-02', TO_DATE('25/12/2000','%d/%m/%Y') , 'Universidade Federal do Rio de Janeiro'        , 'Bacharelado'  ),
 ('554826331-22', TO_DATE('07/09/1996','%d/%m/%Y') , 'Universidade Católica de Pernambuco'           , 'Bacharelado'  ),
 ('785663215-00', TO_DATE('01/04/1986','%d/%m/%Y') , 'Pontifícia Universidade Católica de São Paulo' , 'Bacharelado'  ),
 ('153664872-66', TO_DATE('06/10/1991','%d/%m/%Y') , 'Universidade Federal de Pernambuco'            , 'Mestrado'     );

-- 2.10 Edição

INSERT INTO Edicao(numero, cpf_chefe, data) VALUES
 (nextval('ID_EDICAO'),   '554826331-22', TO_DATE('01/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '456987415-44', TO_DATE('02/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '456987415-44', TO_DATE('03/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '456987415-44', TO_DATE('04/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '554826331-22', TO_DATE('05/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '456987415-44', TO_DATE('06/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '554826331-22', TO_DATE('07/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '554826331-22', TO_DATE('08/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '554826331-22', TO_DATE('09/04/2014', 'dd/MM/yyyy')),
 (nextval('ID_EDICAO'),   '456987415-44', TO_DATE('10/04/2014', 'dd/MM/yyyy'));

-- 2.11 Seção

INSERT INTO Secao(nome, cpf_coord) VALUES
 ('Esportes',      '782662490-13'),
 ('Policial',      '554826331-22'),
 ('Cultura',       '153664872-66'),
 ('Política',      '785441365-99'),
 ('Famosos',       '569552330-32'),
 ('Economia',      '569552330-32');

-- 2.12 Matéria

INSERT INTO Materia(id, secao, edicao, titulo, conteudo, anexos) VALUES
 (nextval('ID_MATERIA'), 'Esportes',     1, 'Vasco perde e é vice novamente',                NULL, NULL),
 (nextval('ID_MATERIA'), 'Policial',     1, 'Traficante é encontrado morto',                 NULL, NULL),
 (nextval('ID_MATERIA'), 'Famosos',      2, 'Silvio Santos casa com Elen',                   NULL, NULL),
 (nextval('ID_MATERIA'), 'Cultura',      2, 'Filme Aquarius estreia no cinema',              NULL, NULL),
 (nextval('ID_MATERIA'), 'Política',     3, 'Cunha disputará segundo turno com Bolsonaro',   NULL, NULL),
 (nextval('ID_MATERIA'), 'Famosos',      4, 'Ana Maria Braga engordou 0.4 kg',               NULL, NULL),
 (nextval('ID_MATERIA'), 'Esportes',     5, 'Santa Cruz avança na sulamericana',             NULL, NULL),
 (nextval('ID_MATERIA'), 'Política',     5, 'Nova capa da Veja trás denúncia contra Lula',   NULL, NULL),
 (nextval('ID_MATERIA'), 'Economia',     6, 'China lança nova moeda',                        NULL, NULL),
 (nextval('ID_MATERIA'),'Economia',     7, 'Bitcoin sobe 20% em uma semana',                NULL, NULL);

-- 2.13 Jornalista <escreve> Matéria

INSERT INTO JornTrabMateria(cpf, id_materia) VALUES
 ('658775462-03', 1),
 ('782662490-13', 1),
 ('665482660-02', 2),
 ('554826331-22', 3),
 ('785663215-00', 4),
 ('153664872-66', 5),
 ('456987415-44', 5),
 ('554826331-22', 6),
 ('785441365-99', 6),
 ('782662490-13', 7),
 ('456987415-44', 8),
 ('569552330-32', 9),
 ('569552330-32', 10);

-- 2.14 Premiação

INSERT INTO Premiacao (id, evento, data, categoria) VALUES
 (nextval('ID_PREMIACAO'), 'Pulitzer',    TO_DATE('07/09/2014', 'dd/MM/yyyy'), 'Melhor cobertura eleitoral'               ),
 (nextval('ID_PREMIACAO'), 'Pulitzer',    TO_DATE('07/09/2014', 'dd/MM/yyyy'), 'Melhor matéria esportiva'                 ),
 (nextval('ID_PREMIACAO'), 'Esso',        TO_DATE('02/01/2015', 'dd/MM/yyyy'), 'Contribuição investigativa'               ),
 (nextval('ID_PREMIACAO'), 'Esso',        TO_DATE('02/01/2015', 'dd/MM/yyyy'), 'Emoção esportiva'                         ),
 (nextval('ID_PREMIACAO'), 'Petrobras',   TO_DATE('25/07/2014', 'dd/MM/yyyy'), 'Premio de incentivo ao cinema nacional'   ),
 (nextval('ID_PREMIACAO'), 'Petrobras',   TO_DATE('25/07/2014', 'dd/MM/yyyy'), 'Premio de imparcialidade política'        ),
 (nextval('ID_PREMIACAO'), 'Fapeam',      TO_DATE('03/11/2014', 'dd/MM/yyyy'), 'Cobertura policial'                       ),
 (nextval('ID_PREMIACAO'), 'Fapeam',      TO_DATE('03/11/2014', 'dd/MM/yyyy'), 'Economia'                                 ),
 (nextval('ID_PREMIACAO'), 'MPT',         TO_DATE('15/10/2014', 'dd/MM/yyyy'), 'Melhor análise econômica'                 ),
 (nextval('ID_PREMIACAO'), 'MPT',         TO_DATE('15/10/2014', 'dd/MM/yyyy'), 'Matéria mais divertida'                   );

-- 2.15 (Jornalista <escreve> Matéria) <ganha> Premiação

INSERT INTO Ganha(premiacao, cpf, id_materia) VALUES
 (1,   '658775462-03', 1),
 (2,   '782662490-13', 1),
 (3,   '665482660-02', 2),
 (4,   '554826331-22', 3),
 (5,   '785663215-00', 4),
 (6,   '153664872-66', 5),
 (7,   '456987415-44', 5),
 (8,   '554826331-22', 6),
 (9,   '785441365-99', 6),
 (10,  '782662490-13', 7);

-- 2.16 Fotos

INSERT INTO Foto (id, fotografo, materia, foto) VALUES
 (nextval('ID_FOTO'),   '234908724-88', 1,  NULL),
 (nextval('ID_FOTO'),   '234908724-88', 1,  NULL),
 (nextval('ID_FOTO'),   '171615142-21', 2,  NULL),
 (nextval('ID_FOTO'),   '171615142-21', 1,  NULL),
 (nextval('ID_FOTO'),   '881391402-21', 3,  NULL),
 (nextval('ID_FOTO'),   '881391402-21', 3,  NULL),
 (nextval('ID_FOTO'),   '143234503-91', 3,  NULL),
 (nextval('ID_FOTO'),   '144319847-45', 6,  NULL),
 (nextval('ID_FOTO'),   '238432464-99', 10, NULL),
 (nextval('ID_FOTO'),   '234353455-44', 8,  NULL);
`;
