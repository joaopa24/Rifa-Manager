CREATE TABLE "Usuario" (
  "user_id" integer PRIMARY KEY,
  "name" text,
  "password" varchar(10),
  "reset_token" text,
  "reset_token_expire" text,
  "followed_user_id" integer,
  "is_admin" boolean,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "Pertence" (
  "user_id" integer,
  "rifa_id" integer
);

CREATE TABLE "Rifa" (
  "rifa_id" integer PRIMARY KEY,
  "name" varchar,
  "numberOfTicket" integer,
  "created_at" timestamp,
  "updated_at" timestamp,
  "expire" timestamp
);

CREATE TABLE "Compra" (
  "id_compra" integer PRIMARY KEY,
  "id_user" integer,
  "id_bilhete" integer,
  "created_at" timestamp
);

CREATE TABLE "Bilhete" (
  "id_bilhete" integer PRIMARY KEY,
  "id_rifa" varchar,
  "name" text,
  "status" varchar,
  "created_at" timestamp
);

ALTER TABLE "Pertence" ADD FOREIGN KEY ("user_id") REFERENCES "Usuario" ("user_id");
ALTER TABLE "Pertence" ADD FOREIGN KEY ("rifa_id") REFERENCES "Rifa" ("rifa_id");
ALTER TABLE "Compra" ADD FOREIGN KEY ("id_user") REFERENCES "Usuario" ("user_id");
ALTER TABLE "Bilhete" ADD FOREIGN KEY ("id_rifa") REFERENCES "Rifa" ("rifa_id");
ALTER TABLE "Bilhete" ADD FOREIGN KEY ("id_bilhete") REFERENCES "Compra" ("id_bilhete");