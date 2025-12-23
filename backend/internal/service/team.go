// internal/service/team.go
package service

import (
	"context"
	"side/internal/model"
	"side/internal/repository"
)

type TeamService interface {
	GetAllTeams(ctx context.Context) ([]model.Team, error)
	GetSingleTeamById(ctx context.Context, id string) (model.SingleTeam, error)
}

type teamService struct {
	teamRepo repository.TeamRepository
}

func NewTeamService(repo repository.TeamRepository) TeamService {
	return &teamService{teamRepo: repo}
}

func (s *teamService) GetAllTeams(ctx context.Context) ([]model.Team, error) {
	teams, err := s.teamRepo.GetAllTeams(ctx)
	if err != nil {
		return nil, err
	}
	return teams, nil
}

func (s *teamService) GetSingleTeamById(ctx context.Context, id string) (model.SingleTeam, error) {
	singleTeam, err := s.teamRepo.GetSingleTeamById(ctx, id)
	if err != nil {
		return model.SingleTeam{}, err
	}
	return singleTeam, nil
}
