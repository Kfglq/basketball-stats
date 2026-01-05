// internal/repository/integration_test.go
package repository

import (
	"context"
	"os"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func setupTestDB(t *testing.T) *sqlx.DB {
	dsn := os.Getenv("TEST_DB_URL")
	if dsn == "" {
		t.Skip("跳過整合測試：未設定 TEST_DB_URL")
	}
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		t.Fatalf("無法連線至測試資料庫: %v", err)
	}
	return db
}

func TestAllAPI_Integration(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	ctx := context.Background()
	teamRepo := NewTeamRepository(db)
	playerRepo := NewPlayerRepository(db)

	// --- 基礎資料準備 ---
	// 修正 1：確保所有相關表格都被清空
	_, _ = db.Exec("TRUNCATE TABLE players_attributes, teams, divisions, conferences, position CASCADE")

	// 修正 2：使用更安全的插入方式，並確保順序
	// 1. Position
	_, err := db.Exec(`INSERT INTO position (position_id, position_ab_name, position_en_name, position_tw_name) 
                       VALUES (1, 'G', 'Guard', '後衛'), (2, 'F', 'Forward', '前鋒') ON CONFLICT DO NOTHING`)
	assert.NoError(t, err)

	// 2. Conference
	_, err = db.Exec("INSERT INTO conferences (conference_id, conference_name) VALUES (1, 'Western') ON CONFLICT DO NOTHING")
	assert.NoError(t, err)

	// 3. Division
	_, err = db.Exec("INSERT INTO divisions (conference_id, division_id, division_name) VALUES (1, 1, 'Pacific') ON CONFLICT DO NOTHING")
	assert.NoError(t, err)

	// 4. Team
	_, err = db.Exec(`INSERT INTO teams (team_id, team_en_name, team_tw_name, conference_id, division_id) 
                       VALUES ('LAL', 'Lakers', '湖人', 1, 1) ON CONFLICT DO NOTHING`)
	assert.NoError(t, err)

	// --- 開始測試 API ---

	// 1. GetAllTeams
	t.Run("GetAllTeams", func(t *testing.T) {
		teams, err := teamRepo.GetAllTeams(ctx)
		assert.NoError(t, err)
		if assert.NotEmpty(t, teams) {
			assert.Equal(t, "Lakers", teams[0].TeamENName)
		}
	})

	// 2. GetSingleTeamById
	t.Run("GetSingleTeamById", func(t *testing.T) {
		// 在測試 GetSingleTeam 前，必須先確保該隊伍有球員，否則 Roster 會是空的
		_, _ = db.Exec("DELETE FROM players_attributes WHERE player_id = 1")
		_, err := db.Exec(`
      INSERT INTO players_attributes (
        player_id, version, name, team, position, overall, 
        close_shot, mid_range_shot, three_point_shot, free_throw, shot_iq, 
        offensive_consistency, layup, standing_dunk, driving_dunk, post_hook, 
        post_fade, post_control, draw_foul, hands, interior_defense, 
        perimeter_defense, steal, block, help_defense_iq, pass_perception, 
        defensive_consistency, speed, agility, strength, vertical, 
        stamina, hustle, overall_durability, pass_accuracy, ball_handle, 
        speed_with_ball, pass_iq, pass_vision, offensive_rebound, 
        defensive_rebound, intangibles, potential
      ) 
      VALUES (
        1, '2024-01-01', 'LeBron James', 'LAL', '{1,2}', 99,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 'A+'
      )`)
		assert.NoError(t, err)

		res, err := teamRepo.GetSingleTeamById(ctx, "LAL")
		assert.NoError(t, err)
		if assert.NotEmpty(t, res.Roster) {
			assert.Equal(t, "LeBron James", res.Roster[0].Name)
		}
	})

	// 3. GetPlayerById
	t.Run("GetPlayerById", func(t *testing.T) {
		assert.NoError(t, err)
		res, err := playerRepo.GetPlayerById(ctx, "1")
		assert.NoError(t, err)
		if assert.NotNil(t, res) {
			assert.Equal(t, "LeBron James", res.Name)
			assert.Contains(t, res.Position, "G")
			assert.Contains(t, res.Position, "F")
		}
	})
}
