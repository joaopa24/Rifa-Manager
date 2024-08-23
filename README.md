# Gerenciamento de Rifas    
## Descrição do Sistema
Rifa Manager é um sistema online avançado para gerenciamento de rifas, permitindo que os usuários criem rifas personalizadas com um número específico de bilhetes a um preço fixo. Além disso, os usuários podem adquirir bilhetes de rifas criadas por outros participantes. O sistema também permite que administradores editem rifas criadas por outros usuários, garantindo maior flexibilidade e controle sobre as rifas ativas.

 ## Tecnologias Utilizadas
- **React.Js - 18.2.0**
- **Styled Components - 6.1.12**
- **Javascript -  ECMAScript 2023(ES14)**
- **PostgreSQL - 16.0**
- **Node.js - 20.9.0**
- **Jest - 29.7**

## Estrutura do Projeto

```plaintext
Rifa-Manager/
  ├── public/                 
  ├── Diagramas/                    
  ├── node_modules/              
  ├── src/
  │   ├── app/
  │   │   ├── controllers/       
  │   │   ├── middlewares/      
  │   │   ├── models/            
  │   │   ├── services/               
  |   |   ├── validators/ 
  │   │   └── views/       
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

## Colaboradores
- João Lucas Pereira de Almeida
- João Pedro Dos Reis Moura
- Ketlyn Sara Alves Ribeiro