// internal/service/player.go
package service

import (
	"context"
	"side/internal/model"
	"side/internal/repository"
)

type PlayerService interface {
	GetPlayerById(ctx context.Context, player_id string) (model.PlayerDetails, error)
}

type playerService struct {
	playerRepo repository.PlayerRepository
}

func NewPlayerService(repo repository.PlayerRepository) PlayerService {
	return &playerService{playerRepo: repo}
}

func (s *playerService) GetPlayerById(ctx context.Context, player_id string) (model.PlayerDetails, error) {
	playerData, err := s.playerRepo.GetPlayerById(ctx, player_id)
	if err != nil {
		return model.PlayerDetails{}, err
	}
	return playerData, nil
}
