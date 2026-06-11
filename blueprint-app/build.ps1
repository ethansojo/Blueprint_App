# Bundle index.html + data.js -> Blueprint_App.html (single self-contained file)
# Run this whenever you change data.js or index.html and want to share the app.
#
# Usage:  powershell -File build.ps1
# Output: ..\Blueprint_App.html  (one file your recipient can double-click)

$here   = $PSScriptRoot
$index  = Join-Path $here 'index.html'
$data   = Join-Path $here 'data.js'
$fields = Join-Path $here 'fields-data.js'
$intake = Join-Path $here 'intake-data.js'
$out    = Join-Path (Split-Path $here -Parent) 'Blueprint_App.html'

# Read files as UTF-8 (so multi-byte characters survive intact)
$indexHtml = [System.IO.File]::ReadAllText($index,  [System.Text.Encoding]::UTF8)
$dataJs    = [System.IO.File]::ReadAllText($data,   [System.Text.Encoding]::UTF8)
$fieldsJs  = [System.IO.File]::ReadAllText($fields, [System.Text.Encoding]::UTF8)
$intakeJs  = [System.IO.File]::ReadAllText($intake, [System.Text.Encoding]::UTF8)

# Build the inline replacements (note: no non-ASCII chars in this script source)
$banner  = "/* Inlined from data.js -- edit blueprint-app/data.js then re-run build.ps1 */"
$inline  = "<script>`r`n$banner`r`n$dataJs`r`n</script>"
$banner2 = "/* Inlined from fields-data.js -- edit via the in-app editor then re-run build.ps1 */"
$inline2 = "<script>`r`n$banner2`r`n$fieldsJs`r`n</script>"

# Replace the external script tags with inline blocks
$pattern  = '<script\s+src="data\.js"[^>]*>\s*</script>'
$bundled  = [System.Text.RegularExpressions.Regex]::Replace(
              $indexHtml,
              $pattern,
              [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $inline })
$pattern2 = '<script\s+src="fields-data\.js"[^>]*>\s*</script>'
$bundled  = [System.Text.RegularExpressions.Regex]::Replace(
              $bundled,
              $pattern2,
              [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $inline2 })
$banner3 = "/* Inlined from intake-data.js -- edit blueprint-app/intake-data.js then re-run build.ps1 */"
$inline3 = "<script>`r`n$banner3`r`n$intakeJs`r`n</script>"
$pattern3 = '<script\s+src="intake-data\.js"[^>]*>\s*</script>'
$bundled  = [System.Text.RegularExpressions.Regex]::Replace(
              $bundled,
              $pattern3,
              [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $inline3 })

# Sanity checks
if ($bundled -match '<script\s+src="(data|fields-data|intake-data)\.js"') {
  Write-Error 'Build failed: external js reference still present in output.'
  exit 1
}
if (-not ($bundled -match 'const\s+SOURCES')) {
  Write-Error 'Build failed: data.js content not detected in output.'
  exit 1
}
if (-not ($bundled -match 'var\s+FIELDS_DATA')) {
  Write-Error 'Build failed: fields-data.js content not detected in output.'
  exit 1
}
if (-not ($bundled -match 'const\s+INTAKE_SECTIONS')) {
  Write-Error 'Build failed: intake-data.js content not detected in output.'
  exit 1
}

# Write UTF-8 without BOM (browsers handle this fine)
[System.IO.File]::WriteAllText($out, $bundled, (New-Object System.Text.UTF8Encoding($false)))

$kb = [math]::Round(((Get-Item $out).Length / 1024), 1)
Write-Host "Built: $out  ($kb KB) -- share this file"
