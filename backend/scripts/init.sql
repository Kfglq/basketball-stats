-- backend/scripts/init.sql
-- 為了確保重複執行不會出錯，先刪除已存在的表（注意刪除順序要考慮外鍵關係）
DROP TABLE IF EXISTS "public"."players_attributes";
DROP TABLE IF EXISTS "public"."players";
DROP TABLE IF EXISTS "public"."teams";
DROP TABLE IF EXISTS "public"."divisions";
DROP TABLE IF EXISTS "public"."conferences";
DROP TABLE IF EXISTS "public"."nationality";
DROP TABLE IF EXISTS "public"."position";

-- 建立 Conferences
CREATE TABLE "public"."conferences" (
  "conference_id" int2 NOT NULL,
  "conference_name" varchar(20) NOT NULL,
  PRIMARY KEY ("conference_id"),
  CONSTRAINT "conferences_conference_name_key" UNIQUE ("conference_name")
);

-- 建立 Divisions
CREATE TABLE "public"."divisions" (
  "conference_id" int2 NOT NULL,
  "division_id" int2 NOT NULL,
  "division_name" varchar(20) NOT NULL,
  PRIMARY KEY ("division_id"),
  CONSTRAINT "divisions_division_name_key" UNIQUE ("division_name")
);

-- 建立 Nationality
CREATE TABLE "public"."nationality" (
  "nationality_id" char(3) NOT NULL,
  "nationality_en_name" varchar(100) NOT NULL,
  "nationality_tw_name" varchar(100) NOT NULL,
  PRIMARY KEY ("nationality_id")
);

-- 建立 Teams
CREATE TABLE "public"."teams" (
  "conference_id" int2,
  "division_id" int2,
  "team_id" varchar(3) NOT NULL,
  "team_en_name" varchar(50) NOT NULL,
  "team_tw_name" varchar(50) NOT NULL,
  "team_color" varchar(7) DEFAULT '#000000',
  PRIMARY KEY ("team_id"),
  CONSTRAINT "teams_new_team_en_name_key" UNIQUE ("team_en_name"),
  CONSTRAINT "teams_team_tw_name_key" UNIQUE ("team_tw_name")
);
CREATE INDEX "idx_teams_conference_division" ON "public"."teams" ("conference_id", "division_id");

-- 建立 Players (基本資料)
CREATE TABLE "public"."players" (
  "player_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
  "name" varchar(100) NOT NULL,
  "birth_date" date,
  "nationality1" char(3),
  "nationality2" char(3),
  "height" int4,
  "weight" int4,
  "wingspan" int4,
  "draft" int4,
  "pick" int4,
  "hometown" varchar(100),
  "prior" varchar(100),
  PRIMARY KEY ("player_id")
);

-- 建立 Position (屬性名稱)
CREATE TABLE "public"."position" (
  "position_id" SERIAL PRIMARY KEY,
  "position_ab_name" varchar(15) NOT NULL,
  "position_en_name" varchar(80) NOT NULL,
  "position_tw_name" varchar(35) NOT NULL
);

-- 建立 Players Attributes (球員數值 - 這是你 Repository 主要 Query 的表)
CREATE TABLE "public"."players_attributes" (
  "player_id" int4 NOT NULL,
  "version" date NOT NULL,
  "name" varchar(100),
  "team" char(3),
  "position" int4[],
  "overall" int2,
  "close_shot" int2,
  "mid_range_shot" int2,
  "three_point_shot" int2,
  "free_throw" int2,
  "shot_iq" int2,
  "offensive_consistency" int2,
  "layup" int2,
  "standing_dunk" int2,
  "driving_dunk" int2,
  "post_hook" int2,
  "post_fade" int2,
  "post_control" int2,
  "draw_foul" int2,
  "hands" int2,
  "interior_defense" int2,
  "perimeter_defense" int2,
  "steal" int2,
  "block" int2,
  "help_defense_iq" int2,
  "pass_perception" int2,
  "defensive_consistency" int2,
  "speed" int2,
  "agility" int2,
  "strength" int2,
  "vertical" int2,
  "stamina" int2,
  "hustle" int2,
  "overall_durability" int2,
  "pass_accuracy" int2,
  "ball_handle" int2,
  "speed_with_ball" int2,
  "pass_iq" int2,
  "pass_vision" int2,
  "offensive_rebound" int2,
  "defensive_rebound" int2,
  "intangibles" int2,
  "potential" varchar(2),
  PRIMARY KEY ("player_id", "version"),
  CONSTRAINT "players_attributes_position_check" CHECK (array_length("position", 1) <= 5)
);
