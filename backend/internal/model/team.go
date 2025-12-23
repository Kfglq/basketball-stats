// internal/model/team.go
package model

type Team struct {
	ConferenceName string `db:"conference_name" json:"conferenceName"`
	DivisionName   string `db:"division_name" json:"divisionName"`
	TeamID         string `db:"team_id" json:"teamId"`
	TeamENName     string `db:"team_en_name" json:"teamEnName"`
	TeamTWName     string `db:"team_tw_name" json:"teamTwName"`
	TeamColor      string `db:"team_color" json:"teamColor"`
}

type SingleTeam struct {
	Roster []PlayerBasic `db:"roster" json:"roster"`
}
