# ===== Supabase restore + start script =====

$ProjectRoot = Get-Location
$BackupFolder = Read-Host "Enter path to backup folder"  # e.g. E:\code\tutorials\next-spotify-clone\supabase-backup-2026-02-06_10-45-12

$DbContainer = "supabase_db_next-spotify-clone"
$StorageVolume = "supabase_storage_next-spotify-clone"

# ---- Step 1: Start Supabase ----
Write-Host "Starting local Supabase..."
pnpm dlx supabase start

# ---- Step 2: Restore DB ----
$DbDump = Join-Path $BackupFolder "db.dump"

if (Test-Path $DbDump) {
    Write-Host "Restoring database dump..."
    docker cp "$DbDump" "${DbContainer}:/tmp/db.dump"
    docker exec -it $DbContainer pg_restore -U postgres -d postgres --clean --if-exists /tmp/db.dump
} else {
    Write-Host "⚠️  DB dump not found at $DbDump"
}

# ---- Step 3: Restore Storage ----
$StorageBackup = Join-Path $BackupFolder "storage"

if (Test-Path $StorageBackup) {
    Write-Host "Restoring storage files to Docker volume..."
    docker run --rm -v "${StorageVolume}:/storage" -v "${StorageBackup}:/backup" busybox sh -c "cp -a /backup/. /storage/"
} else {
    Write-Host "⚠️  Storage folder not found at $StorageBackup"
}

Write-Host ""
Write-Host "✅ Supabase restore complete. Your local environment is ready."
