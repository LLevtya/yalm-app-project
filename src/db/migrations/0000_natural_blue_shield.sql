CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"content_id" varchar,
	"title" varchar NOT NULL,
	"descript" text,
	"image_url" varchar,
	"category_id" integer NOT NULL
);
