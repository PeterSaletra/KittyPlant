FROM golang:1.24-alpine AS builder

ENV APP_HOME=/go/src/api

WORKDIR "$APP_HOME"
COPY . .

RUN go mod download
RUN go mod verify
RUN go build -o api

FROM golang:1.24-alpine

ENV APP_HOME=/go/src/api
RUN mkdir -p "$APP_HOME"
WORKDIR "$APP_HOME"

COPY --from=builder "$APP_HOME"/api $APP_HOME

EXPOSE 8000
CMD ["./api"]