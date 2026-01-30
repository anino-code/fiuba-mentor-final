.PHONY: db run start stop deps

db:
	docker compose up -d

run:
	npm run dev

start: db run

stop:
	docker compose down && fuser -k 3000/tcp || true

deps:
	npm install