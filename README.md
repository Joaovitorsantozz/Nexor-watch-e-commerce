**# Nexor Watch E-commerce**

E-commerce full-stack desenvolvido com React, TypeScript, Node.js e Express, 
com autenticação JWT, fluxo completo de pedidos e painel administrativo.

**# Demonstração Usuário**
1)Página Inicial
<img width="1920" height="2877" alt="image" src="https://github.com/user-attachments/assets/8231e45b-6c5e-4a7f-b8f3-a33cd5c4024d" />

2)Carrinho
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f767f97e-73e2-41c6-9c16-a2360f9ee840" />

3)Pedidos feitos 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/65124408-f813-4268-af64-6315467a2c2a" />

4)Área do Usuário / Endereços Cadastrados / Área dos Favoritos
<img width="1891" height="3011" alt="image" src="https://github.com/user-attachments/assets/b7a268dc-364b-48f2-8878-b2d222e588fb" />

**# Demonstração Admin**

1) Cadastrar produtos / Editar produtos
<img width="1920" height="2151" alt="image" src="https://github.com/user-attachments/assets/7f699dac-e619-4f46-a494-5fa77c47395f" />

2) Procurar usuários por email (sem expor informações sensíveis)
<img width="1898" height="1080" alt="image" src="https://github.com/user-attachments/assets/024af2a0-85af-48ad-a258-fa3186c94054" />

3)Verificar pedidos pendentes / Alterar roles de status do pedidos
<img width="1920" height="1882" alt="image" src="https://github.com/user-attachments/assets/b5211ab2-db4f-4972-8752-2d8bf273f9cd" />



#TECNOLOGIAS UTILIZADAS

### Front-end
 - React 
 - Typescript
 - React Router
 - Axios / Fetch
 - Yup
 
### Back-end
 - Node + express
 - Typescript
 - JWT
 - Bcrypt

### Data-base
  - MySQL


# FUNCIONALIDADES

### Usuário
- Cadastro e login com autenticação JWT
- Atualização de dados pessoais
- Gerenciamento de endereços
- Favoritar e desfavoritar produtos
- Histórico de pedidos

### Produtos
- Listagem de produtos ativos
- Busca por produto
- Detalhes do produto
- Upload de imagens

### Pedidos
- Criação de pedidos
- Associação de endereço
- Controle de status (PAID, CANCELLED)

### Admin
- Cadastro, edição e exclusão de produtos
- Listagem de todos os pedidos
- Atualização do status do pedido
- Listagem de usuários por email

# ARQUITETURA
 O projeto segue uma arquitetura em camadas:

- Controllers: recebem requisições HTTP
- Services: concentram a lógica de negócio
- Routes: definição das rotas
- Middlewares: autenticação e validações



