# ===== Supabase local backup script =====

$ProjectRoot = Get-Location
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupDir = Join-Path $ProjectRoot "supabase-backup-$Timestamp"

$DbContainer = "supabase_db_next-spotify-clone"
$StorageVolume = "supabase_storage_next-spotify-clone"

Write-Host "Creating backup directory..."
New-Item -ItemType Directory -Path $BackupDir | Out-Null

# ---- DB backup ----
Write-Host "Dumping database..."
docker exec -t $DbContainer pg_dump `
  -U postgres `
  -d postgres `
  --format=custom `
  -f /tmp/db.dump

Write-Host "Copying database dump..."
docker cp "${DbContainer}:/tmp/db.dump" "$BackupDir\db.dump"

# ---- Storage backup ----
Write-Host "Copying storage files from Docker volume..."
docker run --rm -v "${StorageVolume}:/storage" -v "${BackupDir}/storage:/backup" busybox sh -c "cp -a /storage/. /backup/"

Write-Host ""
Write-Host "Supabase backup complete."
Write-Host "Backup location: $BackupDir"
