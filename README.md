# Gerenciamento de Rifas    
## Descrição do Sistema
Rifa Manager é um sistema online avançado para gerenciamento de rifas, permitindo que os usuários criem rifas personalizadas com um número específico de bilhetes a um preço fixo. Além disso, os usuários podem adquirir bilhetes de rifas criadas por outros participantes. O sistema também permite que administradores editem rifas criadas por outros usuários, garantindo maior flexibilidade e controle sobre as rifas ativas.

 ## Tecnologias Utilizadas
 
- Nunjucks - 3.2.2
- Javascript -  ECMAScript 2023(ES14)
- PostgreSQL - 16.0
- Node.js - 20.17.0
- Jest - 29.7

## Estrutura do Projeto

```plaintext
Rifa-Manager/
  ├── public/
  |   ├──assets/
  |   ├──images/
  |   ├──scripts/  
  |   └──styles/
  ├── Diagramas/                    
  ├── node_modules/              
  ├── src/
  │   ├── app/
  │   │   ├── controllers/  #Gerencia a lógica de negócios e a comunicação entre modelos e views.       
  │   │   ├── middlewares/  #Intercepta e processa requisições antes de chegarem aos controladores.   
  │   │   ├── models/       #Define as estruturas de dados e interage com o banco de dados.      
  │   │   ├── services/     #Encapsula lógica de negócio complexa para reutilização em vários controladores.         
  |   |   ├── validators/   #Verifica e valida dados de entrada para garantir conformidade.
  │   │   └── views/        #Renderiza a interface de usuário ou gera a resposta visual/textual.
  |   ├── config/
  │   │   ├── db.js/       
  │   │   └──  session.js/      
  │   ├──lib/         
  │   │   ├── mailer.js/                
  |   |   └── utils.js/      
  │   ├──routes/   
  |   |
  │   └──  server.js
  │
  │
  ├── .gitignore                 
  ├── package-lock.json          
  ├── package.json              
  ├── database.sql  
  └── README.md                  # Informações sobre o projeto
```
## Principais Funcionalidades
- Criação de Rifas
- Gerenciamento de Clientes, Rifas e Compras
- Comprar Bilhetes em Rifas de outros Clientes do Sistema
- Administrador tem a capacidade de aprovar ou rejeitar uma Compra

## Padrões de Commits
- feat: Commits que adicionam ou removem uma nova funcionalidade.
- fix: Commits que corrigem um bug.
- refactor: Commits que reescrevem/restruturam o código, mas não alteram o comportamento da API.
- style: Commits que não afetam o significado do código (espaçamento, formatação, ponto e vírgula faltando, etc.).
- test: Commits que adicionam testes ausentes ou corrigem testes existentes.
- docs: Commits que afetam apenas a documentação.
- chore: Commits diversos, como modificação de arquivos .gitignore.

# Boas Práticas 
- Aplicar o Open/Closed Principle (OCP) do SOLID: O sistema vai ser aberto para novas atualizações porém fechado para a modificação da base já criada.
- Siga um Padrão de Notação: Use um estilo de codificação consistente (como nomes de variáveis e indentação) para facilitar a leitura e manutenção do código.
- Comente o Código: Adicione comentários claros para explicar partes complexas do código, mas evite comentar o óbvio. Isso ajuda na compreensão e manutenção.
- Testes Automatizados: testes para verificar se o código funciona corretamente e para evitar problemas futuros.
- Mantenha a Simplicidade (KISS): Faça o código o mais simples possível. Soluções simples são mais fáceis de entender e manter.
- Siga um Padrão de Notação: Use um estilo de codificação consistente (como nomes de variáveis e indentação) para facilitar a leitura e manutenção do código.



# Branchs
- main: Branch principal que sempre deve refletir a versão estável e final do projeto. Não deve ser usada para o desenvolvimento diário.

- development: Branch onde novas funcionalidades e correções são implementadas. O merge para a main deve ocorrer apenas quando todas as funcionalidades e testes estiverem concluídos, garantindo a estabilidade da aplicação.

## Colaboradores
- João Lucas Pereira de Almeida
- João Pedro Dos Reis Moura
- Ketlyn Sara Alves Ribeiro