// internal/repository/postgres_user.go
package repository

import (
	"context"
	"fmt"
	"side/internal/model"

	"github.com/jmoiron/sqlx"
)

type PlayerRepository interface {
	GetPlayerById(ctx context.Context, player_id string) (model.PlayerDetails, error)
}

type playerRepository struct {
	db *sqlx.DB
}

func NewPlayerRepository(db *sqlx.DB) PlayerRepository {
	return &playerRepository{db: db}
}

func (r *playerRepository) GetPlayerById(ctx context.Context, player_id string) (model.PlayerDetails, error) {
	query := `
		SELECT
			pa.*,
			STRING_AGG(po.position_ab_name, '/') AS position_names
		FROM "players_attributes" pa
		CROSS JOIN LATERAL UNNEST(pa."position") AS pa_unnest(position_id)
		LEFT JOIN "position" po ON pa_unnest.position_id = po."position_id"
		WHERE player_id = $1
		GROUP BY 
			pa."player_id",
			pa."version"
		ORDER BY overall DESC
	`

	var player model.PlayerDetails
	err := r.db.GetContext(ctx, &player, query, player_id)

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return model.PlayerDetails{}, fmt.Errorf("repository: player %s not found", player_id)
		}
		return model.PlayerDetails{}, fmt.Errorf("repository: failed to query player %s: %w", player_id, err)
	}

	return player, nil
}
