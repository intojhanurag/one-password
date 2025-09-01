package services

import (
    "errors"
    "github.com/intojhanurag/One-Password/apps/api/internals/models"
    "github.com/intojhanurag/One-Password/apps/api/internals/repository"
    "github.com/intojhanurag/One-Password/apps/api/internals/utils"
    "gorm.io/gorm"
)

type APIKeyService struct {
    Repo repository.APIKeyRepository
    DB   *gorm.DB
    MasterKey []byte
}

type CreateAPIKeyInput struct {
    Name string
    Key  string 
    Description string
    Tags string
    OwnerID uint
}

type CreateAPIKeyResult struct {
    ID uint
    Name string
    Description string
    Tags string
    CreatedAt string
    PlaintextKey string 
}

func NewAPIKeyService(repo repository.APIKeyRepository, db *gorm.DB, masterKey []byte) *APIKeyService {
    return &APIKeyService{Repo: repo, DB: db, MasterKey: masterKey}
}

func (s *APIKeyService) Create(in CreateAPIKeyInput) (*CreateAPIKeyResult, error) {
    if in.Name == "" || in.Key == "" {
        return nil, errors.New("name and key required")
    }

    ct, nonce, err := utils.EncryptAPIKey(s.MasterKey, in.Key)
    if err != nil {
        return nil, err
    }

    k := &models.APIKey{
        Name: in.Name,
        OwnerID: in.OwnerID,
        Ciphertext: ct,
        Nonce: nonce,
        Description: in.Description,
        Tags: in.Tags,
    }

    if err := s.Repo.Create(s.DB, k); err != nil {
        return nil, err
    }

    return &CreateAPIKeyResult{
        ID: k.ID,
        Name: k.Name,
        Description: k.Description,
        Tags: k.Tags,
        PlaintextKey: in.Key, 
    }, nil
}


func (s *APIKeyService) List(ownerID uint) ([]models.APIKey, error) {
    return s.Repo.ListByOwner(s.DB, ownerID)
}

func (s *APIKeyService) GetByName(ownerID uint, name string) (string, error) {
    key,err:=s.Repo.FindByOwnerAndName(s.DB, ownerID, name) 

    if err != nil {
        return "", err
    }

    plaintext,err:=utils.DecryptAPIKey(s.MasterKey, key.Ciphertext, key.Nonce)

    if err!=nil {
        return "",err
    }
    return plaintext, err
}

func (s *APIKeyService) DeleteByName(ownerID uint, name string) error {
    return s.Repo.Delete(s.DB, ownerID, name)
}

func (s *APIKeyService) GetDecrypted(ownerID, id uint) (string, error) {
    rec, err := s.Repo.GetByID(s.DB, ownerID, id)
    if err != nil {
        return "", err
    }
    return utils.DecryptAPIKey(s.MasterKey, rec.Ciphertext, rec.Nonce)
}

