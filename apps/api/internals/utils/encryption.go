package utils

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "errors"
    "io"
)


func EncryptAPIKey(masterKey []byte, plaintext string) (ciphertextB64, nonceB64 string, err error) {
    if len(masterKey) != 32 {
        return "", "", errors.New("master key must be 32 bytes (AES-256)")
    }

    block, err := aes.NewCipher(masterKey)
    if err != nil {
        return "", "", err
    }

    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", "", err
    }

    nonce := make([]byte, gcm.NonceSize()) // 12 bytes
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return "", "", err
    }

    ciphertext := gcm.Seal(nil, nonce, []byte(plaintext), nil)
    return base64.StdEncoding.EncodeToString(ciphertext), base64.StdEncoding.EncodeToString(nonce), nil
}

func DecryptAPIKey(masterKey []byte, ciphertextB64, nonceB64 string) (string, error) {
    if len(masterKey) != 32 {
        return "", errors.New("master key must be 32 bytes (AES-256)")
    }

    ciphertext, err := base64.StdEncoding.DecodeString(ciphertextB64)
    if err != nil {
        return "", err
    }
    nonce, err := base64.StdEncoding.DecodeString(nonceB64)
    if err != nil {
        return "", err
    }

    block, err := aes.NewCipher(masterKey)
    if err != nil {
        return "", err
    }

    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }

    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        return "", err
    }

    return string(plaintext), nil
}
