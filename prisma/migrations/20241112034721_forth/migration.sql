-- AlterTable
CREATE SEQUENCE todos_id_seq;
ALTER TABLE "todos" ALTER COLUMN "id" SET DEFAULT nextval('todos_id_seq');
ALTER SEQUENCE todos_id_seq OWNED BY "todos"."id";
