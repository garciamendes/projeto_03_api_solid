# APP

GyPass style app.

## RFs (Requisitos funcionais)
    - [X] Deve ser possível se cadastrar;
    - [X] Deve ser possível se autenticar;
    - [X] Deve ser possível obter o perfil de um usuario logado;
    - [] Deve ser possível obter o número de check-ins realizado pelo usuário logado;
    - [] Deve ser possível o usuário obter seu histórico de check-ins;
    - [] Deve ser possível o usuário buscar academias próximas;
    - [] Deve ser possível o usuário buscar academias pelo nome;
    - [X] Deve ser possível o usuário realizar check-in em uma academia;
    - [] Deve ser possível validar o check-in de um usuário;
    - [X] Deve ser possível cadastrar uma academias;

## RNs (Regras de negócio)
    - [X] O usuário não deve ser cadastrar com um e-mail duplicado;
    - [X] O usuário não pode fazer 2 check-ins no mesmo dia;
    - [X] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
    - [] O check-in dó pode ser validado até 20 minutos após criado;
    - [] O check-in só pode ser validado por administradores;
    - [] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)
    - [X] A senha do usuário precisa estar criptografado;
    - [X] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
    - [] Todas listas de dados precisam estar paginadas com 20 itens por página;
    - [] O usuário deve ser identificado por um JWT (JSON Web Token);
