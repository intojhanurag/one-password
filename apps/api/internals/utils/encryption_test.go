package utils

import (
	"encoding/base64"
	"strings"
	"testing"
)

// 32-byte key for AES-256
var testMasterKey = []byte("0123456789abcdef0123456789abcdef")

func TestEncryptDecrypt_RoundTrip(t *testing.T) {
	plaintext := "super-secret-api-key"

	cipherB64, nonceB64, err := EncryptAPIKey(testMasterKey, plaintext)
	if err != nil {
		t.Fatalf("EncryptAPIKey returned error: %v", err)
	}
	if cipherB64 == "" || nonceB64 == "" {
		t.Fatalf("expected non-empty cipher and nonce, got %q %q", cipherB64, nonceB64)
	}

	decrypted, err := DecryptAPIKey(testMasterKey, cipherB64, nonceB64)
	if err != nil {
		t.Fatalf("DecryptAPIKey returned error: %v", err)
	}
	if decrypted != plaintext {
		t.Fatalf("decrypted plaintext mismatch: got %q want %q", decrypted, plaintext)
	}
}

func TestEncryptAPIKey_InvalidMasterKeyLength(t *testing.T) {
	_, _, err := EncryptAPIKey([]byte("short-key"), "data")
	if err == nil || !strings.Contains(err.Error(), "32 bytes") {
		t.Fatalf("expected error about 32 bytes, got %v", err)
	}
}

func TestDecryptAPIKey_InvalidMasterKeyLength(t *testing.T) {
	// Use valid base64 strings to reach key length check
	_, err := DecryptAPIKey([]byte("short-key"), base64.StdEncoding.EncodeToString([]byte("abc")), base64.StdEncoding.EncodeToString([]byte("def")))
	if err == nil || !strings.Contains(err.Error(), "32 bytes") {
		t.Fatalf("expected error about 32 bytes, got %v", err)
	}
}

func TestDecryptAPIKey_InvalidBase64(t *testing.T) {
	_, err := DecryptAPIKey(testMasterKey, "not-base64!!!", "also-not-base64")
	if err == nil {
		t.Fatalf("expected base64 decode error, got nil")
	}
}

func TestDecryptAPIKey_TamperedCiphertext(t *testing.T) {
	plaintext := "another-secret"
	cipherB64, nonceB64, err := EncryptAPIKey(testMasterKey, plaintext)
	if err != nil {
		t.Fatalf("EncryptAPIKey error: %v", err)
	}

	// Tamper with the ciphertext (flip some chars)
	decoded, err := base64.StdEncoding.DecodeString(cipherB64)
	if err != nil {
		t.Fatalf("decode cipher: %v", err)
	}
	if len(decoded) == 0 {
		t.Fatalf("ciphertext unexpectedly empty")
	}
	decoded[0] ^= 0xFF
	badCipherB64 := base64.StdEncoding.EncodeToString(decoded)

	_, err = DecryptAPIKey(testMasterKey, badCipherB64, nonceB64)
	if err == nil {
		t.Fatalf("expected auth failure on tampered ciphertext, got nil")
	}
}

func TestDecryptAPIKey_WrongNonceLength(t *testing.T) {
	plaintext := "nonce-test"
	cipherB64, _, err := EncryptAPIKey(testMasterKey, plaintext)
	if err != nil {
		t.Fatalf("EncryptAPIKey error: %v", err)
	}
	// Provide a nonce that decodes but has wrong length; GCM.Open will panic.
	wrongNonce := base64.StdEncoding.EncodeToString([]byte("short"))
	defer func() {
		if r := recover(); r == nil {
			t.Fatalf("expected panic due to wrong nonce length, but no panic occurred")
		}
	}()
	_, _ = DecryptAPIKey(testMasterKey, cipherB64, wrongNonce)
}


