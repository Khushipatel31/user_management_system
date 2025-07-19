#!/bin/bash

CONTAINER_NAME=hexylon_task-postgres-1

echo "🚀 Starting migration process..."

for file in migrations/*.sql; do
  filename=$(basename "$file")
  echo "📄 Applying migration: $filename"

  # Copy file into container
  docker cp "$file" "$CONTAINER_NAME":/tmp/"$filename"

  # Run the file inside Postgres
  docker exec -u postgres "$CONTAINER_NAME" psql -d cleanapp -f /tmp/"$filename"
done

echo "✅ All migrations applied successfully."
