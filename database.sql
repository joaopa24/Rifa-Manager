CREATE TABLE "Cliente" (
  "client_id" INTEGER PRIMARY KEY,
  "name" TEXT,
  "password" VARCHAR(20),
  "email" TEXT,
  "cpf" VARCHAR(11),
  "celular" VARCHAR(11),
  "reset_token" TEXT,
  "reset_token_expire" TEXT,
  "is_admin" BOOLEAN,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

CREATE TABLE "Rifa" (
  "rifa_id" INTEGER PRIMARY KEY,
  "client_id" INTEGER,
  "name" VARCHAR,
  "numeroBilhetes" INTEGER,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "expire" TIMESTAMP,
  FOREIGN KEY ("client_id") REFERENCES "Cliente" ("client_id")
);

CREATE TABLE "Bilhete" (
  "id_bilhete" INTEGER PRIMARY KEY,
  "id_rifa" INTEGER,
  "name" TEXT,
  "status" VARCHAR,
  "created_at" TIMESTAMP,
  FOREIGN KEY ("id_rifa") REFERENCES "Rifa" ("rifa_id")
);

CREATE TABLE "Compra" (
  "compra_id" INTEGER PRIMARY KEY,
  "client_id" INTEGER,
  "bilhete_id" INTEGER,
  "created_at" TIMESTAMP,
  "amount" FLOAT 
  "status" BOOLEAN,
  FOREIGN KEY ("client_id") REFERENCES "Cliente" ("client_id"),
  FOREIGN KEY ("bilhete_id") REFERENCES "Bilhete" ("id_bilhete")
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "path" TEXT NOT NULL
);

CREATE TABLE "rifa_files" (
  "id" SERIAL PRIMARY KEY,
  "rifa_id" int NOT NULL,
  "file_id" int NOT NULL
);

CREATE TABLE "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  PRIMARY KEY ("sid")
) WITH (OIDS=FALSE);

-- Não é necessário incluir estas duas linhas de novo pois já foram criadas:
-- ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Removi os comandos de tabelas não incluídas (chefs, recipes) pois não tinham relação com as demais tabelas criadas.

-- Não é necessário incluir estas duas linhas de novo pois já foram criadas:
-- ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Removi os comandos de tabelas não incluídas (chefs, recipes) pois não tinham relação com as demais tabelas criadas.
