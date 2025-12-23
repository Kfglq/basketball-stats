// internal/repository/postgres_user.go
package repository

import (
	"context"
	"fmt"
	"side/internal/model"

	"github.com/jmoiron/sqlx"
)

type TeamRepository interface {
	GetAllTeams(ctx context.Context) ([]model.Team, error)
	GetSingleTeamById(ctx context.Context, id string) (model.SingleTeam, error)
}

type teamRepository struct {
	db *sqlx.DB
}

func NewTeamRepository(db *sqlx.DB) TeamRepository {
	return &teamRepository{db: db}
}

func (r *teamRepository) GetAllTeams(ctx context.Context) ([]model.Team, error) {
	query := `
		SELECT
			cn.conference_name,
			dn.division_name,
			tm.team_id,
			tm.team_en_name,
			tm.team_tw_name,
			tm.team_color
		FROM teams tm
		LEFT JOIN conferences cn ON cn.conference_id = tm.conference_id
		LEFT JOIN divisions dn ON dn.division_id = tm.division_id AND dn.conference_id = tm.conference_id
	`

	var teams []model.Team

	err := r.db.SelectContext(ctx, &teams, query)

	if err != nil {
		return nil, fmt.Errorf("repository: failed to query all teams: %w", err)
	}

	return teams, nil
}

func (r *teamRepository) GetSingleTeamById(ctx context.Context, id string) (model.SingleTeam, error) {
	query := `
		SELECT
			pa.player_id,
			pa.name,
			pa.team,
			STRING_AGG(po.position_ab_name, '/') AS position_names,
			pa.overall,
			pa."version"
		FROM "players_attributes" pa
		CROSS JOIN LATERAL UNNEST(pa."position") AS pa_unnest(position_id)
		LEFT JOIN "position" po ON pa_unnest.position_id = po."position_id"
		WHERE team = $1
		GROUP BY 
			pa.player_id,
			pa."version"
		ORDER BY overall DESC
	`

	var roster []model.PlayerBasic

	err := r.db.SelectContext(ctx, &roster, query, id)

	if err != nil {
		return model.SingleTeam{}, fmt.Errorf("repository: failed to query team %s players: %w", id, err)
	}

	return model.SingleTeam{Roster: roster}, nil
}
