# syntax=docker/dockerfile:1

FROM golang:1.24-alpine AS builder
WORKDIR /app

# Install build deps
RUN apk add --no-cache git ca-certificates

# Cache go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./

FROM gcr.io/distroless/base-debian12:nonroot
WORKDIR /app

COPY --from=builder /app/server /app/server
EXPOSE 5000
USER nonroot:nonroot

ENV PORT=5000
CMD ["/app/server"]


