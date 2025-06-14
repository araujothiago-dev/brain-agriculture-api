## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🚀 Executando o projeto com Docker

Este projeto já está configurado para ser executado com **Docker** e **docker-compose**, incluindo o banco de dados PostgreSQL.

### ✅ Pré-requisitos

Antes de executar, certifique-se de ter instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (caso queira executar localmente fora do Docker)
- [DBeaver](https://dbeaver.io/) (opcional, para acessar visualmente o banco de dados)

### ⚙️ Como executar com Docker

```bash
# Subir os containers com a API e o banco de dados
docker-compose up --build
```

Isso irá:

- Criar um container com o PostgreSQL na porta `5432`
- Construir a imagem da API e iniciar em modo de desenvolvimento na porta `3000`

### 🐘 Acessando o banco de dados PostgreSQL

Se quiser acessar o banco via **DBeaver** ou outro cliente, use as credenciais abaixo:

| Parâmetro      | Valor               |
| -------------- | ------------------- |
| Host           | `localhost`         |
| Porta          | `5432`              |
| Usuário        | `postgres`          |
| Senha          | `123456`            |
| Banco de dados | `brain_agriculture` |

### 🚫 Parar os containers

```bash
docker-compose down
```

### 🔄 Reconstruir imagens do Docker

```bash
docker-compose up --build
```

### 📝 Variáveis de ambiente

O arquivo `.env` já está configurado com:

```env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DATABASE=brain_agriculture
```

Essas variáveis são lidas automaticamente pela API para conectar ao banco de dados no container `db`.

### 🧲 Testando a API

Após iniciar os containers, a aplicação estará disponível em:

```
http://localhost:3000
```

Você pode testar endpoints usando Postman, Insomnia ou navegador, dependendo das rotas disponíveis.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

