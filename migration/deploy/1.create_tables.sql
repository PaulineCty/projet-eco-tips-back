-- Deploy ecotips:1.create_tables to pg

BEGIN;

CREATE DOMAIN posint as int CHECK( VALUE >= 0 );
CREATE DOMAIN rating as INTEGER CHECK( VALUE >= 0 AND VALUE <= 5 );
CREATE DOMAIN email as TEXT CHECK( VALUE ~ '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$' );
CREATE DOMAIN color AS TEXT CHECK ( VALUE ~ '^#[a-fA-F0-9]{6}$' );

CREATE TABLE role
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user"
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" email NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "ecocoins" posint NOT NULL DEFAULT 50,
    "score" posint NOT NULL DEFAULT 0,
    "role_id" INTEGER DEFAULT 2 REFERENCES role(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE INDEX email_user_idx ON "user" USING hash(email);

CREATE TABLE card
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "environmental_rating" rating NOT NULL,
    "economic_rating" rating NOT NULL,
    "value" posint NOT NULL,
    "proposal" BOOLEAN NOT NULL DEFAULT TRUE,
    "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE INDEX proposal_card_idx ON "card" USING hash(proposal);

CREATE TABLE tag
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "color" color NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE achievement 
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" TEXT NOT NULL UNIQUE, 
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "proposal" BOOLEAN NOT NULL DEFAULT TRUE,
    "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE user_card
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    "card_id" INTEGER REFERENCES card(id) ON DELETE CASCADE,
    "expiration_date" DATE NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE INDEX user_id_user_card_idx ON "user_card" USING hash(user_id);
CREATE INDEX card_id_user_card_idx ON "user_card" USING hash(card_id);

CREATE TABLE tag_card
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "tag_id" INTEGER REFERENCES tag(id) ON DELETE CASCADE,
    "card_id" INTEGER REFERENCES card(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
