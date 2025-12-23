// internal/model/team.go
package model

type PlayerBasic struct {
	PlayerID int    `db:"player_id" json:"playerId"`
	Name     string `db:"name" json:"name"`
	Team     string `db:"team" json:"team"`
	Position string `db:"position_names" json:"position"`
	Overall  int    `db:"overall" json:"overall"`
	Version  string `db:"version" json:"version"`
}

type PlayerDetails struct {
	PlayerID             int    `db:"player_id" json:"playerId"`
	Name                 string `db:"name" json:"name"`
	Team                 string `db:"team" json:"team"`
	PositionID           string `db:"position" json:"positionId"`
	Position             string `db:"position_names" json:"position"`
	Overall              int    `db:"overall" json:"overall"`
	CloseShot            int    `db:"close_shot" json:"closeShot"`
	MidRangeShot         int    `db:"mid_range_shot" json:"midRangeShot"`
	ThreePointShot       int    `db:"three_point_shot" json:"threePointShot"`
	FreeThrow            int    `db:"free_throw" json:"freeThrow"`
	ShotIQ               int    `db:"shot_iq" json:"shotIQ"`
	OffensiveConsistency int    `db:"offensive_consistency" json:"offensiveConsistency"`
	Layup                int    `db:"layup" json:"layup"`
	StandingDunk         int    `db:"standing_dunk" json:"standingDunk"`
	DrivingDunk          int    `db:"driving_dunk" json:"drivingDunk"`
	PostHook             int    `db:"post_hook" json:"postHook"`
	PostFade             int    `db:"post_fade" json:"postFade"`
	PostControl          int    `db:"post_control" json:"postControl"`
	DrawFoul             int    `db:"draw_foul" json:"drawFoul"`
	Hands                int    `db:"hands" json:"hands"`
	InteriorDefense      int    `db:"interior_defense" json:"interiorDefense"`
	PerimeterDefense     int    `db:"perimeter_defense" json:"perimeterDefense"`
	Steal                int    `db:"steal" json:"steal"`
	Block                int    `db:"block" json:"block"`
	HelpDefenseIQ        int    `db:"help_defense_iq" json:"helpDefenseIQ"`
	PassPerception       int    `db:"pass_perception" json:"passPerception"`
	DefensiveConsistency int    `db:"defensive_consistency" json:"defensiveConsistency"`
	Speed                int    `db:"speed" json:"speed"`
	Agility              int    `db:"agility" json:"agility"`
	Strength             int    `db:"strength" json:"strength"`
	Vertical             int    `db:"vertical" json:"vertical"`
	Stamina              int    `db:"stamina" json:"stamina"`
	Hustle               int    `db:"hustle" json:"hustle"`
	OverallDurability    int    `db:"overall_durability" json:"overallDurability"`
	PassAccuracy         int    `db:"pass_accuracy" json:"passAccuracy"`
	BallHandle           int    `db:"ball_handle" json:"ballHandle"`
	SpeedWithBall        int    `db:"speed_with_ball" json:"speedWithBall"`
	PassIQ               int    `db:"pass_iq" json:"passIQ"`
	PassVision           int    `db:"pass_vision" json:"passVision"`
	OffensiveRebound     int    `db:"offensive_rebound" json:"offensiveRebound"`
	DefensiveRebound     int    `db:"defensive_rebound" json:"defensiveRebound"`
	Intangibles          int    `db:"intangibles" json:"intangibles"`
	Potential            string `db:"potential" json:"potential"`
	Version              string `db:"version" json:"version"`
}
