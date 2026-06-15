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
$valid  = Join-Path $here 'validation.js'
$flags  = Join-Path $here 'flags.js'
$out    = Join-Path (Split-Path $here -Parent) 'Blueprint_App.html'

# Read files as UTF-8 (so multi-byte characters survive intact)
$indexHtml = [System.IO.File]::ReadAllText($index,  [System.Text.Encoding]::UTF8)
$dataJs    = [System.IO.File]::ReadAllText($data,   [System.Text.Encoding]::UTF8)
$fieldsJs  = [System.IO.File]::ReadAllText($fields, [System.Text.Encoding]::UTF8)
$intakeJs  = [System.IO.File]::ReadAllText($intake, [System.Text.Encoding]::UTF8)
$validJs   = [System.IO.File]::ReadAllText($valid,  [System.Text.Encoding]::UTF8)
$flagsJs   = [System.IO.File]::ReadAllText($flags,  [System.Text.Encoding]::UTF8)

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
$banner4 = "/* Inlined from validation.js -- edit blueprint-app/validation.js then re-run build.ps1 */"
$inline4 = "<script>`r`n$banner4`r`n$validJs`r`n</script>"
$pattern4 = '<script\s+src="validation\.js"[^>]*>\s*</script>'
$bundled  = [System.Text.RegularExpressions.Regex]::Replace(
              $bundled,
              $pattern4,
              [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $inline4 })
$banner5 = "/* Inlined from flags.js -- edit blueprint-app/flags.js then re-run build.ps1 */"
$inline5 = "<script>`r`n$banner5`r`n$flagsJs`r`n</script>"
$pattern5 = '<script\s+src="flags\.js"[^>]*>\s*</script>'
$bundled  = [System.Text.RegularExpressions.Regex]::Replace(
              $bundled,
              $pattern5,
              [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $inline5 })

# Sanity checks
if ($bundled -match '<script\s+src="(data|fields-data|intake-data|validation|flags)\.js"') {
  Write-Error 'Build failed: external js reference still present in output.'
  exit 1
}
if (-not ($bundled -match 'function\s+vFieldBlocks')) {
  Write-Error 'Build failed: validation.js content not detected in output.'
  exit 1
}
if (-not ($bundled -match 'function\s+flBuildAll')) {
  Write-Error 'Build failed: flags.js content not detected in output.'
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
